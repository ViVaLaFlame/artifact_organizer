from rest_framework import serializers
from .models import Find, Site, Material, Era, Culture, ArtifactType

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class EraSerializer(serializers.ModelSerializer):
    class Meta:
      model = Era
      fields = '__all__'

class CultureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Culture
        fields = '__all__'

class ArtifactTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArtifactType
        fields = '__all__'

class FindSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    era_name = serializers.CharField(source='era.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Find
        fields = '__all__'
        read_only_fields = ['author']