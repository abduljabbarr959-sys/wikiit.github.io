from django.conf import settings
from django.db import models


class Entry(models.Model):
    title = models.CharField(max_length=255, unique=True)
    content = models.TextField(blank=True, default='')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'entries'
        ordering = ['title']

    def __str__(self):
        return self.title
