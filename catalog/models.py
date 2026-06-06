from django.db import models
from django.contrib.auth.models import User


class Era(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название эпохи")
    start_year = models.IntegerField(null=True, blank=True, verbose_name="Год начала")
    end_year = models.IntegerField(null=True, blank=True, verbose_name="Год окончания")

    def __str__(self):
        return self.name
    
class Culture(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название культуры")
    era = models.ForeignKey(Era, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Эпоха")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

class ArtifactType(models.Model):
    name = models.CharField(max_length=100, verbose_name="Категория (Тип)")
    description = models.TextField(blank=True, verbose_name="Описание")

    def __str__(self):
        return self.name

class Condition(models.Model):
    name = models.CharField(max_length=100, verbose_name="Сохранность")

    def __str__(self):
        return self.name
    
class Material(models.Model):
    name = models.CharField(max_length=100, verbose_name="Материал")

    def __str__(self):
        return self.name
    
    
class Find(models.Model):
    STATUS_CHOICES = [
        ('field', 'В полевой лаборатории'),
        ('storage', 'В фондах'),
        ('exhibition', 'На экспозиции'),
        ('restoration', 'На реставрации'),
    ]

    title = models.CharField(max_length=200, verbose_name="Название находки")
    description = models.TextField(blank=True, verbose_name="Описание")
    discovery_date = models.DateField(null=True, blank=True, verbose_name="Дата обнаружения")
    image = models.ImageField(upload_to='finds_images/', null=True, blank=True, verbose_name='Фото')
    
    # Привязка к месту и стратиграфии
    site = models.CharField(max_length=255, blank=True, null=True, verbose_name="Раскоп (место)")
    excavation_area = models.CharField(max_length=50, blank=True, verbose_name="Участок/Раскоп")
    square = models.CharField(max_length=50, blank=True, verbose_name="Квадрат")
    depth = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True, verbose_name="Глубина (м)")
    layer = models.CharField(max_length=50, blank=True, verbose_name="Слой/Ярус")
    
    # Физические характеристики
    dimensions = models.CharField(max_length=100, blank=True, verbose_name="Размеры (ДxШxВ)")
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True, verbose_name="Вес (г)")
    condition_notes = models.TextField(blank=True, verbose_name="Заметки о сохранности")
    
    # Связи со справочниками
    era = models.ForeignKey(Era, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Эпоха")
    culture = models.ForeignKey(Culture, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Культура")
    artifact_type = models.ForeignKey(ArtifactType, on_delete=models.SET_NULL, null=True, verbose_name="Тип")
    condition = models.ForeignKey(Condition, on_delete=models.SET_NULL, null=True, verbose_name="Состояние")
    materials = models.ManyToManyField(Material, verbose_name="Материалы")
    
    # Служебная информация
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Автор записи")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='field', verbose_name="Статус")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создано")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлено")

    def __str__(self):
        return f"{self.title}"

class FindImage(models.Model):
    find = models.ForeignKey(Find, on_delete=models.CASCADE, related_name='images', verbose_name="Находка")
    image = models.ImageField(upload_to='finds_images/', verbose_name="Изображение")
    description = models.CharField(max_length=255, blank=True, verbose_name="Описание фото")
    is_main = models.BooleanField(default=False, verbose_name="Главное фото")
    order_index = models.IntegerField(default=0, verbose_name="Порядок вывода")
    uploaded_at = models.DateTimeField(auto_now_add=True, verbose_name="Загружено")

    def __str__(self):
        return f"Фото для {self.find.inv_number}"