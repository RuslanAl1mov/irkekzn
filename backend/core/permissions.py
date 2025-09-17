from rest_framework.permissions import DjangoModelPermissions


class FullDjangoModelPermissions(DjangoModelPermissions):
    """
    Класс переопределяющий список прав для метода GET для ПРОСМОТРА модели

    По умолчанию мето GET не проверяется вообще, и любой пользователь
    даже без прав, может получить доступ ко вью.
    Этот класс переопределяет список доступов для метод GET и делает его
    обязательным
    """

    perms_map = {
        **DjangoModelPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s"],
    }


class DjangoListModelPermissions(DjangoModelPermissions):
    """
    Класс переопределяющий список прав для метода GET ДЛЯ списков данных

    По умолчанию мето GET не проверяется вообще, и любой пользователь
    даже без прав, может получить доступ ко вью.
    Этот класс переопределяет список доступов для метод GET и делает его
    обязательным
    """

    perms_map = {
        **DjangoModelPermissions.perms_map,
        "GET": ["%(app_label)s.view_%(model_name)s_list"],
    }
