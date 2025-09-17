from rest_framework import serializers
from .models import AboutCompany


class AboutCompanySerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели AboutCompany.
    
    Сериализует все поля модели, за исключением поля is_actual, для отображения информации о компании.
    """
    class Meta:
        model = AboutCompany
        exclude = ['is_actual']
        