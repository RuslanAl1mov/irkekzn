OPENAPI_VERSION = "3.0.3"

INFO = {
    "title": "IRKE API",
    "version": "1.0.0",
    "description": (
        "Ручная OpenAPI-схема: `users` (`/api/v1/auth/`) и `administration` "
        "(`/api/v1/administration/`). JWT в cookie — см. `REST_AUTH`."
    ),
}

GLOBAL_SECURITY: list = []

SECURITY_SCHEMES = {
    "CookieAuth": {
        "type": "apiKey",
        "in": "cookie",
        "name": "access",
        "description": (
            "JWT access в cookie `access`. Refresh — cookie `refresh` "
            "(имена из `REST_AUTH.JWT_AUTH_COOKIE` / `JWT_AUTH_REFRESH_COOKIE`)."
        ),
    },
}

BASE_SCHEMAS = {
    "ErrorResponse": {
        "type": "object",
        "description": "Сообщение об ошибке (DRF / simplejwt).",
        "properties": {
            "detail": {
                "oneOf": [
                    {"type": "string"},
                    {"type": "array", "items": {"type": "string"}},
                ],
                "description": "Текст или список сообщений.",
            },
            "code": {"type": "string"},
            "errors": {"type": "object"},
        },
    },
}

BASE_RESPONSES = {
    "ValidationError": {
        "description": "Ошибка валидации тела запроса.",
        "content": {
            "application/json": {
                "schema": {"$ref": "#/components/schemas/ErrorResponse"}
            }
        },
    },
    "UnauthorizedError": {
        "description": "Не авторизован или невалидный/просроченный токен.",
        "content": {
            "application/json": {
                "schema": {"$ref": "#/components/schemas/ErrorResponse"}
            }
        },
    },
    "ForbiddenError": {
        "description": "Недостаточно прав.",
        "content": {
            "application/json": {
                "schema": {"$ref": "#/components/schemas/ErrorResponse"}
            }
        },
    },
}
