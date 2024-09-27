from django.db import models
from account.models import CustomUser

class Mymusic(models.Model) :
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='mymusic_set')
    album = models.CharField(max_length=255)
    artist =models.CharField(max_length=50)

    release = models.DateField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    asset = models.PositiveIntegerField(null=True, blank=True)
    image = models.URLField(null=True, blank=True)
    memo = models.TextField(null=True, blank=True)
    spotifylink = models.URLField(null=True, blank=True)
    applelink = models.URLField(null=True, blank=True)
    co_artist = models.CharField(max_length=255, null=True,blank=True, )
    is_fav = models.BooleanField(default=False)
    href = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.album} by {self.artist} at {self.user}"

class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'album', 'artist'], name='unique_user_album_artist')
        ]
