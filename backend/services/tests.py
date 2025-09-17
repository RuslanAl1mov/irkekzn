from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

from .models import CallRequest


class ClientCallRequestCreateViewTest(APITestCase):
    """
    Тестовый класс для проверки создания запроса на звонок клиента.

    Данный класс содержит тест, проверяющий успешное создание запроса на звонок
    с минимальным набором данных (только имя и номер телефона). Дополнительно тест
    проверяет, что опциональные поля модели CallRequest остаются пустыми или равны None.
    """
    def setUp(self):
        self.url = reverse('create_client_call_request')
        # Данные, которые отправляет клиент: только имя и номер телефона.
        self.data = {
            "name": "Test Client",
            "phone": "+1234567890"
        }

    def test_create_call_request_success(self):
        """
        Тестирует успешное создание запроса на звонок.
        Клиент отправляет только имя и номер телефона,
        а остальные поля модели (status, comment, date_to_recall) остаются пустыми.
        """
        response = self.client.post(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], self.data["name"])
        self.assertEqual(response.data["phone"], self.data["phone"])

        # Проверяем, что объект был создан в базе данных
        self.assertEqual(CallRequest.objects.count(), 1)
        call_request = CallRequest.objects.first()
        self.assertEqual(call_request.name, self.data["name"])
        self.assertEqual(call_request.phone, self.data["phone"])
        # Дополнительно можно проверить, что опциональные поля пустые/None
        self.assertIsNone(call_request.status)
        self.assertIsNone(call_request.comment)
        self.assertIsNone(call_request.date_to_recall)
        
    def test_create_call_request_missing_required_field(self):
        """
        Тестирует сценарий, когда обязательное поле не заполнено.
        Ожидается, что API вернет ошибку 400 с сообщением об ошибке для отсутствующего поля.
        """
        invalid_data = {
        
        }
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phon", response.data)
        
        invalid_data = {
            "phone": "123456789"
        }
        response = self.client.post(self.url, invalid_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)
