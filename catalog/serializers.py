from rest_framework import serializers
from .models import Find, Site

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = '__all__'

class FindSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    era_name = serializers.CharField(source='era.name', read_only=True)

    class Meta:
        model = Find
        fields = '__all__'