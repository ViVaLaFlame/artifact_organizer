from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from .models import Find, Era, ArtifactType, Material, Condition

class FindAPITests(APITestCase):
    def setUp(self):
        self.user_author = User.objects.create_user(username='indiana_jones', password='password123')
        self.user_other = User.objects.create_user(username='stranger', password='password123')

        self.era = Era.objects.create(name="Античность")
        self.artifact_type = ArtifactType.objects.create(name="Посуда")
        self.condition = Condition.objects.create(name="Целая")
        self.material = Material.objects.create(name="Керамика")

        self.find = Find.objects.create(
            title="Амфора",
            author=self.user_author,
            era=self.era,
            artifact_type=self.artifact_type,
            condition=self.condition,
            status="storage"
        )
        self.find.materials.add(self.material)

    def test_get_finds_list_as_guest(self):
        url = reverse('find-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results'] if 'results' in response.data else response.data), 1)
        self.assertEqual(response.data[0]['title'] if type(response.data) is list else response.data['results'][0]['title'], 'Амфора')

    def test_create_find_unauthorized(self):
        url = reverse('find-list')
        data = {
            'title': 'Нелегальная находка',
            'status': 'field'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_find_authorized(self):
        url = reverse('find-list')
        self.client.force_authenticate(user=self.user_author)
        
        data = {
            'title': 'Римская монета',
            'era': self.era.id,
            'artifact_type': self.artifact_type.id,
            'condition': self.condition.id,
            'materials': [self.material.id],
            'status': 'field'
        }
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Find.objects.count(), 2)
        self.assertEqual(Find.objects.get(title='Римская монета').author, self.user_author)

    def test_update_find_permission_denied(self):
        url = reverse('find-detail', args=[self.find.id])
        self.client.force_authenticate(user=self.user_other)
        
        data = {'title': 'Попытка взлома'}
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.find.refresh_from_db()
        self.assertEqual(self.find.title, 'Амфора')

    def test_filter_finds_by_author(self):
        Find.objects.create(
            title="Чужой кувшин",
            author=self.user_other,
            status="field"
        )
        
        url = reverse('find-list')
        response = self.client.get(url, {'author__username': 'indiana_jones'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data['results'] if 'results' in response.data else response.data
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]['title'], 'Амфора')