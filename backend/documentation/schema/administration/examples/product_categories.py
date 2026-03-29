"""Категории товаров и обложки."""

DESCRIPTIONS_PRODUCT_CATEGORY_COVER_CREATE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Загрузка обложки категории (`multipart/form-data`).\n\n"
        "**Поля формы:**\n"
        "- `image` (обязательно)\n"
        "- `category_id` (опционально)\n\n"
        "`creator` подставляется на сервере (`HiddenField`).\n"
    )
}

DESCRIPTIONS_PRODUCT_CATEGORIES_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список категорий с пагинацией и полем `active` в ответе.\n"
    )
}

DESCRIPTIONS_PRODUCT_CATEGORY_CREATE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Создание категории; в теле обязательны `name` и `covers_ids`.\n"
    )
}

DESCRIPTIONS_PRODUCT_CATEGORY_DETAIL = {
    "PECULIARITIES": "**Описание:**\nКатегория с вложенными `covers` и объектом `parent`.\n"
}

DESCRIPTIONS_PRODUCT_CATEGORY_UPDATE_PUT = {
    "PECULIARITIES": "**Описание:**\nПолное обновление категории.\n"
}

DESCRIPTIONS_PRODUCT_CATEGORY_UPDATE_PATCH = {
    "PECULIARITIES": "**Описание:**\nЧастичное обновление категории.\n"
}

DESCRIPTIONS_PRODUCT_CATEGORY_DELETE = {
    "PECULIARITIES": "**Описание:**\nУдаление категории.\n"
}
