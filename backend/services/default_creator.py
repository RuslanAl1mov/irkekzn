from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class CurrentUserDefault:
    """
    Класс получения в сериализаторе пользователя отправившего запрос
    """

    def __init__(self, fallback_user_id=None):
        self.fallback_user_id = fallback_user_id

    requires_context = True

    def __call__(self, serializer_field):
        request = (
            serializer_field.context.get("request")
            if serializer_field.context
            else None
        )
        user = getattr(request, "user", None)

        if user and getattr(user, "is_authenticated", False):
            return user

        if self.fallback_user_id:
            try:
                return User.objects.get(id=self.fallback_user_id)
            except User.DoesNotExist:
                raise serializers.ValidationError(
                    f"Пользователь {self.fallback_user_id} не найден."
                )

        raise serializers.ValidationError(
            "User не найден. Авторизуйтесь или задайте пользователя по умолчанию."
        )

    def __repr__(self):
        return f"{self.__class__.__name__}(fallback_user_id={self.fallback_user_id})"
