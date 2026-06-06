from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.http import Http404
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import generics, pagination, status, throttling
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Entry
from .serializers import EntryListSerializer, EntrySerializer, UserSerializer


class EntryPagination(pagination.PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class EntryListView(APIView):
    pagination_class = EntryPagination

    def get(self, request):
        qs = Entry.objects.all()
        search = request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(title__icontains=search)

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(qs, request)
        if page is not None:
            data = EntryListSerializer(page, many=True).data
            return paginator.get_paginated_response(data)

        data = EntryListSerializer(qs, many=True).data
        return Response(data)


class EntryCreateView(generics.CreateAPIView):
    serializer_class = EntrySerializer
    queryset = Entry.objects.all()

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user if self.request.user.is_authenticated else None
        )

    def create(self, request, *args, **kwargs):
        title = request.data.get('title', '').strip()
        if not title:
            return Response(
                {'error': 'Title cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if Entry.objects.filter(title=title).exists():
            return Response(
                {'error': f"An entry with the title '{title}' already exists."},
                status=status.HTTP_409_CONFLICT
            )
        return super().create(request, *args, **kwargs)


class EntryDetailView(APIView):

    def get_object(self, title):
        try:
            return Entry.objects.get(title=title)
        except Entry.DoesNotExist:
            raise Http404

    def get(self, request, title):
        entry = self.get_object(title)
        serializer = EntrySerializer(entry)
        return Response(serializer.data)

    def put(self, request, title):
        entry = self.get_object(title)
        content = request.data.get('content', '')
        if not content:
            return Response(
                {'error': 'Content cannot be empty.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        entry.content = content
        entry.save()
        serializer = EntrySerializer(entry)
        return Response(serializer.data)

    def delete(self, request, title):
        entry = self.get_object(title)
        entry.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        login(request, user)
        return Response(
            {'id': user.id, 'username': user.username},
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username', '')
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'id': user.id, 'username': user.username})
        return Response(
            {'error': 'Invalid credentials.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class LogoutView(APIView):

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'authenticated': False})
        return Response({
            'authenticated': True,
            'id': request.user.id,
            'username': request.user.username,
        })


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '')
        if not email:
            return Response(
                {'error': 'Email is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {'detail': 'If an account with that email exists, a reset link has been sent.'},
                status=status.HTTP_200_OK
            )

        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{request.scheme}://{request.get_host()}/reset/{uid}/{token}/"

        send_mail(
            subject='wikiit Password Reset',
            message=f'Click here to reset your password: {reset_url}',
            from_email='noreply@wikiit.app',
            recipient_list=[email],
            fail_silently=True,
        )
        return Response(
            {'detail': 'If an account with that email exists, a reset link has been sent.'},
            status=status.HTTP_200_OK
        )
