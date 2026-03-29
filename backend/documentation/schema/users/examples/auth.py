"""Эндпоинты `/api/v1/auth/*` (см. `users.views`, `core.urls`)."""


def _pec(d: dict) -> str:
    return d["PECULIARITIES"]


DESCRIPTIONS_LOGIN_ADMIN = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Аутентификация сотрудника по email и паролю (`EmployeeLoginView`).\n\n"
        "**Условие:**\n"
        "- Пользователь существует, `is_staff=True`, `is_active=True`.\n\n"
        "**Успех:**\n"
        "- JSON с полем `detail`;\n"
        "- пары JWT выставляются в HttpOnly-cookie через `SetCookieService` (`access` / `refresh`, см. `REST_AUTH`).\n\n"
        "**Ошибка 400:**\n"
        "- Неверный email или пароль.\n"
    )
}

EXAMPLE_LOGIN_ADMIN_REQUEST = {
    "email": "admin@example.com",
    "password": "secret",
}

EXAMPLE_LOGIN_ADMIN_ERROR = {"detail": "Неверный email или пароль"}


DESCRIPTIONS_TOKEN_REFRESH = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Выдача нового access (и при ротации — refresh) по refresh-токену (`RefreshJWTView`, `CookieTokenRefreshSerializer`).\n\n"
        "**Тело запроса:**\n"
        "- Опционально `{\"refresh\": \"...\"}`; если нет — токен берётся из cookie `refresh`.\n\n"
        "**Ответ:**\n"
        "- При `JWT_AUTH_HTTPONLY=True` поля `access`/`refresh` могут быть убраны из JSON и остаться только в Set-Cookie;\n"
        "- иначе в теле возможны токены и поля `access_expiration` / `refresh_expiration`.\n"
    )
}


DESCRIPTIONS_LOGOUT = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Сброс cookie `access`, `refresh` и `csrftoken` (`LogoutView`).\n\n"
        "**Аутентификация:**\n"
        "- Не требуется (`AllowAny`).\n"
    )
}


DESCRIPTIONS_ME = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Профиль текущего пользователя (`MeView`, `IsAuthenticated`).\n\n"
        "**Ответ:**\n"
        "- Для сотрудника — данные `EmployeeSerializer` + `permission_codes` (итог `get_all_permissions()`);\n"
        "- для клиента — укороченный `ClientSerializer`.\n"
    )
}
