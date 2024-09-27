from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MymusicViewSet

router = DefaultRouter()
router.register(r'music', MymusicViewSet, basename='music')

urlpatterns = [
    path('', include(router.urls)),
]
