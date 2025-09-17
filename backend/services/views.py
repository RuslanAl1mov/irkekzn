from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.authentication import ForceCsrfAuthentication

from .models import CallRequest
from .serializers import CallRequestSerializer
    
    
class ClientCallRequestCreateView(generics.CreateAPIView):
    """
    Эндпоинт для создания запроса на звонок клиента.
    
    URL: DOMAIN/api/v1/services/client-call-requests/create/
    
    Данный вью позволяет любому пользователю (без аутентификации) создать запрос
    на обратный звонок, используя модель CallRequest.
    
    Для выполнения POST-запроса требуется наличие валидного CSRF-токена, так как
    используется SessionAuthentication.
    
    Поля, необходимые для создания запроса, определены в CallRequestSerializer.
    """
    queryset = CallRequest.objects.all()
    serializer_class = CallRequestSerializer
    permission_classes = [AllowAny]  
    authentication_classes = [ForceCsrfAuthentication]
    
    
class ClientCallRequestListView(generics.ListAPIView):
    """    
    URL: DOMAIN/api/v1/services/client-call-requests/
    
    Данный вью позволяет любому пользователю (без аутентификации) создать запрос
    на обратный звонок, используя модель CallRequest.
    
    Для выполнения POST-запроса требуется наличие валидного CSRF-токена, так как
    используется SessionAuthentication.
    
    Поля, необходимые для создания запроса, определены в CallRequestSerializer.
    """
    queryset = CallRequest.objects.all()
    serializer_class = CallRequestSerializer
    permission_classes = [IsAuthenticated]
