import bleach

from django.conf import settings
from django.db import IntegrityError, transaction
from django.utils.translation import gettext_lazy
from django.contrib.auth.hashers import make_password


from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from services.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer
from services.validators import phone_number_ru_validator
from .models import User


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(
        required=False, help_text=gettext_lazy("WIll override cookie.")
    )

    def extract_refresh_token(self):
        request = self.context["request"]
        if "refresh" in request.data and request.data["refresh"] != "":
            return request.data["refresh"]

        cookie_name = settings.REST_AUTH.get("JWT_AUTH_REFRESH_COOKIE")
        if cookie_name and cookie_name in request.COOKIES:
            refresh_token = request.COOKIES.get(cookie_name)

            return refresh_token
        else:
            raise InvalidToken(gettext_lazy("No valid refresh token found"))

    def validate(self, attrs):
        attrs["refresh"] = self.extract_refresh_token()
        return super().validate(attrs)


# class ClientRegisterSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     first_name = serializers.CharField(max_length=255)

#     class Meta:
#         model = User
#         fields = ["email", "first_name", "phone_number"]

#     def validate_first_name(self, value):
#         return bleach.clean(value, tags=[], strip=True)

#     def validate_phone_number(self, value):
#         if not re.fullmatch(r"^\+?[0-9()\-\s]+$", value):
#             raise serializers.ValidationError("Номер телефона неверного формата")
#         digits = re.sub(r"\D", "", value)
#         if not 6 <= len(digits) <= 30:
#             raise serializers.ValidationError(
#                 "Номер телефона должен содержать от 6 до 30 цифр"
#             )

#         return value

#     def create(self, validated_data):
#         temp_password = "".join(
#             random.choices(string.ascii_letters + string.digits, k=8)
#         )

#         with transaction.atomic():
#             user_data = validated_data
#             email = validated_data["email"]
#             first_name = validated_data["first_name"]
#             phone_number = user_data.get("phone_number")
#             try:
#                 user = User.objects.create_user(
#                     email=email,
#                     first_name=first_name,
#                     phone_number=phone_number,
#                     username=email.split("@")[0],
#                     is_staff=False,
#                     password=temp_password
#                 )
#             except IntegrityError:
#                 raise ValidationError(
#                     "Учетная запись с такой почтой уже существует")

#             # Отправка письма
#             # send_welcome_email.delay(email, first_name, temp_password)
#             return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(DynamicFieldsModelSerializer):
    email = serializers.EmailField(required=False)
    password = serializers.CharField(required=False)
    phone_number = serializers.CharField(max_length=30, required=False)

    class Meta:
        model = User
        fields = [
            "id",
            "last_login",
            "date_joined",
            "email",
            "password",
            "is_superuser",
            "is_staff",
            "is_active",
            "first_name",
            "last_name",
            "username",
            "phone_number",
            "photo",
            "language",
        ]
        read_only_fields = [
            "is_superuser",
            "is_staff",
            "date_joined",
            "last_login",
            "language",
        ]

    def validate_first_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_last_name(self, value):
        return bleach.clean(value, tags=[], strip=True)

    def validate_phone_number(self, value):
        if not value:
            return value

        # Форматируем под российский стандарт
        phone_number: str = phone_number_ru_validator(value)

        # Проверка на существующий номер телефона у админов и клиентов
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user_exists = (
                User.objects.filter(
                    is_staff=self.instance.is_staff, phone_number=phone_number
                )
                .exclude(pk=self.instance.pk if self.instance else None)
                .exists()
            )

            if user_exists:
                prefix = "Сотрудник" if self.instance.is_staff else "Клиент"
                raise serializers.ValidationError(
                    f"{prefix} с номером телефона +{phone_number} уже существует"
                )

        return phone_number

    def validate_email(self, value):
        if not value:
            return value

        # Проверка на существующий email у админов и клиентов
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            user_exists = (
                User.objects.filter(is_staff=self.instance.is_staff, email=value)
                .exclude(pk=self.instance.pk if self.instance else None)
                .exists()
            )

            if user_exists:
                prefix = "Сотрудник" if self.instance.is_staff else "Клиент"
                raise serializers.ValidationError(
                    f"{prefix} с адресом почты {value} уже существует"
                )

        return value

    def validate_password(self, value):
        return make_password(value)


class EmployeeSerializer(UserSerializer):
    pass


class EmployeeCreateSerializer(EmployeeSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(max_length=128, write_only=True, required=True)
    first_name = serializers.CharField(max_length=255, required=True)
    last_name = serializers.CharField(max_length=255, required=True)
    phone_number = serializers.CharField(max_length=30, required=True)

    def create(self, validated_data):
        with transaction.atomic():
            email = validated_data["email"]
            password = validated_data["password"]
            first_name = validated_data["first_name"]
            last_name = validated_data["last_name"]
            phone_number = validated_data["phone_number"]
            try:
                user = User.objects.create_user(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    phone_number=phone_number,
                    username=email.split("@")[0],
                    is_staff=True,
                    password=password,
                )
            except IntegrityError as e:
                print(repr(e))
                raise ValidationError(f"Ошибка создания Сотрудника: {repr(e)}")

            return user


class ClientSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "phone_number",
            "photo",
            "language",
        ]
