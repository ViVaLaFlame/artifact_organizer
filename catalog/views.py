from rest_framework import viewsets
from .models import Find, Site
from .serializers import FindSerializer, SiteSerializer

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    
class FindViewSet(viewsets.ModelViewSet):
    queryset = Find.objects.all()
    serializer_class = FindSerializer

