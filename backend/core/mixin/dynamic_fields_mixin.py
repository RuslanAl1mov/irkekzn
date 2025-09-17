from rest_framework import serializers
from rest_framework.exceptions import ValidationError


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    Поддерживает ?select=id, name ИЛИ fields=['id','name'] в kwargs.
    """
    query_param_name = "select"

    @staticmethod
    def _parse_select_param(raw: str | None) -> list[str]:
        if not raw:
            return []
        return [f.strip() for f in raw.split(",") if f.strip()]

    def __init__(self, *args, **kwargs):
        requested = kwargs.pop("fields", None)

        if requested is None:
            request = kwargs.get("context", {}).get("request")
            if request is not None:
                requested = self._parse_select_param(
                    request.query_params.get(self.query_param_name)
                )

        super().__init__(*args, **kwargs)

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
