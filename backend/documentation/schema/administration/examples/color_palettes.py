"""Палитра цветов."""

DESCRIPTIONS_COLOR_PALETTE_CREATE = {
    "PECULIARITIES": "**Описание:**\nСоздание записи цвета (`ColorPaletteSerializer`).\n"
}

DESCRIPTIONS_COLOR_PALETTES_LIST = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Список цветов с пагинацией; `active` — число активных.\n\n"
        "**Query:**\n"
        "- `ColorPaletteListFilter`, `search` по name/hex, `ordering`\n"
    )
}

DESCRIPTIONS_COLOR_PALETTE_UPDATE_PUT = {
    "PECULIARITIES": "**Описание:**\nПолное обновление цвета палитры.\n"
}

DESCRIPTIONS_COLOR_PALETTE_UPDATE_PATCH = {
    "PECULIARITIES": "**Описание:**\nЧастичное обновление цвета палитры.\n"
}

DESCRIPTIONS_COLOR_PALETTE_DELETE = {
    "PECULIARITIES": "**Описание:**\nУдаление цвета палитры.\n"
}
