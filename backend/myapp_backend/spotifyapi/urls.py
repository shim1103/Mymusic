from django.urls import path
from .views import RefreshTokenView

urlpatterns = [
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
]
