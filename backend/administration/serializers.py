from rest_framework import serializers
import django.db.models as models
from .models import Shop, Size, ColorPalette, Settings
from services.validators import phone_number_ru_validator


class SettingsSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Settings
    """

    class Meta:
        model = Settings
        fields = "__all__"
        read_only_fields = ["id"]


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
            "is_active",
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

    order = serializers.IntegerField(required=False)

    class Meta:
        model = Size
        fields = "__all__"
        read_only_fields = ["id"]

    def validate(self, attrs):
        # При обновлении проверяем наличие order
        if self.instance and "order" not in attrs:
            raise serializers.ValidationError(
                {"order": "При обновлении размера поле order обязательно"}
            )
        elif self.instance and "order" in attrs:
            if attrs["order"] < 0:
                raise serializers.ValidationError(
                    {"order": "Порядок должен быть больше 0"}
                )
            if (
                Size.objects.filter(order=attrs["order"])
                .exclude(pk=self.instance.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"order": "Порядок должен быть уникальным"}
                )
        return attrs

    def create(self, validated_data):
        max_order = Size.objects.aggregate(models.Max("order"))["order__max"]
        validated_data["order"] = (max_order or 0) + 1
        return super().create(validated_data)


class SizeUpdateSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Size с валидацией
    """

    class Meta:
        model = Size
        fields = "__all__"
        read_only_fields = ["id"]


class ColorPaletteSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели ColorPalette без валидаций
    """

    class Meta:
        model = ColorPalette
        fields = "__all__"
        read_only_fields = ["id"]

    def validate(self, data):
        """
        Валидация на уровне объекта (если нужно проверить комбинацию полей)
        """
        # Если это обновление, исключаем текущий объект из проверки уникальности
        if self.instance:
            # Проверяем, что name не конфликтует с другими записями
            if (
                ColorPalette.objects.filter(name=data.get("name", self.instance.name))
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"name": "Цвет с таким названием уже существует"}
                )

            # Проверяем, что hex не конфликтует с другими записями
            if (
                ColorPalette.objects.filter(
                    hex=data.get("hex", self.instance.hex).upper()
                )
                .exclude(id=self.instance.id)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"hex": "Цвет с таким HEX-кодом уже существует"}
                )

        return data
