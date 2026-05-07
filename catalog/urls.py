from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FindViewSet, SiteViewSet, MaterialViewSet, EraViewSet, CultureViewSet, ArtifactTypeViewSet

router = DefaultRouter()
router.register(r'finds', FindViewSet)
router.register(r'sites', SiteViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'eras', EraViewSet)
router.register(r'cultures', CultureViewSet)
router.register(r'types', ArtifactTypeViewSet)

urlpatterns = [
    path('', include(router.urls))
]