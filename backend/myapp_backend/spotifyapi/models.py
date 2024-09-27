from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class SpotifyToken(models.Model):
    access_token = models.CharField(max_length=255, default= settings.ACCESS_TOKEN)
    refresh_token = models.CharField(max_length=255, default= settings.REFRESH_TOKEN)
    token_expiry = models.DateTimeField(default=timezone.now() + timedelta(seconds=3600))

    def __str__(self):
         return  self.refresh_token
