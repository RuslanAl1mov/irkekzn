from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Поддерживает ?select=id,name  ИЛИ fields=['id','name'] в kwargs.
    Никаких mixin-ов не нужно: request берётся из self.context.
    """
    query_param_name = "select"

    # ------------------------------------------------------------------ utils
    @staticmethod
    def _parse_select_param(raw: str | None) -> list[str]:
        if not raw:
            return []
        return [f.strip() for f in raw.split(",") if f.strip()]

    # ------------------------------------------------------------------ core
    def __init__(self, *args, **kwargs):
        # 1) fields передали явно?
        requested = kwargs.pop("fields", None)
        nested_serializer_fields = kwargs.pop("nested_serializer_fields", None)

        # 2) если нет, берём ?select=... из self.context["request"]
        if requested is None:
            request = kwargs.get("context", {}).get("request")
            if request is not None:
                requested = self._parse_select_param(
                    request.query_params.get(self.query_param_name)
                )

        super().__init__(*args, **kwargs)

        # 3) отрезаем лишнее + валидация
        if requested:
            requested = set(requested)
            available = set(self.fields)

            unknown = requested - available
            if unknown:
                raise ValidationError(
                    {
                        self.query_param_name: (
                            f"Недопустимые поля: {', '.join(sorted(unknown))}"
                        )
                    }
                )

            for name in available - requested:
                self.fields.pop(name)

            if nested_serializer_fields and isinstance(nested_serializer_fields, dict):
                self._process_nested_fields(nested_serializer_fields)

    def _process_nested_fields(self, nested_serializer_fields: dict):
        """
        Функция обработки вложенных полей сериализатора
        
        :param nested_serializer_fields: Словарь с необходимыми полями 
                                         вложенного сериализатора
        :type nested_serializer_fields: dict
        """
        for field_name, nested_fields in nested_serializer_fields.items():
            serializer_field = self.fields.get(field_name)
            if serializer_field and isinstance(serializer_field, serializers.Serializer):
                serializer_field.fields = self._get_fields_for_nested_serializer(
                    serializer_field, nested_fields)

    def _get_fields_for_nested_serializer(self, serializer: serializers.Serializer, 
                                          nested_fields: str) -> dict:
        """
        Функция получения полей и значений вложенного сериализатора
        
        :param serializer: Класс сериализатора
        :type serializer: serializers.Serializer
        :param nested_fields: Поля сериализатора
        :type nested_fields: str
        :return: Словарь с полями и значениями вложенного сериализатора
        :rtype: dict
        """
        return {field: serializer.fields[field] 
                for field in nested_fields 
                if field in serializer.fields}
