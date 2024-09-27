from rest_framework import serializers
from .models import Mymusic
from account.models import CustomUser

class CountMusicSerializer(serializers.ModelSerializer) :
    album_count = serializers.IntegerField(source ='mymusic_set.count', read_only =True)
    end_point = serializers.SerializerMethodField(read_only=True)

    class Meta :
        model = CustomUser
        fields =['username', 'album_count', 'end_point']
        
    def get_end_point(self,obj) :
        request = self.context.get('request')
        return f"http://localhost:8000/api/music/user-music/{obj.username}/"
        
class MyMusicSerializer(serializers.ModelSerializer) :
    username = serializers.CharField(source ='user.username', read_only =True)
    class Meta:
        model =Mymusic
        fields =['username','album' ,'artist' ,'release', 'date','asset', 'image','memo','spotifylink' ,'applelink','co_artist','is_fav', 'href',]
