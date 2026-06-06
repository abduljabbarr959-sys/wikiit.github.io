import re

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import Entry


def entry_snippet(content: str, max_chars: int = 200) -> str:
    if not content:
        return ''
    stripped = re.sub(r'[#*_`\[\]()>!|-]', '', content)
    stripped = re.sub(r'\n+', ' ', stripped).strip()
    if len(stripped) <= max_chars:
        return stripped
    return stripped[:max_chars].rsplit(' ', 1)[0] + '...'


class EntrySerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Entry
        fields = ['id', 'title', 'content', 'author', 'created_at', 'updated_at']


class EntryListSerializer(serializers.ModelSerializer):
    snippet = serializers.SerializerMethodField()

    class Meta:
        model = Entry
        fields = ['title', 'snippet', 'updated_at']

    def get_snippet(self, obj):
        return entry_snippet(obj.content)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {
                'error_messages': {
                    'unique': 'This username is already taken.',
                },
            },
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
