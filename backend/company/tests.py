from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import AboutCompany
from .serializers import AboutCompanySerializer


class AboutCompanyActualInfoViewCase(APITestCase):
    """
    Тестовый класс для проверки эндпоинта получения актуальной информации о компании.

    Содержит тесты для успешного получения актуальной информации о компании, а также
    для сценария, когда актуальная информация отсутствует и API возвращает ошибку 400.
    """
    def setUp(self):
        # Создаем тестовый объект About с is_actual=True
        self.about = AboutCompany.objects.create(
            fullname="Test Company LLC",
            shortname="TestCo",
            office_address="Test Address 123",
            telegram="https://t.me/test",
            instagram="https://instagram.com/test",
            email="test@example.com",
            phone_1="+123456789",
            phone_2="+987654321",
            is_actual=True,
        )
        self.url = reverse('about_company_request')

    def test_get_about_actual_info_success(self):
        """
        Тестирует успешный GET запрос, когда актуальная информация о компании существует.
        """
        response = self.client.get(self.url)
        serializer = AboutCompanySerializer(self.about)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data.get("result"), serializer.data)

    def test_get_about_actual_info_no_data(self):
        """
        Тестирует сценарий, когда нет актуальной информации о компании.
        Ожидается, что API вернет ошибку 400 с соответствующим сообщением.
        """
        # Удаляем все объекты About, чтобы эмулировать отсутствие актуальной информации
        AboutCompany.objects.all().delete()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data.get('detail'), "Нет актуальной информации о компании")
