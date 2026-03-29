"""
OpenAPI paths/schemas для administration.* — префикс /api/v1/administration/ (см. core.urls).

Тексты операций и примеры — в пакете `examples/` (по областям: users_admin, shops, …).
"""

from documentation.schema.administration.examples import (
    color_palettes as exc_color_palettes,
    product_cards as exc_product_cards,
    product_categories as exc_product_categories,
    settings as exc_settings,
    shops as exc_shops,
    sizes as exc_sizes,
    users_admin as exc_users_admin,
)


def _pec(d: dict) -> str:
    return d["PECULIARITIES"]


# Теги для группировки в Swagger / ReDoc (см. ADMINISTRATION_X_TAG_GROUPS).
TAG_ADMIN_USERS = "Пользователи и доступ"
TAG_ADMIN_SETTINGS = "Настройки"
TAG_ADMIN_SHOPS = "Магазины"
TAG_ADMIN_SIZES = "Размеры"
TAG_ADMIN_PALETTE = "Палитра цветов"
TAG_ADMIN_CATEGORIES = "Категории товаров"
TAG_ADMIN_PRODUCT_CARDS = "Карточки товаров"

ADMINISTRATION_TAGS = [
    {
        "name": TAG_ADMIN_USERS,
        "description": (
            "Группы Django, права, логи запросов, список пользователей, карточка, создание и изменение сотрудника."
        ),
    },
    {
        "name": TAG_ADMIN_SETTINGS,
        "description": "Глобальные настройки приложения (синглтон).",
    },
    {"name": TAG_ADMIN_SHOPS, "description": "Магазины и контакты."},
    {"name": TAG_ADMIN_SIZES, "description": "Размерная сетка одежды."},
    {"name": TAG_ADMIN_PALETTE, "description": "Цвета палитры для каталога."},
    {
        "name": TAG_ADMIN_CATEGORIES,
        "description": "Категории товаров и обложки.",
    },
    {
        "name": TAG_ADMIN_PRODUCT_CARDS,
        "description": "Карточки товаров (связь категорий с товарами).",
    },
]

ADMINISTRATION_X_TAG_GROUPS = [
    {
        "name": "Администрирование",
        "tags": [
            TAG_ADMIN_USERS,
            TAG_ADMIN_SETTINGS,
            TAG_ADMIN_SHOPS,
            TAG_ADMIN_SIZES,
            TAG_ADMIN_PALETTE,
            TAG_ADMIN_CATEGORIES,
            TAG_ADMIN_PRODUCT_CARDS,
        ],
    },
]

# Обратная совместимость импортов (первый тег админки).
ADMINISTRATION_TAG = TAG_ADMIN_USERS

BASE = "/api/v1/administration"

SEC = [{"CookieAuth": []}]

R401_403 = {
    "401": {"$ref": "#/components/responses/UnauthorizedError"},
    "403": {"$ref": "#/components/responses/ForbiddenError"},
}

R400 = {"400": {"$ref": "#/components/responses/ValidationError"}}

PATH_PK = [
    {"name": "pk", "in": "path", "required": True, "schema": {"type": "integer"}}
]
PATH_USER_ID = [
    {"name": "user_id", "in": "path", "required": True, "schema": {"type": "integer"}}
]


def _op(
    method: str,
    summary: str,
    description: str,
    responses: dict,
    *,
    tag: str,
    security=None,
    request_body=None,
):
    op = {
        "tags": [tag],
        "summary": summary,
        "description": description,
        "responses": responses,
    }
    if security is not None:
        op["security"] = security
    if request_body is not None:
        op["requestBody"] = request_body
    return {method: op}


