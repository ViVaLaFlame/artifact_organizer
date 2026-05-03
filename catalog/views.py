from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Find, Site
from .serializers import FindSerializer, SiteSerializer

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    
class FindViewSet(viewsets.ModelViewSet):
    queryset = Find.objects.select_related('site', 'era', 'culture').order_by('-created_at')
    serializer_class = FindSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filterset_fields = ['status', 'era', 'site', 'culture']
    search_fields = ['inv_nimber', 'title', 'description']
    ordering_fields = ['created_at', 'discovery_date', 'title']

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

