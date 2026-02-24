from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from core.config.auth_service import SetCookieService

from users.models import User
from users.serializers import LoginSerializer


class EmployeeLoginView(APIView):
    """
    Логин сотрудника
    """

    permission_classes = []
    authentication_classes = []
    
    def _authenticate_client(self, email: str, password: str) -> User | None:
        try:
            user = User.objects.get(
                email=email,
                is_staff=True,
                is_active=True
            )
        except User.DoesNotExist:
            return
        is_correct_pass = user.check_password(password)
        return user if is_correct_pass else None

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = self._authenticate_client(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
        )
        if not user:
            return Response({"detail": "Неверный email или пароль"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)
        resp = Response(
            {"detail": f"Admin successfully authenticated"}, status=status.HTTP_200_OK
        )

        cookie_service = SetCookieService()
        cookie_service.set_response_cookie(resp, refresh)
        return resp
