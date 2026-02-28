# Настройки админ-панели Jazzmin

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": True,
    "footer_small_text": True,
    "body_small_text": True,
    "brand_small_text": False,
    "accent": "accent-primary",
    "navbar": "navbar-white navbar-light",
    "no_navbar_border": True,
    "navbar_fixed": True,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": True,
    "sidebar_nav_small_text": True,
    "sidebar_disable_expand": True,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": True,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": True,
    "theme": "default",
    "dark_mode_theme": None,
    "button_classes": {
        "primary": "btn-outline-primary",
        "secondary": "btn-outline-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "danger": "btn-danger",
        "success": "btn-success",
    },
    "actions_sticky_top": True,
    "language_chooser": True,
}

JAZZMIN_SETTINGS = {
    "site_title": "IRKE Admin",
    "site_header": "IRKE Administration",
    "site_brand": "IRKE Administration",
    "site_logo": "/media/images/project/favicon-96x96.png",
    "login_logo": "/media/images/project/apple-touch-icon.png",
    "site_icon": "/media/images/project/favicon.ico",
    "welcome_sign": "Добро пожаловать в IRKE",
    "copyright": "IRKE",
    "topmenu_links": [
        {
            "name": "Home",
            "url": "admin:index",
            "icon": "fas fa-home",
            "permissions": ["auth.view_user"],
        },
        {
            "name": "IRKE",
            "url": "https://irkekzn.com/",
            "icon": "fas fa-globe",
            "new_window": True,
        },
    ],
    "icons": {
        "auth": "fas fa-users-cog",          # иконка для приложения "auth"
        "auth.user": "fas fa-user",            # для модели User
        "auth.group": "fas fa-people-roof",          # для модели Group
        "users.User": "fas fa-users"
    },
    "order_with_respect_to": [
        "users.User"
    ],
    "show_sidebar": True,
    "navigation_expanded": True,
    "hide_apps": [],
    "hide_models": [],
    "custom_css": None,
    "custom_js": None,
    "use_google_fonts_cdn": True,
    "show_ui_builder": False,
    "changeform_format": "horizontal_tabs",
    "language_chooser": True,

}
