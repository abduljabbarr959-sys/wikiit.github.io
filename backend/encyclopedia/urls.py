from django.urls import path

from . import views

urlpatterns = [
    path('entries/', views.EntryListView.as_view(), name='api_entry_list'),
    path('entries/create/', views.EntryCreateView.as_view(), name='api_create_entry'),
    path('entries/<str:title>/', views.EntryDetailView.as_view(), name='api_entry_detail'),
    path('auth/register/', views.RegisterView.as_view(), name='api_register'),
    path('auth/login/', views.LoginView.as_view(), name='api_login'),
    path('auth/logout/', views.LogoutView.as_view(), name='api_logout'),
    path('auth/me/', views.MeView.as_view(), name='api_me'),
    path('auth/password-reset/', views.PasswordResetRequestView.as_view(), name='api_password_reset'),
]
