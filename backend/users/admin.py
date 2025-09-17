from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.admin import GroupAdmin as BaseGroupAdmin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import Group
from django.utils.html import format_html_join, mark_safe

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    model = User
    
    # Поля, отображаемые в списке
    list_display = (
        'id', 'email', 'first_name', 'last_name', 'phone', 'role', 'is_active', 'is_staff'
    )
    list_display_links = ('id', 'email')
    list_filter = ('role', 'is_active', 'is_staff', 'is_superuser', 'groups')
    search_fields = ('email', 'first_name', 'last_name', 'phone')
    ordering = ('email',)

    # Поля в деталях пользователя
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone', 'photo')}),
        (_('Permissions'), {
            'fields': (
                'role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
            ),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )

    # Поля при создании нового пользователя через админку
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('first_name', 'last_name', 'email', 'phone', 'role', 'password1', 'password2'),
        }),
    )

    filter_horizontal = ('groups', 'user_permissions',)



# ---------------- Employee & Client admin ----------------
from .models import Employee, Client

@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_email', 'user_first_name', 'user_last_name', 'user_phone'
    )
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'user__phone')
    list_filter = ('user__is_active',)

    @staticmethod
    def user_email(obj):
        return obj.user.email
    user_email.short_description = 'Email'

    @staticmethod
    def user_first_name(obj):
        return obj.user.first_name
    user_first_name.short_description = 'Имя'

    @staticmethod
    def user_last_name(obj):
        return obj.user.last_name
    user_last_name.short_description = 'Фамилия'

    @staticmethod
    def user_phone(obj):
        return obj.user.phone
    user_phone.short_description = 'Телефон'


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'user_email', 'user_first_name', 'user_last_name', 'user_phone'
    )
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'user__phone')
    list_filter = ('user__is_active',)

    @staticmethod
    def user_email(obj):
        return obj.user.email
    user_email.short_description = 'Email'

    @staticmethod
    def user_first_name(obj):
        return obj.user.first_name
    user_first_name.short_description = 'Имя'

    @staticmethod
    def user_last_name(obj):
        return obj.user.last_name
    user_last_name.short_description = 'Фамилия'

    @staticmethod
    def user_phone(obj):
        return obj.user.phone
    user_phone.short_description = 'Телефон'


admin.site.unregister(Group)

@admin.register(Group)
class CustomGroupAdmin(BaseGroupAdmin):
    list_display = ('name', 'get_permissions_display')
    filter_horizontal = ('permissions',)

    def get_permissions_display(self, obj):
        """
        Возвращает список verbose_name всех прав, привязанных к группе.
        """
        perms = obj.permissions.all().order_by(
            'content_type__app_label', 'codename'
        )
        # выводим «человеческое» имя права
        return format_html_join(
            mark_safe('<br/>'),
            '{}',
            ((p.name,) for p in perms),
        )

    get_permissions_display.short_description = 'Права у группы'
    get_permissions_display.admin_order_field = 'permissions__name'