from rest_framework import status, generics, parsers
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import ensure_csrf_cookie

from core.permissions import FullDjangoModelPermissions

from .models import AboutCompany
from .serializers import AboutCompanySerializer

# ------------------------------------------------------------------------------ #
#                            Установка CSRF-cookie                             #
# ------------------------------------------------------------------------------ #
@api_view(["GET"])
@ensure_csrf_cookie
def csrf_cookie_view(request):
    """
    GET DOMAIN/api/v1/auth/csrf-cookie/
    
    Устанавливает CSRF-cookie в браузере. Может использоваться для защиты запросов,
    где требуется CSRF-токен.
    """
    return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


class AboutCompanyActualInfoView(generics.RetrieveAPIView):
    """
    Возвращает единственную запись AboutCompany с is_actual=True.
    Если такой нет — выдаёт 404 с вашим сообщением.
    """
    
    authentication_classes = []
    permission_classes = [AllowAny]
    serializer_class = AboutCompanySerializer
    lookup_field = 'dummy'
    
    def get_object(self):
        try:
            return AboutCompany.objects.get(is_actual=True)
        except AboutCompany.DoesNotExist:
            raise NotFound(detail="Нет актуальной информации о компании")


class AboutCompanyUpdateView(generics.UpdateAPIView):
    """
    PATCH /api/v1/about-company/<int:pk>/update/

    Частичное обновление записи AboutCompany.
    Тело: form-data / x-www-form-urlencoded / multipart
      • поля модели AboutCompany

    Примечание: текущий сериализатор исключает is_actual.
    """
    queryset = AboutCompany.objects.all()
    serializer_class = AboutCompanySerializer
    permission_classes = [IsAuthenticated, FullDjangoModelPermissions]
    parser_classes = [parsers.FormParser, parsers.MultiPartParser]
    http_method_names = ["patch"]   
    
    def perform_update(self, serializer):
        req = self.request
        remove_logo = str(req.data.get("remove_logo", "")).lower() in ("1", "true", "yes", "on")

        if remove_logo:
            # Явно просили удалить логотип
            serializer.save(logo=None)
            return

        # Если прислали новый файл — обычное сохранение
        if "logo" in req.FILES:
            serializer.save()
            return

        # Ни удалять, ни менять логотип не просили — не трогаем logo
        serializer.save()