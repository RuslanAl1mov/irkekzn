from decimal import Decimal
import logging
from django.db.models import ForeignKey
from django.utils.functional import cached_property, Promise
from django.utils.encoding import force_str
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import FieldDoesNotExist

from users.models import RequestLog

logger = logging.getLogger("project")


class UserLoggingMixin:
    """
    Класс-миксин создания лога пользователя
    Поддерживает CREATE, UPDATE и DELETE операции
    """

    METHODS_TO_LOG = ("POST", "PUT", "PATCH", "DELETE")
    SENSITIVE_FIELDS = ("password",)

    def _prepare_for_json(self, obj):
        """
        Рекурсивно преобразует все Django lazy objects в строки
        и обрабатывает специальные типы (Decimal и др.)
        """
        if isinstance(obj, Promise):
            return force_str(obj)
        elif isinstance(obj, Decimal):
            return str(obj)
        elif isinstance(obj, dict):
            return {key: self._prepare_for_json(value) for key, value in obj.items()}
        elif isinstance(obj, (list, tuple)):
            return [self._prepare_for_json(item) for item in obj]
        elif isinstance(obj, (str, int, float, bool, type(None))):
            return obj
        else:
            # Для всего остального - пробуем привести к строке
            try:
                return str(obj)
            except:
                return None

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
                    # Принудительно преобразуем verbose_name в строку
                    return str(field.related_model._meta.get_field(field_name).verbose_name)
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

        :param instance: Объект модели
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
        
        # Обработка CREATE (нет old_data)
        if old_data is None:
            # Для CREATE - логируем все новые значения
            for key, value in new_data.items():
                if key in self.SENSITIVE_FIELDS:
                    continue
                
                try:
                    verbose_name = str(instance_class._meta.get_field(key).verbose_name)
                except FieldDoesNotExist:
                    verbose_name = self._get_foreign_key_verbose(instance_class, key)

                new_values.append({
                    "field_name": key,
                    "value": value,
                    "verbose_name": verbose_name,
                })
        
        # Обработка UPDATE (есть и old_data и new_data)
        elif old_data and new_data:
            for key, value in new_data.items():
                if key in self.SENSITIVE_FIELDS:
                    continue
                    
                if value != (old_value := old_data.get(key)):
                    try:
                        verbose_name = str(instance_class._meta.get_field(key).verbose_name)
                    except FieldDoesNotExist:
                        verbose_name = self._get_foreign_key_verbose(instance_class, key)

                    new_values.append({
                        "field_name": key,
                        "value": value,
                        "verbose_name": verbose_name,
                    })
                    
                    old_values.append({
                        "field_name": key,
                        "value": old_value,
                        "verbose_name": verbose_name,
                    })
        
        # Обработка DELETE (есть только old_data, new_data пустой)
        elif old_data and not new_data:
            for key, value in old_data.items():
                if key in self.SENSITIVE_FIELDS:
                    continue
                
                try:
                    verbose_name = str(instance_class._meta.get_field(key).verbose_name)
                except FieldDoesNotExist:
                    verbose_name = self._get_foreign_key_verbose(instance_class, key)

                old_values.append({
                    "field_name": key,
                    "value": value,
                    "verbose_name": verbose_name,
                })

        # Для CREATE и DELETE не проверяем new_values
        # Для UPDATE проверяем, есть ли изменения
        if old_data is not None and new_data and not new_values:
            return

        content_type = ContentType.objects.get_for_model(instance)

        request_method = getattr(RequestLog.RequestMethod, request.method.upper(), "")
        if not request_method:
            return

        try:
            # Очищаем данные перед сохранением
            cleaned_new_values = self._prepare_for_json(new_values)
            cleaned_old_values = self._prepare_for_json(old_values)

            RequestLog.objects.create(
                user=user,
                method=request_method,
                content_type=content_type,
                object_id=instance.pk,
                model_name=instance._meta.object_name,
                serializer_class=serializer_classname.split("'")[1],
                old_value=cleaned_old_values,
                new_value=cleaned_new_values,
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

    def perform_destroy(self, instance):
        """
        Функция, отслеживающая удаление объекта
        ВАЖНО: вызывается ДО фактического удаления, чтобы получить данные объекта

        :param instance: Объект модели для удаления
        """
        # Получаем данные объекта до удаления
        serializer = self.get_serializer(instance)
        old_data = serializer.data
        
        # Логируем удаление
        self._log_action(
            instance=instance,
            serializer_classname=str(serializer.__class__),
            new_data={},  # при удалении новых данных нет
            old_data=old_data,
        )
        
        # Выполняем фактическое удаление
        instance.delete()