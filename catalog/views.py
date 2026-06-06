from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Find, Material, Era, Culture, ArtifactType, FindImage, Condition
from .serializers import FindSerializer, MaterialSerializer, EraSerializer, ArtifactTypeSerializer, CultureSerializer, ConditionSerializer
from .permissions import IsAuthorOrReadOnly
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class MaterialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class EraViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Era.objects.all()
    serializer_class = EraSerializer

class CultureViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Culture.objects.all()
    serializer_class = CultureSerializer

class ArtifactTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArtifactType.objects.all()
    serializer_class = ArtifactTypeSerializer

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            "email": request.user.email,
            "date_joined": request.user.date_joined.strftime('%d.%m.%Y')
        })
    
class ConditionViewSet(viewsets.ModelViewSet):
    queryset = Condition.objects.all()
    serializer_class = ConditionSerializer

    
class FindViewSet(viewsets.ModelViewSet):
    queryset = Find.objects.select_related('era', 'culture').order_by('-created_at')
    serializer_class = FindSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    filterset_fields = ['status', 'era', 'culture']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'discovery_date', 'title']

    def perform_create(self, serializer):
        find = serializer.save(author=self.request.user)
        images_data= self.request.FILES.getlist('gallery')
        for image_data in images_data:
            FindImage.objects.create(find=find, image=image_data)

    @action(detail=False, methods=['get'], permission_classes={IsAuthenticated})
    def my(self, request):
        queryset = Find.objects.filter(author=request.user).select_related('era', 'culture').order_by('-created_at')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

