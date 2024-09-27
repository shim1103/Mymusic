import requests
import logging
import pytz
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SpotifyToken
from .serializers import RefreshTokenSerializer

logger = logging.getLogger('django')
japan_timezone = pytz.timezone('Asia/Tokyo')

class RefreshTokenView(APIView):
    # get or create SpotifyToken object
    def get_spotify_token(self):
        token_expiry = timezone.now().astimezone(japan_timezone) + timedelta(seconds=3600)
        if token_expiry.tzinfo is None:
            token_expiry = timezone.make_aware(token_expiry)

        spotify_token, created = SpotifyToken.objects.get_or_create(
            defaults={
                'access_token': settings.ACCESS_TOKEN,
                'refresh_token': settings.REFRESH_TOKEN,
                'token_expiry': token_expiry
            }
        )
        if created:
            logger.info("New SpotifyToken object created")
        else:
            logger.info("Existing SpotifyToken object retrieved")
        
        return spotify_token

    # refresh access_token
    def refresh_access_token(self, spotify_token):
        refresh_token = spotify_token.refresh_token
        response = requests.post(
            'https://accounts.spotify.com/api/token',
            data={
                'grant_type': 'refresh_token',
                'refresh_token': refresh_token,
            },
            headers={
                'Authorization': f'Basic {settings.SPOTIFY_CLIENT_CREDENTIALS}'
            }
        )
        if response.status_code == 200:
            response_data = response.json()
            access_token = response_data.get('access_token')
            expires_in = response_data.get('expires_in')
            token_expiry = timezone.now().astimezone(japan_timezone) + timedelta(seconds=expires_in)
            if token_expiry.tzinfo is None:
                token_expiry = timezone.make_aware(token_expiry)

            spotify_token.access_token = access_token
            spotify_token.token_expiry = token_expiry
            spotify_token.save()

            logger.info('Token refreshed successfully')
            return access_token, token_expiry
        else:
            response_data = response.json()
            logger.error('Failed to refresh token: %s', response_data)
            raise Exception('Failed to refresh token')

    # validation and expiry check
    def handle_token(self, spotify_token):
        now = timezone.now().astimezone(japan_timezone)
        if now.tzinfo is None:
            now = timezone.make_aware(now)

        if spotify_token.token_expiry.tzinfo is None:
            spotify_token.token_expiry = timezone.make_aware(spotify_token.token_expiry)

        if spotify_token.token_expiry <= now:
            logger.info('Token is expired, refreshing...')
            return self.refresh_access_token(spotify_token)
        else:
            logger.info('Token is still valid')
            return spotify_token.access_token, spotify_token.token_expiry

    # return access_token from request
    def get(self, request):
        try:
            spotify_token = self.get_spotify_token()
            access_token, token_expiry = self.handle_token(spotify_token)

            return Response({
                'access_token': access_token,
                'token_expiry': token_expiry,
            })

        except Exception as e:
            logger.error('Exception occurred: %s', str(e))
            return JsonResponse({
                'error': 'An error occurred',
                'details': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)