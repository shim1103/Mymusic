from rest_framework import serializers
from .models import SpotifyToken

class RefreshTokenSerializer(serializers.ModelSerializer):
    class Meta :
        model = SpotifyToken
        fields =['access_token' , 'refresh_token','token_expiry']