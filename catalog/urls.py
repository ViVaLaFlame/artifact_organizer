from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FindViewSet, SiteViewSet

router = DefaultRouter()
router.register(r'finds', FindViewSet)
router.register(r'sites', SiteViewSet)

urlpatterns = [
    path('', include(router.urls))
]