from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FindViewSet, MaterialViewSet, EraViewSet, CultureViewSet, ArtifactTypeViewSet, ConditionViewSet

router = DefaultRouter()
router.register(r'finds', FindViewSet)
router.register(r'materials', MaterialViewSet)
router.register(r'eras', EraViewSet)
router.register(r'cultures', CultureViewSet)
router.register(r'types', ArtifactTypeViewSet)
router.register(r'conditions', ConditionViewSet)

urlpatterns = [
    path('', include(router.urls))
]