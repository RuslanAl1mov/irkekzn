from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.settings import api_settings as jwt_settings

from services.auth_service import SetCookieService

from .models import User
from .serializers import (
    # ClientRegisterSerializer,
    LoginSerializer,
    CookieTokenRefreshSerializer,
    EmployeeSerializer,
    ClientSerializer,
)


class EmployeeLoginView(APIView):
    """
    Логин сотрудника
    """

    permission_classes = []
    authentication_classes = []

    def _authenticate_client(self, email: str, password: str) -> User | None:
        try:
            user = User.objects.get(email=email, is_staff=True, is_active=True)
        except User.DoesNotExist:
            return
        is_correct_pass = user.check_password(password)
        return user if is_correct_pass else None

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self._authenticate_client(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"detail": "Неверный email или пароль"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        resp = Response(
            {"detail": f"Admin successfully authenticated"}, status=status.HTTP_200_OK
        )

        cookie_service = SetCookieService()
        cookie_service.set_response_cookie(resp, refresh)
        return resp


# class ClientRegisterView(generics.CreateAPIView):
#     """
#     Регистрация клиента
#     """

#     serializer_class = ClientRegisterSerializer
#     permission_classes = [AllowAny]


class ClientLoginView(APIView):
    """
    Логин клиента
    """

    permission_classes = []
    authentication_classes = []

    def _authenticate_client(self, email: str, password: str) -> User | None:
        try:
            user = User.objects.get(email=email, is_staff=False, is_active=True)
        except User.DoesNotExist:
            return
        is_correct_pass = user.check_password(password)
        return user if is_correct_pass else None

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self._authenticate_client(
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )
        if not user:
            return Response(
                {"detail": "Неверный email или пароль"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        resp = Response(
            {"detail": f"Client successfully authenticated"}, status=status.HTTP_200_OK
        )

        cookie_service = SetCookieService()
        cookie_service.set_response_cookie(resp, refresh)
        return resp


class RefreshJWTView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def finalize_response(self, request, response, *args, **kwargs):
        cookie_service = SetCookieService()

        if response.status_code == status.HTTP_200_OK and "access" in response.data:
            cookie_service.set_access_token_to_cookie(response, response.data["access"])
            response.data["access_expiration"] = (
                timezone.now() + jwt_settings.ACCESS_TOKEN_LIFETIME
            )

        if response.status_code == status.HTTP_200_OK and "refresh" in response.data:

            cookie_service.set_refresh_token_to_cookie(
                response, response.data["refresh"]
            )
            if settings.REST_AUTH.get("JWT_AUTH_HTTPONLY"):
                del response.data["refresh"]
            else:
                response.data["refresh_expiration"] = (
                    timezone.now() + jwt_settings.REFRESH_TOKEN_LIFETIME
                )
        return super().finalize_response(request, response, *args, **kwargs)


class LogoutView(APIView):
    """
    POST DOMAIN/api/v1/auth/logout/

    Выход из системы
    """

    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return self.logout(request)

    def logout(self, request):
        response = Response(
            {"detail": "Successfully logged out."},
            status=status.HTTP_200_OK,
        )

        refresh_token_name = settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE")
        access_token_name = settings.REST_AUTH.get("JWT_AUTH_COOKIE")

        response.delete_cookie(
            access_token_name,
            samesite=settings.REST_AUTH.get("JWT_AUTH_SAMESITE"),
        )
        response.delete_cookie(
            refresh_token_name,
            samesite=settings.REST_AUTH.get("JWT_AUTH_SAMESITE"),
        )
        response.delete_cookie(
            "csrftoken",
            samesite=settings.CSRF_COOKIE_SAMESITE,
        )

        return response


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
                employee, context={"request": request}
            ).data
            print(serialized_data)
            serialized_data["permissions"] = request.user.get_all_permissions()
            return Response(serialized_data, status=status.HTTP_200_OK)

        elif request.user.is_staff == False:
            client = get_object_or_404(User, email=request.user.email, is_staff=False)
            serialized_data = ClientSerializer(
                client, context={"request": request}
            ).data
            return Response(serialized_data, status=status.HTTP_200_OK)

        else:
            raise NotFound("Profile not found for your role.")
