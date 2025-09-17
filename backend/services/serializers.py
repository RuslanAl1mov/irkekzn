from rest_framework import serializers
from core.mixin.dynamic_fields_mixin import DynamicFieldsModelSerializer
from .models import CallRequest


class CallRequestSerializer(DynamicFieldsModelSerializer):
    """
    Сериализатор для модели CallRequest.
    
    Определяет поля, доступные для создания и отображения данных запроса звонка.
    Все поля модели включены для сериализации, однако поля id, date_created, is_checked
    и date_checked доступны только для чтения.
    """
    class Meta:
        model = CallRequest
        fields = '__all__'
        read_only_fields = ["id", "date_created", "is_checked", "date_checked"]
