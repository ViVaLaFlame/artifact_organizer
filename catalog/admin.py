from django.contrib import admin
from .models import Era, Culture, ArtifactType, Condition, Material, Find, FindImage

admin.site.register(Era)
admin.site.register(Culture)
admin.site.register(ArtifactType)
admin.site.register(Condition)
admin.site.register(Material)
admin.site.register(FindImage)

@admin.register(Find)
class FindAdmin(admin.ModelAdmin):
    list_display = ('title', 'era', 'status')
    list_filter = ('status', 'era', 'culture')
    search_fields = ('title', 'description')