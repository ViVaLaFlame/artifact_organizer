from django.contrib import admin
from .models import Era, Culture, ArtifactType, Condition, Material, Site, Find, FindImage

admin.site.register(Era)
admin.site.register(Culture)
admin.site.register(ArtifactType)
admin.site.register(Condition)
admin.site.register(Material)
admin.site.register(Site)
admin.site.register(FindImage)

@admin.register(Find)
class FindAdmin(admin.ModelAdmin):
    list_display = ('inv_number', 'title', 'site', 'era', 'status')
    list_filter = ('status', 'era', 'site', 'culture')
    search_fields = ('inv_number', 'title', 'description')