ADMINISTRATION_SCHEMAS = {
    "AdminPaginationBase": {
        "type": "object",
        "properties": {
            "pages": {"type": "integer"},
            "count": {"type": "integer"},
            "next": {"type": "string", "nullable": True},
            "previous": {"type": "string", "nullable": True},
        },
    },
    "PaginatedShops": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "active": {"type": "integer"},
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/Shop"},
                    },
                },
            },
        ],
    },
    "PaginatedUsers": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "active": {"type": "integer"},
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/AdminUserListItem"},
                    },
                },
            },
        ],
    },
    "PaginatedRequestLogs": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/RequestLog"},
                    },
                },
            },
        ],
    },
    "PaginatedSizes": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/Size"},
                    },
                },
            },
        ],
    },
    "PaginatedColorPalettes": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "active": {"type": "integer"},
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ColorPalette"},
                    },
                },
            },
        ],
    },
    "PaginatedProductCategories": {
        "allOf": [
            {"$ref": "#/components/schemas/AdminPaginationBase"},
            {
                "type": "object",
                "properties": {
                    "active": {"type": "integer"},
                    "result": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ProductCategory"},
                    },
                },
            },
        ],
    },
    "Shop": {
        "type": "object",
        "properties": {
            "id": {"type": "integer", "readOnly": True},
            "name": {"type": "string"},
            "email": {"type": "string", "format": "email", "nullable": True},
            "phone_first": {"type": "string"},
            "phone_second": {"type": "string", "nullable": True},
            "phone_third": {"type": "string", "nullable": True},
            "telegram_link": {"type": "string", "nullable": True},
            "telegram_name": {"type": "string", "nullable": True},
            "vk_link": {"type": "string", "nullable": True},
            "vk_name": {"type": "string", "nullable": True},
            "instagram_link": {"type": "string", "nullable": True},
            "instagram_name": {"type": "string", "nullable": True},
            "is_main_office": {"type": "boolean"},
            "is_active": {"type": "boolean"},
            "city": {"type": "string"},
            "address": {"type": "string"},
            "map_location": {"type": "string", "nullable": True},
        },
    },
    "Size": {
        "type": "object",
        "properties": {
            "id": {"type": "integer", "readOnly": True},
            "russian": {"type": "string"},
            "international": {"type": "string"},
            "european": {"type": "string"},
            "chest_circumference": {"type": "string"},
            "waist_circumference": {"type": "string"},
            "hip_circumference": {"type": "string"},
            "order": {"type": "integer"},
        },
    },
    "ColorPalette": {
        "type": "object",
        "properties": {
            "id": {"type": "integer", "readOnly": True},
            "name": {"type": "string"},
            "hex": {"type": "string"},
            "is_active": {"type": "boolean"},
        },
    },
    "Settings": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "set_global_product_card_settings": {"type": "boolean"},
            "is_all_products_same_name": {"type": "boolean"},
            "is_all_products_same_price": {"type": "boolean"},
            "is_all_products_same_description": {"type": "boolean"},
            "is_all_products_same_model": {"type": "boolean"},
            "date_updated": {"type": "string", "format": "date-time"},
        },
    },
    "RequestLog": {
        "type": "object",
        "description": "Поля модели RequestLog (`fields = __all__` в сериализаторе).",
        "properties": {
            "id": {"type": "integer"},
            "user": {"type": "integer"},
            "method": {"type": "string", "enum": ["POST", "PUT", "PATCH", "DELETE"]},
            "old_value": {"type": "object"},
            "new_value": {"type": "object"},
            "serializer_class": {"type": "string", "nullable": True},
            "model_name": {"type": "string", "nullable": True},
            "date": {"type": "string", "format": "date-time"},
            "content_type": {"type": "integer"},
            "object_id": {"type": "integer"},
        },
    },
    "AdminUserSnippet": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "first_name": {"type": "string", "nullable": True},
            "last_name": {"type": "string", "nullable": True},
            "email": {"type": "string", "nullable": True},
            "is_active": {"type": "boolean"},
        },
    },
    "AdminUserListItem": {
        "type": "object",
        "description": "Элемент списка пользователей (`UserSerializer`).",
        "properties": {
            "id": {"type": "integer"},
            "last_login": {"type": "string", "format": "date-time", "nullable": True},
            "date_joined": {"type": "string", "format": "date-time"},
            "email": {"type": "string", "nullable": True},
            "is_superuser": {"type": "boolean"},
            "is_staff": {"type": "boolean"},
            "is_active": {"type": "boolean"},
            "first_name": {"type": "string", "nullable": True},
            "last_name": {"type": "string", "nullable": True},
            "username": {"type": "string", "nullable": True},
            "phone_number": {"type": "string", "nullable": True},
            "photo": {"type": "string", "nullable": True},
            "language": {"type": "string"},
            "groups": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/GroupNested"},
            },
            "user_permissions": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/PermissionNested"},
            },
        },
    },
    "AdminEmployeeDetail": {
        "type": "object",
        "description": "Деталь сотрудника (`EmployeeSerializer`).",
        "allOf": [
            {"$ref": "#/components/schemas/AdminUserListItem"},
        ],
    },
    "AdminClientDetail": {
        "type": "object",
        "description": "Деталь не-сотрудника (`UserSerializer` без staff-специфики).",
        "properties": {
            "id": {"type": "integer"},
            "last_login": {"type": "string", "format": "date-time", "nullable": True},
            "date_joined": {"type": "string", "format": "date-time"},
            "email": {"type": "string", "nullable": True},
            "is_superuser": {"type": "boolean"},
            "is_staff": {"type": "boolean"},
            "is_active": {"type": "boolean"},
            "first_name": {"type": "string", "nullable": True},
            "last_name": {"type": "string", "nullable": True},
            "username": {"type": "string", "nullable": True},
            "phone_number": {"type": "string", "nullable": True},
            "photo": {"type": "string", "nullable": True},
            "language": {"type": "string"},
            "groups": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/GroupNested"},
            },
            "user_permissions": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/PermissionNested"},
            },
        },
    },
    "EmployeeCreateRequest": {
        "type": "object",
        "required": [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
        ],
        "properties": {
            "email": {"type": "string", "format": "email"},
            "password": {"type": "string", "format": "password"},
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "phone_number": {"type": "string"},
            "is_active": {"type": "boolean"},
            "group_ids": {"type": "array", "items": {"type": "integer"}},
            "permission_ids": {"type": "array", "items": {"type": "integer"}},
        },
    },
    "EmployeeUpdateRequest": {
        "type": "object",
        "description": "PUT/PATCH — поля `EmployeeSerializer` (частично при PATCH).",
        "properties": {
            "email": {"type": "string", "format": "email"},
            "password": {"type": "string", "format": "password"},
            "first_name": {"type": "string"},
            "last_name": {"type": "string"},
            "phone_number": {"type": "string"},
            "is_active": {"type": "boolean"},
            "photo": {"type": "string", "nullable": True},
            "language": {"type": "string"},
            "group_ids": {"type": "array", "items": {"type": "integer"}},
            "permission_ids": {"type": "array", "items": {"type": "integer"}},
        },
    },
    "ProductCategoryCover": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "category": {"type": "integer", "nullable": True},
            "image": {"type": "string", "description": "URL файла"},
            "creator": {"$ref": "#/components/schemas/AdminUserSnippet"},
            "is_active": {"type": "boolean"},
            "date_created": {"type": "string", "format": "date-time"},
        },
    },
    "ProductCategoryParentRef": {
        "type": "object",
        "nullable": True,
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
        },
    },
    "ProductCategory": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "name": {"type": "string"},
            "description": {"type": "string", "nullable": True},
            "covers": {
                "type": "array",
                "items": {"$ref": "#/components/schemas/ProductCategoryCover"},
            },
            "parent": {"$ref": "#/components/schemas/ProductCategoryParentRef"},
            "parent_id": {"type": "integer", "nullable": True, "writeOnly": True},
            "covers_ids": {
                "type": "array",
                "items": {"type": "integer"},
                "writeOnly": True,
                "description": "Обязательны при создании/обновлении (сериализатор).",
            },
            "is_active": {"type": "boolean"},
            "creator": {"$ref": "#/components/schemas/AdminUserSnippet"},
            "date_created": {"type": "string", "format": "date-time"},
        },
    },
    "ProductCategoryWrite": {
        "type": "object",
        "required": ["name", "covers_ids"],
        "properties": {
            "name": {"type": "string"},
            "description": {"type": "string", "nullable": True},
            "parent_id": {"type": "integer", "nullable": True},
            "covers_ids": {"type": "array", "items": {"type": "integer"}},
            "is_active": {"type": "boolean"},
        },
        "description": "Тело POST/PUT/PATCH без скрытого creator_id (проставляется на бэкенде).",
    },
    "ProductCard": {
        "type": "object",
        "properties": {
            "id": {"type": "integer"},
            "categories": {
                "type": "array",
                "items": {"type": "integer"},
                "description": "ID категорий (M2M).",
            },
            "is_all_products_same_name": {"type": "boolean"},
            "is_all_products_same_price": {"type": "boolean"},
            "is_all_products_same_description": {"type": "boolean"},
            "is_all_products_same_model": {"type": "boolean"},
            "date_created": {"type": "string", "format": "date-time"},
            "creator": {"type": "integer"},
            "is_active": {"type": "boolean"},
        },
    },
}

