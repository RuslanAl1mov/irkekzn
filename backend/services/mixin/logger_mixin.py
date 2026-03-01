from decimal import Decimal

import logging
from django.db.models import ForeignKey
from django.utils.functional import cached_property
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import FieldDoesNotExist

from users.models import RequestLog

logger = logging.getLogger("project")


class UserLoggingMixin:
    """
    Класс-миксин создания лога пользователя
    """

    METHODS_TO_LOG = ("POST", "PUT", "PATCH", "DELETE")
    SENSITIVE_FIELDS = ("password",)

    @cached_property
    def _initial_object_data(self) -> dict | None:
        """
        Функция получения сериализованных данных объекта до изменения

        :return: Сериализованные данные объекьа
        :rtype: dict | None
        """
        try:
            obj = self.get_object()
        except Exception:
            return None

        serializer = self.get_serializer(obj)
        return serializer.data

    def _get_foreign_key_verbose(self, instance_class, field_name: str) -> str:
        """
        Функция получения verbose name для связанного поля

        :param instance_class: Класс объекта
        :param field_name: Имя поля
        :type field_name: str
        :return: verbose name
        :rtype: str
        """
        for field in instance_class._meta.concrete_fields:
            if isinstance(field, ForeignKey):
                try:
                    return field.related_model._meta.get_field(field_name).verbose_name
                except FieldDoesNotExist:
                    continue
        return ""

    def _log_action(
        self,
        *,
        instance,
        serializer_classname: str,
        new_data: dict,
        old_data: dict | None = None,
    ):
        """
        Функция создания лога

        :param instance: Объект моделаи
        :param serializer_classname: Название класса сериализатора модели
        :type serializer_classname: str
        :param new_data: Новые сериализованные данные объекта
        :type new_data: dict
        :param old_data: Старые сериализованные данные объекта
        :type old_data: dict | None
        """
        request = self.request
        user = request.user if request.user.is_authenticated else None
        instance_class = instance.__class__
        new_values = []
        old_values = []
        if old_data:
            for key, value in new_data.items():
                if key in self.SENSITIVE_FIELDS:
                    continue
                if value != (old_value := old_data.get(key)):
                    try:
                        verbose_name = instance_class._meta.get_field(key).verbose_name
                    except FieldDoesNotExist:
                        verbose_name = self._get_foreign_key_verbose(
                            instance_class, key
                        )

                    if type(value) == Decimal:
                        value = str(value)

                    if type(old_value) == Decimal:
                        old_value = str(old_value)

                    new_values.append(
                        {
                            "field_name": key,
                            "value": value,
                            "verbose_name": verbose_name,
                        }
                    )
                    old_values.append(
                        {
                            "field_name": key,
                            "value": old_value,
                            "verbose_name": verbose_name,
                        }
                    )
            if not new_values:
                return
        content_type = ContentType.objects.get_for_model(instance)

        request_method = getattr(RequestLog.RequestMethod, request.method.upper(), "")
        if not request_method:
            return

        try:
            RequestLog.objects.create(
                user=user,
                method=request_method,
                content_type=content_type,
                object_id=instance.pk,
                model_name=instance._meta.object_name,
                serializer_class=serializer_classname.split("'")[1],
                old_value=old_values,
                new_value=new_values,
            )
        except Exception as e:
            logger.exception("Failed to write RequestLog: %s", e)

    def perform_create(self, serializer):
        """
        Функция, отслеживающая создание объекта

        :param serializer: Объект сериализатора
        """
        instance = serializer.save()
        self._log_action(
            instance=instance,
            serializer_classname=str(serializer.__class__),
            new_data=serializer.data,
            old_data=None,
        )
        return instance

    def perform_update(self, serializer):
        """
        Функция, отслеживающая изменение объекта

        :param serializer: Объект сериализатора
        """
        old_data = self._initial_object_data
        instance = serializer.save()
        self._log_action(
            instance=instance,
            serializer_classname=str(serializer.__class__),
            new_data=serializer.data,
            old_data=old_data,
        )
        return instance
