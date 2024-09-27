import logging
from django.http import HttpResponse
from django.utils.http import unquote
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import Mymusic
from .serializers import MyMusicSerializer, CountMusicSerializer
from account.models import CustomUser

logger = logging.getLogger(__name__)

# my music list
class MymusicViewSet( viewsets.ModelViewSet):
    queryset = Mymusic.objects.all()
    serializer_class = MyMusicSerializer
    
    # get user list
    def list(self, request) :
        users =CustomUser.objects.all()
        serializer = CountMusicSerializer(users, many=True)
        return Response(serializer.data)
    
    # get user endpoint url
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # login user action
    @action(detail=False, methods=['get', 'post', 'delete','patch',], url_path='user-music/(?P<username>[^/]+)')
    def user_music(self, request, username=None):
        username = unquote(username)
        user = get_object_or_404(CustomUser, username=username)

        # get music list
        if request.method == 'GET':
            logger.debug('Request data for get: %s', request.data)
            music = Mymusic.objects.filter(user=user)
            
            if not music.exists() :
                return Response({'error': 'Music not found'}, status=status.HTTP_404_NOT_FOUND)
            try:
                serializer = MyMusicSerializer(music, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except ValidationError as e :
                return Response({'error' : 'Invalid data', 'details' :e.detail}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e :
                return Response({'error' : 'An excepted error occured','details' : str(e)} ,status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # add music
        elif request.method == 'POST':
            data = request.data
            if not data :
                return Response(
                    {
                        'error' :'required for adding music',
                        'details' : f"'Data : 'data' ",
                    }, status=status.HTTP_400_BAD_REQUEST)
            logger.debug('Request data for post:')
            
            serializer = MyMusicSerializer(data=data)
            if serializer.is_valid():
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(
                {
                    'error' :'bad request',
                    'details' :f"Error : '{serializer.errors}'",
                    }, status=status.HTTP_400_BAD_REQUEST)
        
        # delete music
        elif request.method == 'DELETE':
            logger.debug('Request data for delete: %s', request.data)
            album = request.data.get('album')
            artist = request.data.get('artist')
            
            if not album or not artist or not album.strip() or not artist.strip() :
                return Response(
                    {
                    'error': 'required for deletion',
                    'details':f"'Album: '{album}' and artist: '{artist}' ", 
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            music = Mymusic.objects.filter(user=user, album=album, artist=artist)
            if not music.exists():
                return Response({'error': 'Music not found'}, status=status.HTTP_404_NOT_FOUND)
            
            music.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        
        #update music
        elif request.method == 'PATCH' :
            logger.debug('Request data for patch: %s', request.data)
            album = request.data.get('album')
            artist = request.data.get('artist')
            new_data = request.data.get('newdata' ,{})
            
            if not album or not artist or not new_data:
                return Response(
                    {'error': 'required for updating',
                     'details' :f"Album: '{album}' and artist: '{artist}' and newdata: '{new_data}' " ,
                     }, status=status.HTTP_400_BAD_REQUEST)

            music = Mymusic.objects.filter(user=user, album=album, artist=artist)
            if not music.exists():
                return Response({'error': 'Music not found'}, status=status.HTTP_404_NOT_FOUND)

            for item in music:
                serializer = MyMusicSerializer(item, data=new_data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            return Response({'message': 'Music updated successfully'}, status=status.HTTP_200_OK)

        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)