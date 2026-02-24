from django.conf import settings
from django.utils.translation import gettext_lazy

from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from core.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer

from .models import User


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = serializers.CharField(required=False, 
                                    help_text=gettext_lazy('WIll override cookie.'))

    def extract_refresh_token(self):
        request = self.context['request']
        print(request)
        if 'refresh' in request.data and request.data['refresh'] != '':
            return request.data['refresh']

        cookie_name = settings.REST_AUTH.get('JWT_AUTH_REFRESH_COOKIE')
        if cookie_name and cookie_name in request.COOKIES:
            refresh_token = request.COOKIES.get(cookie_name)

            return refresh_token
        else:
            raise InvalidToken(gettext_lazy('No valid refresh token found'))

    def validate(self, attrs):
        attrs['refresh'] = self.extract_refresh_token()
        return super().validate(attrs)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    

class EmployeeSerializer(DynamicFieldsModelSerializer):
        
    class Meta:
        model = User
        fields = "__all__"
    

class ClientSerializer(DynamicFieldsModelSerializer):
        
    class Meta:
        model = User        
        fields = ["email", "username", "first_name", "last_name", "phone_number", "photo", "language"]



