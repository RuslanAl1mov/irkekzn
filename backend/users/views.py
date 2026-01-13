from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Employee, Client

from .serializers import (
    EmployeeTokenObtainPairSerializer,
    ClientTokenObtainPairSerializer,
    EmployeeSerializer,
    ClientSerializer,
)

User = get_user_model()


class AuthFinalizeResponse:
    def finalize_response(self, request, response, *args, **kwargs):
        """
        После того как DRF сформировал стандартный ответ с {"access", "refresh"},
        мы читаем эти токены и добавляем их как HttpOnly-куки.
        """
        response = super().finalize_response(request, response, *args, **kwargs)

        # не устанавливаем куки, если аутентификация не прошла
        if response.status_code != 200 or not isinstance(response.data, dict):
            return response

        access = response.data.get(settings.REST_AUTH["JWT_AUTH_COOKIE"])
        refresh = response.data.get(settings.REST_AUTH["JWT_AUTH_REFRESH_COOKIE"])
        response.set_cookie(
            key=settings.REST_AUTH["JWT_AUTH_COOKIE"],
            value=str(access),
            httponly=settings.REST_AUTH["JWT_AUTH_HTTPONLY"],
            secure=settings.REST_AUTH["JWT_AUTH_SECURE"],
            samesite=settings.REST_AUTH["JWT_AUTH_SAMESITE"],
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],

        )
        response.set_cookie(
            key=settings.REST_AUTH["JWT_AUTH_REFRESH_COOKIE"],
            value=str(refresh),
            httponly=settings.REST_AUTH["JWT_AUTH_HTTPONLY"],
            secure=settings.REST_AUTH["JWT_AUTH_SECURE"],
            samesite=settings.REST_AUTH["JWT_AUTH_SAMESITE"],
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        )

        # удаляем поля из JSON, они уже в куках
        response.data.pop(settings.REST_AUTH["JWT_AUTH_COOKIE"], None)
        response.data.pop(settings.REST_AUTH["JWT_AUTH_REFRESH_COOKIE"], None)
        response.data["message"] = "Successfully authorized!"

        return response


class EmployeeLoginView(AuthFinalizeResponse, TokenObtainPairView):
    serializer_class = EmployeeTokenObtainPairSerializer


class ClientLoginView(AuthFinalizeResponse, TokenObtainPairView):
    serializer_class = ClientTokenObtainPairSerializer


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        GET DOMAIN/api/v1/auth/me/

        Возвращает информацию о текущем авторизованом пользователе.
        """

        if request.user.role == User.UserType.EMPLOYEE:
            employee = get_object_or_404(Employee, user=request.user)
            serialized_data = EmployeeSerializer(
                employee, context={"request": request}
            ).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        elif request.user.role == User.UserType.CLIENT:
            client = get_object_or_404(Client, user=request.user)
            serialized_data = ClientSerializer(
                client, context={"request": request}
            ).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        else:
            raise NotFound("Profile not found for your role.")
