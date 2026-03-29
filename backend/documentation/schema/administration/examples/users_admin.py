"""Пользователи в админке: группы, права, логи, список, карточка, CRUD сотрудника."""

DESCRIPTIONS_ADMIN_GROUPS_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список групп Django (`GroupListView`).\n\n"
        "**Права:**\n"
        "- `IsAuthenticated`, `IsEmployee`, `GetListPermissions`\n\n"
        "**Query:**\n"
        "- `search` — по `id`, `name`, `permissions__name`\n"
        "- `ordering` — те же поля; по умолчанию `name`\n"
    )
}

DESCRIPTIONS_ADMIN_PERMISSIONS_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список прав (`PermissionListView`), с `content_type`.\n\n"
        "**Права:**\n"
        "- `IsAuthenticated`, `IsEmployee`, `GetListPermissions`\n\n"
        "**Query:**\n"
        "- `search` / `ordering` по id, name, codename, app_label, model\n"
    )
}

DESCRIPTIONS_ADMIN_USER_LOGS_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Логи запросов (`POST`/`PUT`/`PATCH`/`DELETE`) для пользователя `user_id`.\n\n"
        "**Пагинация:**\n"
        "- `page`, `page_size` (см. `RequestLogsListPagination`)\n"
    )
}

DESCRIPTIONS_ADMIN_USERS_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список всех пользователей с пагинацией и статистикой.\n\n"
        "**Особенности ответа:**\n"
        "- `active` — число активных записей в текущей выборке\n\n"
        "**Фильтры:**\n"
        "- `UsersListFilter` + `search` + `ordering` (см. `UsersListView`)\n"
    )
}

DESCRIPTIONS_ADMIN_USER_DETAIL = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Деталь пользователя: для `is_staff=True` — `EmployeeSerializer`, иначе `UserSerializer`.\n"
    )
}

DESCRIPTIONS_ADMIN_EMPLOYEE_UPDATE_PUT = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Полное обновление сотрудника (`LoggedUpdateAPIView`, `EmployeeSerializer`).\n"
    )
}

DESCRIPTIONS_ADMIN_EMPLOYEE_UPDATE_PATCH = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Частичное обновление сотрудника; те же поля, что и при PUT.\n"
    )
}

DESCRIPTIONS_ADMIN_EMPLOYEE_CREATE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Создание сотрудника (`EmployeeCreateSerializer`).\n"
    )
}
