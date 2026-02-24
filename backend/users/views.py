from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.settings import api_settings as jwt_settings

from core.config.auth_service import SetCookieService

from users.models import User
from users.serializers import CookieTokenRefreshSerializer, EmployeeSerializer, ClientSerializer


class RefreshJWTView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        cookie_service = SetCookieService()

        if response.status_code == status.HTTP_200_OK and "access" in response.data:
            cookie_service.set_access_token_to_cookie(
                response, response.data["access"])
            response.data['access_expiration'] = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME)

        if response.status_code == status.HTTP_200_OK and "refresh" in response.data:

            cookie_service.set_refresh_token_to_cookie(
                response, response.data["refresh"])
            if settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"):
                del response.data["refresh"]
            else:
                response.data['refresh_expiration'] = (
                    timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME)
        return super().finalize_response(request, response, *args, **kwargs)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        GET DOMAIN/api/v1/users/me/

        Возвращает информацию о текущем аутентифицированном пользователе.
        """
        
        if request.user.is_staff == True:
            employee = get_object_or_404(User, email=request.user.email, is_staff=True)
            serialized_data = EmployeeSerializer(
                employee, context={"request": request}).data
            serialized_data["permissions"] = request.user.get_all_permissions()
            return Response(serialized_data, status=status.HTTP_200_OK)

        elif request.user.is_staff == False:
            client = get_object_or_404(User, email=request.user.email, is_staff=False)
            serialized_data = ClientSerializer(
                client, context={"request": request}).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        else:
            raise NotFound("Profile not found for your role.")