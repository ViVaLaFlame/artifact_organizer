from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FindViewSet, SiteViewSet, MaterialViewSet

router = DefaultRouter()
router.register(r'finds', FindViewSet)
router.register(r'sites', SiteViewSet)
router.register(r'materials', MaterialViewSet)

urlpatterns = [
    path('', include(router.urls))
]