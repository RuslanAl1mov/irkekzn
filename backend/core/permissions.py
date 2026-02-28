from rest_framework import permissions


class IsEmployee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff and request.user.is_active
    

class CRUDPermissions(permissions.DjangoModelPermissions):
    """
    Класс переопределяющий список прав для метода GET для ПРОСМОТРА модели

    По умолчанию мето GET не проверяется вообще, и любой пользователь
    даже без прав, может получить доступ ко вью.
    Этот класс переопределяет список доступов для метод GET и делает его
    обязательным
    """

    perms_map = {
        **permissions.DjangoModelPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s"],
    }


class GetListPermissions(permissions.DjangoModelPermissions):
    """
    Класс переопределяющий список прав для метода GET ДЛЯ списков данных

    По умолчанию мето GET не проверяется вообще, и любой пользователь
    даже без прав, может получить доступ ко вью.
    Этот класс переопределяет список доступов для метод GET и делает его
    обязательным
    """

    perms_map = {
        **permissions.DjangoModelPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s_list"],
    }
