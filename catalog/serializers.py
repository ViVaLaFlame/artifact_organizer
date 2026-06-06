from rest_framework import serializers
from .models import Find, Material, Era, Culture, ArtifactType, FindImage, Condition


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

class FindImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = FindImage
        fields = ['id', 'image']

class FindSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    era_name = serializers.CharField(source='era.name', read_only=True)
    author_name = serializers.CharField(source='author.username', read_only=True)
    images = FindImageSerializer(many=True, read_only=True)

    class Meta:
        model = Find
        fields = '__all__'
        read_only_fields = ['author']

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = '__all__'