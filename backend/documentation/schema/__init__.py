from .base import (
    OPENAPI_VERSION,
    INFO,
    GLOBAL_SECURITY,
    SECURITY_SCHEMES,
    BASE_SCHEMAS,
    BASE_RESPONSES,
)
from .users import USERS_AUTH_SCHEMAS, USERS_AUTH_PATHS, USERS_TAG
from .administration import (
    ADMINISTRATION_SCHEMAS,
    ADMINISTRATION_PATHS,
    ADMINISTRATION_TAGS,
    ADMINISTRATION_X_TAG_GROUPS,
)

SCHEMAS = {
    **BASE_SCHEMAS,
    **USERS_AUTH_SCHEMAS,
    **ADMINISTRATION_SCHEMAS,
}

PATHS = dict(USERS_AUTH_PATHS)
PATHS |= ADMINISTRATION_PATHS

TAGS = [
    {
        "name": USERS_TAG,
        "description": (
            "Аутентификация и профиль: маршруты из `users.views`, префикс `/api/v1/auth/` в `core.urls`."
        ),
    },
    *ADMINISTRATION_TAGS,
]

# ReDoc: визуальные группы тегов. Swagger UI группирует по самим тегам (секции слева).
X_TAG_GROUPS = [
    {"name": "Аккаунт и вход", "tags": [USERS_TAG]},
    *ADMINISTRATION_X_TAG_GROUPS,
]

MANUAL_OPENAPI_SCHEMA = {
    "openapi": OPENAPI_VERSION,
    "info": INFO,
    "paths": PATHS,
    "components": {
        "securitySchemes": SECURITY_SCHEMES,
        "schemas": SCHEMAS,
        "responses": BASE_RESPONSES,
    },
    "security": GLOBAL_SECURITY,
    "tags": TAGS,
    "x-tagGroups": X_TAG_GROUPS,
}

__all__ = ["MANUAL_OPENAPI_SCHEMA", "SCHEMAS", "PATHS", "TAGS"]
