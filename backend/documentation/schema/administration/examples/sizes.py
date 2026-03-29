"""Размеры одежды."""

DESCRIPTIONS_SIZE_CREATE = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Создание размера; поле `order` при создании выставляется автоматически.\n"
    )
}

DESCRIPTIONS_SIZES_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список размеров с пагинацией, поиском и сортировкой по полям модели `Size`.\n"
    )
}

DESCRIPTIONS_SIZE_DETAIL = {
    "PECULIARITIES": "**Описание:**\nРазмер по `pk`.\n"
}

DESCRIPTIONS_SIZE_UPDATE_PUT = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Обновление размера; при PUT/PATCH поле `order` обязательно (валидация `SizeSerializer`).\n"
    )
}

DESCRIPTIONS_SIZE_UPDATE_PATCH = {
    "PECULIARITIES": "**Описание:**\nЧастичное обновление размера (см. валидацию `order`).\n"
}

DESCRIPTIONS_SIZE_DELETE = {
    "PECULIARITIES": "**Описание:**\nУдаление размера.\n"
}
