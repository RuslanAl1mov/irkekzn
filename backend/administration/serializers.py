from rest_framework import serializers
from .models import Shop, Size
from services.validators import phone_number_ru_validator


class ShopSerializer(serializers.ModelSerializer):
    """
    Сериализатор для магазина
    """

    class Meta:
        model = Shop
        fields = [
            "id",
            "name",
            "email",
            "phone_first",
            "phone_second",
            "phone_third",
            "telegram_link",
            "telegram_name",
            "vk_link",
            "vk_name",
            "instagram_link",
            "instagram_name",
            "is_main_office",
            "city",
            "address",
            "map_location",
        ]
        read_only_fields = ["id"]

    def validate_is_main_office(self, value):
        """
        Валидация поля is_main_office
        - При создании: всегда разрешаем (логика в save)
        - При обновлении: запрещаем снимать статус, если нет другого главного
        """
        # Случай 1: СОЗДАНИЕ нового объекта
        if not self.instance:
            return value

        # Случай 2: ОБНОВЛЕНИЕ существующего объекта
        current_is_main = self.instance.is_main_office

        # Если значение не меняется - ок
        if current_is_main == value:
            return value

        # Если пытаемся снять статус главного (был True, стал False)
        if current_is_main and not value:
            other_main_exists = (
                Shop.objects.filter(is_main_office=True)
                .exclude(pk=self.instance.pk)
                .exists()
            )

            if not other_main_exists:
                raise serializers.ValidationError(
                    "Нельзя снять статус главного офиса. "
                    "Сначала назначьте другой магазин главным."
                )

        # Если пытаемся сделать этот магазин главным (был False, стал True)
        # Всегда разрешаем, сброс других произойдет в save()
        return value

    def validate(self, data):
        # Собираем все номера
        phone_fields = ["phone_first", "phone_second", "phone_third"]

        for field in phone_fields:
            if field in data and data[field]:
                # Валидируем и обновляем отформатированный номер (79641234567)
                formatted_phone = phone_number_ru_validator(data[field])
                data[field] = formatted_phone

        # Проверяем, что номера не дублируются
        phones = [data[f] for f in phone_fields if f in data and data[f]]
        if len(phones) != len(set(phones)):
            raise serializers.ValidationError("Телефонные номера не должны повторяться")

        return data


class SizeSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Size без валидаций
    """

    order = serializers.IntegerField(required=True)

    class Meta:
        model = Size
        fields = [
            "id",
            "russian",
            "international",
            "european",
            "chest_circumference",
            "waist_circumference",
            "hip_circumference",
            "order",
        ]

        read_only_fields = ["id"]

    def validate_order(self, value):
        if value < 0:
            raise serializers.ValidationError("Порядок должен быть больше 0")
        if (
            Size.objects.filter(order=value)
            .exclude(pk=self.instance.pk if self.instance else None)
            .exists()
        ):
            raise serializers.ValidationError("Порядок должен быть уникальным")
        return value
