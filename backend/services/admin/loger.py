import json
from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from django.urls import reverse
from django.utils.html import format_html, mark_safe

from users.models import RequestLog


"""
Страница Логов пользователей для админ-панели admin.py

Испортируем и регистрируем:
admin.site.register(RequestLog, RequestLogAdmin)

RequestLog - Основная модель логов


class RequestLog(models.Model):
    class RequestMethod(models.TextChoices):
        POST = "POST", "POST"
        PUT = "PUT", "PUT"
        PATCH = "PATCH", "PATCH"

    user = models.ForeignKey(
        User, verbose_name="Пользователь", on_delete=models.CASCADE, related_name="logs"
    )
    method = models.CharField(
        max_length=10, verbose_name="Метод запроса", choices=RequestMethod.choices
    )
    old_value = models.JSONField(verbose_name="Старое значение", default=dict)
    new_value = models.JSONField(verbose_name="Новое значение", default=dict)
    serializer_class = models.CharField(
        verbose_name="Название класса сериализатора", max_length=250, null=True
    )
    model_name = models.CharField(
        max_length=250, null=True, verbose_name="Наименование модели"
    )
    date = models.DateTimeField(auto_now_add=True, verbose_name="Дата запроса")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveBigIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    class Meta:
        verbose_name = "Лог"
        verbose_name_plural = "Логи"

"""


class RequestLogAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "get_user_info",
        "method",
        "get_colored_action",
        "get_content_object_link",
        "model_name",
        "get_changes_summary",
        "date",
    )
    list_display_links = ("id", "get_user_info")
    list_filter = ("method", "model_name", "date", "content_type", "user")
    search_fields = ("user__username", "user__email", "model_name", "serializer_class")
    readonly_fields = (
        "user",
        "method",
        "get_colored_action",
        "get_formatted_old_value",  # Теперь метод определен
        "get_formatted_new_value",  # Теперь метод определен
        "get_changes_table",
        "serializer_class",
        "model_name",
        "date",
        "content_type",
        "object_id",
        "get_context_object_display",
    )
    fieldsets = (
        (
            "Основная информация",
            {
                "fields": (
                    "user",
                    "method",
                    "get_colored_action",
                    "model_name",
                    "serializer_class",
                    "date",
                )
            },
        ),
        (
            "Объект",
            {
                "fields": (
                    "get_context_object_display",
                    "content_type",
                    "object_id",
                )
            },
        ),
        (
            "Сравнение изменений",
            {
                "fields": ("get_changes_table",),
                "classes": ("wide",),
                "description": "Таблица изменений полей",
            },
        ),
        (
            "Подробные данные (JSON)",
            {
                "fields": ("get_formatted_old_value", "get_formatted_new_value"),
                "classes": ("collapse",),
            },
        ),
    )

    # Добавляем недостающие методы для форматирования JSON
    def get_formatted_old_value(self, obj):
        """Форматирует старое значение в читаемый JSON"""
        return self._format_json_value(obj.old_value)

    get_formatted_old_value.short_description = "Старое значение (JSON)"

    def get_formatted_new_value(self, obj):
        """Форматирует новое значение в читаемый JSON"""
        return self._format_json_value(obj.new_value)

    get_formatted_new_value.short_description = "Новое значение (JSON)"

    def _format_json_value(self, value):
        """Вспомогательный метод для форматирования JSON"""
        if isinstance(value, str):
            try:
                # Пробуем распарсить строку JSON
                parsed = json.loads(value)
                formatted = json.dumps(parsed, indent=2, ensure_ascii=False)
                return format_html(
                    '<pre style="margin:0; padding:5px; background:#f8f9fa; font-size:12px;">{}</pre>',
                    formatted,
                )
            except:
                return format_html("<pre>{}</pre>", value)
        elif isinstance(value, (dict, list)):
            formatted = json.dumps(value, indent=2, ensure_ascii=False)
            return format_html(
                '<pre style="margin:0; padding:5px; background:#f8f9fa; font-size:12px;">{}</pre>',
                formatted,
            )
        return value

    def get_action_color(self, method):
        """Возвращает цвет и текст для действия"""
        action_map = {
            "POST": ("Создание", "#28a745"),  # Зеленый
            "PUT": ("Изменение", "#fd7e14"),  # Оранжевый
            "PATCH": ("Изменение", "#fd7e14"),  # Оранжевый
            "DELETE": ("Удаление", "#dc3545"),  # Красный
        }
        return action_map.get(method, (method, "#6c757d"))  # Серый для неизвестных

    def get_colored_action(self, obj):
        """Возвращает цветной текст действия"""
        action_text, color = self.get_action_color(obj.method)
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>', color, action_text
        )

    get_colored_action.short_description = "Действие"
    get_colored_action.admin_order_field = "method"

    def get_context_object_display(self, obj):
        """Отображение связанного объекта с контекстной подписью"""
        if not obj.content_object:
            return "Объект не найден"

        # Получаем контекстную подпись в зависимости от метода
        action_text, _ = self.get_action_color(obj.method)

        # Определяем предлог в зависимости от действия
        preposition_map = {
            "Создание": "Созданный объект",
            "Изменение": "Изменяемый объект",
            "Удаление": "Удаленный объект",
        }
        context_title = preposition_map.get(action_text, "Связанный объект")

        # Формируем ссылку на объект
        try:
            url = reverse(
                f"admin:{obj.content_type.app_label}_{obj.content_type.model}_change",
                args=[obj.object_id],
            )
            object_link = format_html(
                '<a href="{}">{}</a>', url, str(obj.content_object)
            )
        except:
            object_link = str(obj.content_object)

        # Добавляем дополнительную информацию для разных действий
        additional_info = ""
        if action_text == "Создание" and obj.new_value:
            additional_info = (
                "<br><small style='color: #28a745;'>✓ Запись о создании</small>"
            )
        elif action_text == "Удаление" and obj.old_value:
            additional_info = (
                "<br><small style='color: #dc3545;'>✗ Запись об удалении</small>"
            )

        return format_html(
            "<div><strong>{}:</strong> {}{}</div>",
            context_title,
            object_link,
            mark_safe(additional_info),
        )

    get_context_object_display.short_description = "Объект операции"

    def get_changes_table(self, obj):
        """Создает красивую таблицу сравнения старого и нового значений"""
        try:
            # Для POST и DELETE показываем специальные таблицы
            if obj.method == "POST":
                return self._get_creation_table(obj)
            elif obj.method == "DELETE":
                return self._get_deletion_table(obj)

            # Для PUT/PATCH показываем таблицу изменений
            old_data = obj.old_value
            new_data = obj.new_value

            if isinstance(old_data, str):
                old_data = json.loads(old_data)
            if isinstance(new_data, str):
                new_data = json.loads(new_data)

            if not isinstance(old_data, list) or not isinstance(new_data, list):
                return mark_safe(
                    "<p>Невозможно отобразить таблицу: данные не в формате списка</p>"
                )

            old_dict = {
                item["field_name"]: item for item in old_data if isinstance(item, dict)
            }

            table_rows = []
            for new_item in new_data:
                if not isinstance(new_item, dict):
                    continue

                field_name = new_item.get("field_name", "")
                verbose_name = new_item.get("verbose_name", field_name)
                new_value = new_item.get("value", "")

                old_item = old_dict.get(field_name, {})
                old_value = old_item.get("value", "")

                changed = old_value != new_value

                old_display = old_value if old_value else "<пусто>"
                new_display = new_value if new_value else "<пусто>"

                row_style = "background-color: #fff3cd;" if changed else ""

                table_rows.append(
                    f"""
                    <tr style="{row_style}">
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>{verbose_name}</strong><br><small style="color: #6c757d;">({field_name})</small></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6; {"background-color: #f8d7da;" if changed else ""}">{old_display}</td>
                        <td style="padding: 8px; border: 1px solid #dee2e6; {"background-color: #d4edda;" if changed else ""}">{new_display}</td>
                    </tr>
                    """
                )

            if not table_rows:
                return mark_safe("<p>Нет данных для отображения</p>")

            table_html = f"""
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                <thead>
                    <tr style="background-color: #e9ecef;">
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Поле</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Старое значение</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Новое значение</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join(table_rows)}
                </tbody>
            </table>
            """

            return mark_safe(table_html)

        except Exception as e:
            return mark_safe(
                f'<p style="color: red;">Ошибка при формировании таблицы: {e}</p>'
            )

    def _get_creation_table(self, obj):
        """Специальная таблица для создания объекта"""
        try:
            new_data = obj.new_value
            if isinstance(new_data, str):
                new_data = json.loads(new_data)

            if not isinstance(new_data, list):
                return mark_safe("<p>Нет данных о созданном объекте</p>")

            table_rows = []
            for item in new_data:
                if not isinstance(item, dict):
                    continue

                field_name = item.get("field_name", "")
                verbose_name = item.get("verbose_name", field_name)
                value = item.get("value", "")

                table_rows.append(
                    f"""
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>{verbose_name}</strong><br><small style="color: #6c757d;">({field_name})</small></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6; background-color: #d4edda;">{value if value else '<пусто>'}</td>
                    </tr>
                    """
                )

            table_html = f"""
            <div style="margin-bottom: 10px; padding: 10px; background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px;">
                <strong style="color: #155724;">✓ Создан новый объект</strong>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #e9ecef;">
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Поле</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Значение</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join(table_rows)}
                </tbody>
            </table>
            """

            return mark_safe(table_html)

        except Exception as e:
            return mark_safe(f'<p style="color: red;">Ошибка: {e}</p>')

    def _get_deletion_table(self, obj):
        """Специальная таблица для удаления объекта"""
        try:
            old_data = obj.old_value
            if isinstance(old_data, str):
                old_data = json.loads(old_data)

            if not isinstance(old_data, list):
                return mark_safe("<p>Нет данных об удаленном объекте</p>")

            table_rows = []
            for item in old_data:
                if not isinstance(item, dict):
                    continue

                field_name = item.get("field_name", "")
                verbose_name = item.get("verbose_name", field_name)
                value = item.get("value", "")

                table_rows.append(
                    f"""
                    <tr>
                        <td style="padding: 8px; border: 1px solid #dee2e6;"><strong>{verbose_name}</strong><br><small style="color: #6c757d;">({field_name})</small></td>
                        <td style="padding: 8px; border: 1px solid #dee2e6; background-color: #f8d7da;">{value if value else '<пусто>'}</td>
                    </tr>
                    """
                )

            table_html = f"""
            <div style="margin-bottom: 10px; padding: 10px; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
                <strong style="color: #721c24;">✗ Объект был удален</strong>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #e9ecef;">
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Поле</th>
                        <th style="padding: 10px; border: 1px solid #dee2e6; text-align: left;">Значение до удаления</th>
                    </tr>
                </thead>
                <tbody>
                    {''.join(table_rows)}
                </tbody>
            </table>
            """

            return mark_safe(table_html)

        except Exception as e:
            return mark_safe(f'<p style="color: red;">Ошибка: {e}</p>')

    def get_changes_summary(self, obj):
        """Краткое резюме изменений для списка"""
        try:
            # Для POST и DELETE показываем специальные иконки
            if obj.method == "POST":
                return format_html('<span style="color: #28a745;">✓ Создание</span>')
            elif obj.method == "DELETE":
                return format_html('<span style="color: #dc3545;">✗ Удаление</span>')

            # Для PUT/PATCH показываем количество изменений
            old_data = obj.old_value
            new_data = obj.new_value

            if isinstance(old_data, str):
                old_data = json.loads(old_data)
            if isinstance(new_data, str):
                new_data = json.loads(new_data)

            if isinstance(old_data, list) and isinstance(new_data, list):
                old_dict = {
                    item.get("field_name"): item.get("value")
                    for item in old_data
                    if isinstance(item, dict)
                }
                changes = 0
                changed_fields = []

                for item in new_data:
                    if isinstance(item, dict):
                        field = item.get("field_name")
                        new_val = item.get("value")
                        old_val = old_dict.get(field)
                        if old_val != new_val:
                            changes += 1
                            changed_fields.append(item.get("verbose_name", field))

                if changes > 0:
                    fields_str = ", ".join(changed_fields[:2])
                    if len(changed_fields) > 2:
                        fields_str += f" и ещё {len(changed_fields) - 2}"
                    return format_html(
                        '<span style="color: #fd7e14;">↻ {} изменений</span><br><small>{}</small>',
                        changes,
                        fields_str,
                    )
                else:
                    return format_html(
                        '<span style="color: #6c757d;">- Нет изменений</span>'
                    )
        except:
            pass
        return "-"

    get_changes_summary.short_description = "Изменения"

    def get_user_info(self, obj):
        """Получить информацию о пользователе"""
        url = reverse("admin:users_user_change", args=[obj.user.id])
        return format_html(
            '<a href="{}">{} ({})</a>',
            url,
            obj.user.get_full_name() or obj.user.username,
            obj.user.email,
        )

    get_user_info.short_description = "Пользователь"
    get_user_info.admin_order_field = "user__username"

    def get_content_object_link(self, obj):
        """Получить ссылку на связанный объект"""
        if obj.content_object:
            try:
                url = reverse(
                    f"admin:{obj.content_type.app_label}_{obj.content_type.model}_change",
                    args=[obj.object_id],
                )
                return format_html('<a href="{}">{}</a>', url, str(obj.content_object))
            except:
                return str(obj.content_object)
        return "-"

    get_content_object_link.short_description = "Объект"

    def get_content_object_display(self, obj):
        """Отображение связанного объекта в детальной форме"""
        if obj.content_object:
            return format_html(
                '{}: <a href="{}">{}</a>',
                obj.content_type.name,
                (
                    reverse(
                        f"admin:{obj.content_type.app_label}_{obj.content_type.model}_change",
                        args=[obj.object_id],
                    )
                    if obj.object_id
                    else "#"
                ),
                str(obj.content_object),
            )
        return "Объект не найден"

    get_content_object_display.short_description = "Связанный объект"

    def has_add_permission(self, request):
        """Запретить добавление логов через админку"""
        return False

    def has_delete_permission(self, request, obj=None):
        """Разрешить удаление логов (опционально)"""
        return True

    def get_queryset(self, request):
        """Оптимизация запросов к БД"""
        return super().get_queryset(request).select_related("user", "content_type")


# Если нужно добавить логи как встроенную таблицу к другим моделям
class RequestLogInline(GenericTabularInline):
    model = RequestLog
    extra = 0
    readonly_fields = (
        "user",
        "method",
        "old_value",
        "new_value",
        "serializer_class",
        "model_name",
        "date",
    )
    can_delete = False

    def has_add_permission(self, request, obj=None):
        return False
