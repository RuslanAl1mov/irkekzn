"""
OpenAPI: приложение `users` — маршруты под `/api/v1/auth/` в `core.urls`.
Описания и примеры — в `examples/auth.py`.
"""

from documentation.schema.users.examples import auth as exc_auth

USERS_TAG = "Users"

BASE_AUTH_PATH = "/api/v1/auth"

COMMON_AUTH_ERRORS = {
    "401": {"$ref": "#/components/responses/UnauthorizedError"},
    "403": {"$ref": "#/components/responses/ForbiddenError"},
}

USERS_AUTH_SCHEMAS = {
    "LoginRequest": {
        "type": "object",
        "required": ["email", "password"],
        "properties": {
            "email": {"type": "string", "format": "email"},
            "password": {"type": "string", "format": "password", "writeOnly": True},
        },
    },
    "LoginAdminSuccess": {
        "type": "object",
        "required": ["detail"],
        "properties": {
            "detail": {
                "type": "string",
                "example": "Admin successfully authenticated",
                "description": "Текст успеха; пары JWT выставляются в Set-Cookie.",
            },
        },
        "description": "Токены `access` и `refresh` приходят в HttpOnly-cookie (см. `SetCookieService`).",
    },
    "LogoutSuccess": {
        "type": "object",
        "properties": {
            "detail": {
                "type": "string",
                "example": "Successfully logged out.",
            },
        },
    },
    "TokenRefreshRequest": {
        "type": "object",
        "properties": {
            "refresh": {
                "type": "string",
                "description": "Опционально: если не передан, берётся из cookie `refresh`.",
            },
        },
    },
    "TokenRefreshSuccess": {
        "type": "object",
        "description": (
            "При `JWT_AUTH_HTTPONLY=True` поля `access` и `refresh` удаляются из JSON и остаются "
            "только в cookie; иначе в теле могут быть токены и поля `*_expiration` (ISO-8601)."
        ),
        "properties": {
            "access": {"type": "string"},
            "refresh": {"type": "string"},
            "access_expiration": {"type": "string", "format": "date-time"},
            "refresh_expiration": {"type": "string", "format": "date-time"},
        },
    },
    "GroupNested": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "permissions": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Имена разрешений (slug_field=name).",
            },
        },
    },
    "PermissionNested": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "codename": {"type": "string"},
            "app_label": {"type": "string"},
            "model": {"type": "string"},
        },
    },
    "MeEmployeeResponse": {
        "type": "object",
        "description": "Профиль сотрудника (`EmployeeSerializer` + `permission_codes`).",
        "properties": {
            "id": {"type": "integer"},
            "last_login": {"type": "string", "format": "date-time", "nullable": True},
            "date_joined": {"type": "string", "format": "date-time"},
            "email": {"type": "string", "format": "email"},
            "is_superuser": {"type": "boolean"},
            "is_staff": {"type": "boolean"},
            "is_active": {"type": "boolean"},
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "username": {"type": "string"},
            "phone_number": {"type": "string", "nullable": True},
            "photo": {
                "type": "string",
                "nullable": True,
                "description": "URL файла (часто относительный).",
            },
            "language": {"type": "string"},
            "groups": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/GroupNested"},
            },
            "user_permissions": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/PermissionNested"},
            },
            "permission_codes": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Итоговый набор прав (`get_all_permissions()`).",
            },
        },
    },
    "MeClientResponse": {
        "type": "object",
        "description": "Профиль клиента (`ClientSerializer`).",
        "properties": {
            "email": {"type": "string", "format": "email"},
            "username": {"type": "string"},
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "phone_number": {"type": "string", "nullable": True},
            "photo": {"type": "string", "nullable": True},
            "language": {"type": "string"},
        },
    },
}

_pec = exc_auth._pec

USERS_AUTH_PATHS = {
    f"{BASE_AUTH_PATH}/login/admin/": {
        "post": {
            "tags": [USERS_TAG],
            "summary": "Вход сотрудника",
            "description": _pec(exc_auth.DESCRIPTIONS_LOGIN_ADMIN),
            "security": [],
            "requestBody": {
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/LoginRequest"},
                        "example": exc_auth.EXAMPLE_LOGIN_ADMIN_REQUEST,
                    }
                },
            },
            "responses": {
                "200": {
                    "description": "Успешная аутентификация.",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/LoginAdminSuccess"}
                        }
                    },
                    "headers": {
                        "Set-Cookie": {
                            "description": "access, refresh (параметры из `REST_AUTH`).",
                            "schema": {"type": "string"},
                        }
                    },
                },
                "400": {
                    "description": "Неверный email или пароль.",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ErrorResponse"},
                            "example": exc_auth.EXAMPLE_LOGIN_ADMIN_ERROR,
                        }
                    },
                },
            },
        }
    },
    f"{BASE_AUTH_PATH}/token/refresh/": {
        "post": {
            "tags": [USERS_TAG],
            "summary": "Обновление токенов",
            "description": _pec(exc_auth.DESCRIPTIONS_TOKEN_REFRESH),
            "security": [],
            "requestBody": {
                "required": False,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/TokenRefreshRequest"}
                    }
                },
            },
            "responses": {
                "200": {
                    "description": "Новые токены (в теле и/или cookie).",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/TokenRefreshSuccess"}
                        }
                    },
                },
                "401": {
                    "description": "Невалидный refresh.",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                        }
                    },
                },
            },
        }
    },
    f"{BASE_AUTH_PATH}/logout/": {
        "post": {
            "tags": [USERS_TAG],
            "summary": "Выход из системы",
            "description": _pec(exc_auth.DESCRIPTIONS_LOGOUT),
            "security": [],
            "responses": {
                "200": {
                    "description": "Успешный выход.",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/LogoutSuccess"}
                        }
                    },
                },
            },
        }
    },
    f"{BASE_AUTH_PATH}/me/": {
        "get": {
            "tags": [USERS_TAG],
            "summary": "Профиль текущего пользователя",
            "description": _pec(exc_auth.DESCRIPTIONS_ME),
            "security": [{"CookieAuth": []}],
            "responses": {
                "200": {
                    "description": "Данные пользователя.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "oneOf": [
                                    {"$ref": "#/components/schemas/MeEmployeeResponse"},
                                    {"$ref": "#/components/schemas/MeClientResponse"},
                                ]
                            }
                        }
                    },
                },
                **COMMON_AUTH_ERRORS,
            },
        }
    },
}
