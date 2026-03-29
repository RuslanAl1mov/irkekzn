"""Магазины."""

DESCRIPTIONS_SHOP_CREATE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Создание магазина (`ShopSerializer`).\n\n"
        "**Важно:**\n"
        "В `ShopCreateView` закомментированы `permission_classes` — фактически нет проверки "
        "`IsEmployee`/`CRUDPermissions` (остаётся поведение DRF по умолчанию). Уточни политику перед продакшеном.\n"
    )
}

DESCRIPTIONS_SHOPS_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список магазинов с пагинацией; в ответе `active` — число активных.\n\n"
        "**Query:**\n"
        "- фильтр `ShopListFilter`, `search`, `ordering`\n"
    )
}

DESCRIPTIONS_SHOP_DETAIL = {
    "PECULIARITIES": "**Описание:**\nОдин магазин по `pk`.\n"
}

DESCRIPTIONS_SHOP_UPDATE_PUT = {
    "PECULIARITIES": "**Описание:**\nПолное обновление магазина.\n"
}

DESCRIPTIONS_SHOP_UPDATE_PATCH = {
    "PECULIARITIES": "**Описание:**\nЧастичное обновление магазина.\n"
}

DESCRIPTIONS_SHOP_DELETE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Удаление магазина.\n\n"
        "**Ошибка 400:**\n"
        "Нельзя удалить магазин с `is_main_office=True`, пока не назначен другой главный офис.\n"
    )
}