ADMINISTRATION_PATHS = {
    f"{BASE}/users/groups/": {
        **_op(
            "get",
            "Список групп",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_GROUPS_LIST),
            {
                "200": {
                    "description": "Массив групп.",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {"$ref": "#/components/schemas/GroupNested"},
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
        )
    },
    f"{BASE}/users/permissions/": {
        **_op(
            "get",
            "Список прав доступа",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_PERMISSIONS_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {
                                    "$ref": "#/components/schemas/PermissionNested"
                                },
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
        )
    },
    f"{BASE}/users/logs/{{user_id}}/": {
        "parameters": PATH_USER_ID,
        **_op(
            "get",
            "Список логов запросов пользователя",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_USER_LOGS_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/PaginatedRequestLogs"
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
        ),
    },
    f"{BASE}/users/": {
        **_op(
            "get",
            "Список пользователей",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_USERS_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/PaginatedUsers"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
        )
    },
    f"{BASE}/users/{{pk}}/": {
        "parameters": PATH_PK,
        **_op(
            "get",
            "Детально о пользователе",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_USER_DETAIL),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "oneOf": [
                                    {
                                        "$ref": "#/components/schemas/AdminEmployeeDetail"
                                    },
                                    {"$ref": "#/components/schemas/AdminClientDetail"},
                                ]
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
        ),
    },
    f"{BASE}/users/{{pk}}/update/": {
        "parameters": PATH_PK,
        **_op(
            "put",
            "Обновление сотрудника",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_EMPLOYEE_UPDATE_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/AdminEmployeeDetail"
                            }
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/EmployeeUpdateRequest"}
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) сотрудника",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_EMPLOYEE_UPDATE_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/AdminEmployeeDetail"
                            }
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/EmployeeUpdateRequest"}
                    }
                },
            },
        ),
    },
    f"{BASE}/users/employee/create/": {
        **_op(
            "post",
            "Создание сотрудника",
            _pec(exc_users_admin.DESCRIPTIONS_ADMIN_EMPLOYEE_CREATE),
            {
                "201": {
                    "description": "Созданный пользователь (формат ответа как у сериализатора).",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/AdminEmployeeDetail"
                            }
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_USERS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/EmployeeCreateRequest"}
                    }
                },
            },
        )
    },
    f"{BASE}/settings/": {
        **_op(
            "get",
            "Детально о настройках",
            _pec(exc_settings.DESCRIPTIONS_SETTINGS_GET),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Settings"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SETTINGS,
            security=SEC,
        )
    },
    f"{BASE}/settings/update/": {
        **_op(
            "put",
            "Обновление настроек",
            _pec(exc_settings.DESCRIPTIONS_SETTINGS_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Settings"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SETTINGS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Settings"},
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) настроек",
            _pec(exc_settings.DESCRIPTIONS_SETTINGS_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Settings"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SETTINGS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Settings"},
                    }
                },
            },
        ),
    },
    f"{BASE}/shops/create/": {
        **_op(
            "post",
            "Создание магазина",
            _pec(exc_shops.DESCRIPTIONS_SHOP_CREATE),
            {
                "201": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Shop"}
                        }
                    },
                },
                **R400,
            },
            tag=TAG_ADMIN_SHOPS,
            security=[],
        )
    },
    f"{BASE}/shops/": {
        **_op(
            "get",
            "Список магазинов",
            _pec(exc_shops.DESCRIPTIONS_SHOPS_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/PaginatedShops"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SHOPS,
            security=SEC,
        )
    },
    f"{BASE}/shops/{{pk}}/": {
        "parameters": PATH_PK,
        **_op(
            "get",
            "Детально о магазине",
            _pec(exc_shops.DESCRIPTIONS_SHOP_DETAIL),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Shop"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SHOPS,
            security=SEC,
        ),
    },
    f"{BASE}/shops/{{pk}}/update/": {
        "parameters": PATH_PK,
        **_op(
            "put",
            "Обновление магазина",
            _pec(exc_shops.DESCRIPTIONS_SHOP_UPDATE_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Shop"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SHOPS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Shop"},
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) магазина",
            _pec(exc_shops.DESCRIPTIONS_SHOP_UPDATE_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Shop"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SHOPS,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Shop"},
                    }
                },
            },
        ),
    },
    f"{BASE}/shops/{{pk}}/delete/": {
        "parameters": PATH_PK,
        **_op(
            "delete",
            "Удаление магазина",
            _pec(exc_shops.DESCRIPTIONS_SHOP_DELETE),
            {
                "204": {"description": "Удалено."},
                "400": {
                    "description": "Главный офис.",
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ErrorResponse"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SHOPS,
            security=SEC,
        ),
    },
    f"{BASE}/sizes/create/": {
        **_op(
            "post",
            "Создание размера",
            _pec(exc_sizes.DESCRIPTIONS_SIZE_CREATE),
            {
                "201": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Size"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Size"},
                    }
                },
            },
        )
    },
    f"{BASE}/sizes/": {
        **_op(
            "get",
            "Список размеров",
            _pec(exc_sizes.DESCRIPTIONS_SIZES_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/PaginatedSizes"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
        )
    },
    f"{BASE}/sizes/{{pk}}/": {
        "parameters": PATH_PK,
        **_op(
            "get",
            "Детально о размере",
            _pec(exc_sizes.DESCRIPTIONS_SIZE_DETAIL),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Size"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
        ),
    },
    f"{BASE}/sizes/{{pk}}/update/": {
        "parameters": PATH_PK,
        **_op(
            "put",
            "Обновление размера",
            _pec(exc_sizes.DESCRIPTIONS_SIZE_UPDATE_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Size"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Size"},
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) размера",
            _pec(exc_sizes.DESCRIPTIONS_SIZE_UPDATE_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/Size"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/Size"},
                    }
                },
            },
        ),
    },
    f"{BASE}/sizes/{{pk}}/delete/": {
        "parameters": PATH_PK,
        **_op(
            "delete",
            "Удаление размера",
            _pec(exc_sizes.DESCRIPTIONS_SIZE_DELETE),
            {
                "204": {"description": "Удалено."},
                **R401_403,
            },
            tag=TAG_ADMIN_SIZES,
            security=SEC,
        ),
    },
    f"{BASE}/color-palettes/create/": {
        **_op(
            "post",
            "Создание цвета палитры",
            _pec(exc_color_palettes.DESCRIPTIONS_COLOR_PALETTE_CREATE),
            {
                "201": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ColorPalette"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_PALETTE,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ColorPalette"},
                    }
                },
            },
        )
    },
    f"{BASE}/color-palettes/": {
        **_op(
            "get",
            "Список цветов палитры",
            _pec(exc_color_palettes.DESCRIPTIONS_COLOR_PALETTES_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/PaginatedColorPalettes"
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_PALETTE,
            security=SEC,
        )
    },
    f"{BASE}/color-palettes/{{pk}}/update/": {
        "parameters": PATH_PK,
        **_op(
            "put",
            "Обновление цвета палитры",
            _pec(exc_color_palettes.DESCRIPTIONS_COLOR_PALETTE_UPDATE_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ColorPalette"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_PALETTE,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ColorPalette"},
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) цвета палитры",
            _pec(exc_color_palettes.DESCRIPTIONS_COLOR_PALETTE_UPDATE_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ColorPalette"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_PALETTE,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ColorPalette"},
                    }
                },
            },
        ),
    },
    f"{BASE}/color-palettes/{{pk}}/delete/": {
        "parameters": PATH_PK,
        **_op(
            "delete",
            "Удаление цвета палитры",
            _pec(exc_color_palettes.DESCRIPTIONS_COLOR_PALETTE_DELETE),
            {
                "204": {"description": "Удалено."},
                **R401_403,
            },
            tag=TAG_ADMIN_PALETTE,
            security=SEC,
        ),
    },
    f"{BASE}/product-categories/covers/create/": {
        **_op(
            "post",
            "Создание обложки категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_COVER_CREATE),
            {
                "201": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/ProductCategoryCover"
                            }
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "multipart/form-data": {
                        "schema": {
                            "type": "object",
                            "required": ["image"],
                            "properties": {
                                "image": {"type": "string", "format": "binary"},
                                "category_id": {"type": "integer"},
                            },
                        }
                    }
                },
            },
        )
    },
    f"{BASE}/product-categories/": {
        **_op(
            "get",
            "Список категорий товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORIES_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/PaginatedProductCategories"
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
        )
    },
    f"{BASE}/product-categories/create/": {
        **_op(
            "post",
            "Создание категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_CREATE),
            {
                "201": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ProductCategory"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ProductCategoryWrite"}
                    }
                },
            },
        )
    },
    f"{BASE}/product-categories/{{pk}}/": {
        "parameters": PATH_PK,
        **_op(
            "get",
            "Детально о категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_DETAIL),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ProductCategory"}
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
        ),
    },
    f"{BASE}/product-categories/{{pk}}/update/": {
        "parameters": PATH_PK,
        **_op(
            "put",
            "Обновление категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_UPDATE_PUT),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ProductCategory"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ProductCategoryWrite"}
                    }
                },
            },
        ),
        **_op(
            "patch",
            "Обновление (частичное) категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_UPDATE_PATCH),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/ProductCategory"}
                        }
                    },
                },
                **R401_403,
                **R400,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
            request_body={
                "required": True,
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/ProductCategoryWrite"}
                    }
                },
            },
        ),
    },
    f"{BASE}/product-categories/{{pk}}/delete/": {
        "parameters": PATH_PK,
        **_op(
            "delete",
            "Удаление категории товаров",
            _pec(exc_product_categories.DESCRIPTIONS_PRODUCT_CATEGORY_DELETE),
            {
                "204": {"description": "Удалено."},
                **R401_403,
            },
            tag=TAG_ADMIN_CATEGORIES,
            security=SEC,
        ),
    },
    f"{BASE}/product-cards/": {
        **_op(
            "get",
            "Список карточек товаров",
            _pec(exc_product_cards.DESCRIPTIONS_PRODUCT_CARDS_LIST),
            {
                "200": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "array",
                                "items": {"$ref": "#/components/schemas/ProductCard"},
                            }
                        }
                    },
                },
                **R401_403,
            },
            tag=TAG_ADMIN_PRODUCT_CARDS,
            security=SEC,
        )
    },
}
