"""Глобальные настройки (singleton id=1)."""

DESCRIPTIONS_SETTINGS_GET = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Чтение глобальных настроек; Настройки системы всегда должны существовать в единственном экземпляре и при запросе детальной информации создают запись если её нет.\n\n"
        "**Права:**\n"
        "- `IsAuthenticated`, `IsEmployee`, `CRUDPermissions`\n"
    )
}

DESCRIPTIONS_SETTINGS_PUT = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Обновление всех полей настроек системы (`SettingsSerializer`).\n"
    )
}

DESCRIPTIONS_SETTINGS_PATCH = {
    "PECULIARITIES": "**Описание:**\nОбновление (частичное) настроек системы.\n"
}
