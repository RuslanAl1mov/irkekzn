import re
import phonenumbers

from rest_framework import serializers


def phone_number_ru_validator(value: str) -> str:
    cleaned = re.sub(r"[\s\-\(\)\+]", "", value)

    try:
        # Если номер начинается с 8 и имеет 11 цифр (российский формат)
        if cleaned.startswith('8') or cleaned.startswith('7') and len(re.sub(r"\D", "", cleaned)) == 11:
            # Заменяем 8 на +7 для правильного парсинга
            modified_number = '+7' + cleaned[1:]
            phone_number = phonenumbers.parse(modified_number, None)
        else:
            # Парсим с автоопределением
            phone_number = phonenumbers.parse(cleaned, None)
        
        # Проверяем валидность
        if not phonenumbers.is_valid_number(phone_number):
            raise serializers.ValidationError("Неверный номер телефона")
        
        # Проверяем код страны
        country_code = phone_number.country_code
        allowed_countries = [7]  # Только Россия
        
        if country_code not in allowed_countries:
            raise serializers.ValidationError(
                f"Номера с кодом +{country_code} не поддерживаются"
            )
        
        # Форматируем для хранения 79641234567
        national_number = str(phone_number.national_number)
        formatted = f"7{national_number}"
        
        return formatted
        
    except phonenumbers.NumberParseException:
        raise serializers.ValidationError("Неверный формат номера телефона")