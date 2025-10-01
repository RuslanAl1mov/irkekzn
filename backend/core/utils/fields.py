from rest_framework import serializers


class CSVListField(serializers.ListField):
    """
    Принимает:
      • tag_ids=1&tag_ids=2&tag_ids=3  -> ["1", "2", "3"]
      • tag_ids=1,2,3                  -> ["1", "2", "3"]
    """

    def to_internal_value(self, data):
        # 1) Одинарная строка
        if isinstance(data, str):
            data = [s.strip() for s in data.split(",") if s.strip()]

        # 2) Список, но первый (и единственный) элемент — CSV-строка
        elif (
            isinstance(data, list)
            and len(data) == 1
            and isinstance(data[0], str)
            and "," in data[0]
        ):
            data = [s.strip() for s in data[0].split(",") if s.strip()]

        # дальше стандартная обработка ListField
        return super().to_internal_value(data)


class NullableFloatField(serializers.FloatField):
    """
    Специальное поле, которое считает "" и None одним и тем же
    Обрабатывает Float поля
    """

    def to_internal_value(self, data):
        # multipart/form-data всегда передаёт строки,
        # поэтому третим '' как None
        if data == "" or data is None:
            return None
        return super().to_internal_value(data)


class FlexiblePKRelatedField(serializers.PrimaryKeyRelatedField):
    """
    Принимает:
      • число или строку — PK напрямую
      • словарь вида {'id': 5, ...} — берёт .id
    """
    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data.get("id")
        return super().to_internal_value(data)
