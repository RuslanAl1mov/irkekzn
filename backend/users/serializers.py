from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer

from .models import Employee, Client


User = get_user_model()

class EmployeeTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role != User.UserType.EMPLOYEE:
            raise serializers.ValidationError("Только сотрудники могут логиниться здесь.")
        return data


class ClientTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "phone"
    def validate(self, attrs):
        data = super().validate(attrs)
        if self.user.role != User.UserType.CLIENT:
            raise serializers.ValidationError("Только клиенты могут логиниться по телефону.")
        return data


class EmployeeSerializer(DynamicFieldsModelSerializer):
    
    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    phone = serializers.EmailField(source="user.phone", read_only=True)
    photo = serializers.ImageField(source="user.photo", allow_null=True, read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)
    
    permissions = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Employee
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "photo",
            "role",
            "is_active",
            "date_joined",
            "permissions",
        ]
        
    def get_permissions(self, obj):
        """
        Возвращает отсортированный список всех permissions,
        доступных этому пользователю (с учётом групп и индивидуальных прав).
        """
        user = obj.user
        return sorted(user.get_all_permissions())
        

class ClientSerializer(DynamicFieldsModelSerializer):

    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    phone = serializers.EmailField(source="user.phone", read_only=True)
    photo = serializers.ImageField(source="user.photo", allow_null=True, read_only=True)
    role = serializers.CharField(source="user.role", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    date_joined = serializers.DateTimeField(source="user.date_joined", read_only=True)

    class Meta:
        model = Client
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "photo",
            "role",
            "is_active",
            "date_joined"
        ]