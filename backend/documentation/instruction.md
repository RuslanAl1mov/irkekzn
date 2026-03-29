# Ручная OpenAPI-документация (**irkekzn**)

Документация собирается в Python-словарь `MANUAL_OPENAPI_SCHEMA` и отдаётся view’ом `documentation.views.ManualSchemaView`; UI — Swagger / Redoc из **drf-spectacular** (см. `documentation/urls.py`, подключение в `core/urls.py`: `/api/v1/docs/`).

**Цель структуры:** общая база (`base.py`) + **пакет на каждое приложение API** с разделением «сборка схемы» (`doc.py`) и «тексты + примеры» (`examples/`).

---

## Дерево `documentation/schema/`

```
schema/
  __init__.py          # склейка SCHEMAS, PATHS, TAGS, x-tagGroups → MANUAL_OPENAPI_SCHEMA
  base.py              # info, security, ErrorResponse, общие responses
  users/
    __init__.py        # реэкспорт USERS_AUTH_*, USERS_TAG
    doc.py             # USERS_AUTH_SCHEMAS, USERS_AUTH_PATHS
    examples/
      auth.py          # DESCRIPTIONS_* (PECULIARITIES), EXAMPLE_* для login и т.д.
  administration/
    __init__.py        # реэкспорт ADMINISTRATION_*, ADMINISTRATION_TAGS, ADMINISTRATION_X_TAG_GROUPS
    doc.py             # схемы, пути, константы TAG_ADMIN_*, _op(tag=…), _pec()
    examples/
      users_admin.py   # описания по блокам (группы, пользователи, сотрудник…)
      settings.py
      shops.py
      sizes.py
      color_palettes.py
      product_categories.py
      product_cards.py
```

Префиксы (см. `core/urls.py`):

- `/api/v1/auth/…` — тег **Users** (`users/doc.py`)
- `/api/v1/administration/…` — **несколько тегов** по доменам (`Пользователи и доступ`, `Настройки`, `Магазины`, …) — см. `administration/doc.py`
- `/api/v1/marketplace/…` — пока без схемы; при появлении ручек — новый пакет по образцу ниже

### Группы в списке операций (Swagger / ReDoc)

- **Swagger UI** (`manual-docs/`): операции группируются по полю **`tags`** у каждой операции. Один тег = одна секция в боковой панели. Сейчас админка разбита на семь тегов вместо одного общего «Administration».
- **ReDoc** (`manual-redoc/`): в корне схемы задано расширение **`x-tagGroups`** — теги собираются под заголовками **«Аккаунт и вход»** и **«Администрирование»**. Это стандартное расширение ReDoc, не часть строгого OpenAPI 3.0.

Чтобы новая ручка попала в нужную группу, в `administration/doc.py` в вызове **`_op(..., tag=TAG_ADMIN_SHOPS, security=...)`** укажи существующую константу `TAG_ADMIN_*` или добавь новую + строку в **`ADMINISTRATION_TAGS`** и в **`ADMINISTRATION_X_TAG_GROUPS`**.

---

## 1. `base.py` — не трогать без нужды

Здесь: `OPENAPI_VERSION`, `INFO`, `GLOBAL_SECURITY`, `SECURITY_SCHEMES` (**CookieAuth**), `BASE_SCHEMAS` (`ErrorResponse`), `BASE_RESPONSES` (`ValidationError`, `UnauthorizedError`, `ForbiddenError`).

Имена схем в `components.schemas` **общие для всего API**: новые модели называй уникально (например `MarketplaceProduct`, а не голое `Product`), чтобы не пересечься с `administration`.

---

## 2. Описания и примеры: паттерн `PECULIARITIES`

В `examples/*.py` хранятся словари с ключом **`PECULIARITIES`** — markdown-текст для поля операции `description` в OpenAPI (удобно читать в Swagger).

```python
# documentation/schema/users/examples/auth.py (фрагмент)

DESCRIPTIONS_LOGIN_ADMIN = {
    "PECULIARITIES": (
        "**Описание:**\n"
        "Кратко что делает эндпоинт.\n\n"
        "**Права / безопасность:**\n"
        "- …\n\n"
        "**Особенности:**\n"
        "- …\n"
    )
}

EXAMPLE_LOGIN_ADMIN_REQUEST = {"email": "admin@example.com", "password": "…"}
```

В `doc.py` текст подставляется так:

- **users:** `exc_auth._pec(exc_auth.DESCRIPTIONS_LOGIN_ADMIN)` или локальный `_pec`;
- **administration:** `_pec(exc_shops.DESCRIPTIONS_SHOPS_LIST)` после импорта `examples.shops as exc_shops`.

**Примеры JSON** для Swagger: поле `example` / `examples` рядом со `schema` в `requestBody` или в `responses.*.content.application/json` (см. login в `users/doc.py`).

### Единый стиль `summary` в списке операций

Второй аргумент `_op(...)` в `administration/doc.py` и поле `summary` в `users/doc.py` — короткое имя операции в Swagger (не путать с развёрнутым `description` из `PECULIARITIES`).

Для **CRUD по сущности** (магазин, размер, категория товаров и т.д.):

| Действие | Шаблон `summary` |
|----------|------------------|
| POST create | Создание … |
| GET list | Список … |
| GET retrieve | Детально о … |
| PUT | Обновление … |
| PATCH | Обновление (частичное) … |
| DELETE | Удаление … |

Пример для магазина: «Создание магазина», «Список магазинов», «Детально о магазине», «Обновление магазина», «Обновление (частичное) магазина», «Удаление магазина».

**Составные сущности** называй полностью: «категория товаров», «обложка категории товаров», «цвет палитры».

**Не CRUD:** списки без одной модели — «Список групп», «Список прав доступа», «Список логов запросов пользователя»; сотрудник как отдельный процесс — «Создание сотрудника», «Обновление сотрудника», «Детально о пользователе» (карточка в админке). Синглтон настроек: GET — «Детально о настройках», PUT/PATCH — «Обновление настроек» / «Обновление (частичное) настроек».

**Auth (`users`):** «Вход сотрудника», «Обновление токенов», «Выход из системы», «Профиль текущего пользователя».

---

## 3. Как дополнить документацию **users** (`/api/v1/auth/`)

1. Добавь или расширь константы в `documentation/schema/users/examples/auth.py` (`DESCRIPTIONS_*`, при необходимости `EXAMPLE_*`).
2. В `documentation/schema/users/doc.py`:
   - при новой **схеме** — запись в `USERS_AUTH_SCHEMAS`;
   - при новом **пути** — ключ `f"{BASE_AUTH_PATH}/…/"` в `USERS_AUTH_PATHS` с `tags`, `summary`, `description` из `_pec(...)`, `security`, `responses` (и `requestBody` при POST/PATCH/PUT).
3. Убедись, что маршрут реально есть в `core/urls.py`; префикс пути в схеме совпадает с URL.

Отдельный тег «Auth» не используется: всё под тегом **Users**.

---

## 4. Как дополнить документацию **administration**

1. **Текст:** вынести или дописать блок в подходящий файл в `documentation/schema/administration/examples/` (или создать новый, например `promotions.py`, и импортировать его в `doc.py`).
2. **Схема:** при новых полях ответа/запроса — добавить/изменить объект в `ADMINISTRATION_SCHEMAS` в `administration/doc.py`.
3. **Путь:** в `ADMINISTRATION_PATHS` добавить элемент с ключом **ровно как в OpenAPI**, с `{pk}` / `{user_id}` в фигурных скобках; при параметрах пути добавь `"parameters": PATH_PK` или `PATH_USER_ID` (см. существующие записи).
4. Операции собирай через **`_op(..., tag=TAG_ADMIN_…, security=…)`** — обязательный **`tag`** задаёт секцию в Swagger; `description` = `_pec(exc_module.DESCRIPTIONS_…["PECULIARITIES"])`.

Если добавляешь **новый файл** в `examples/`, в начале `administration/doc.py` добавь импорт:

```python
from documentation.schema.administration.examples import my_new_module as exc_my_new
```

и используй `_pec(exc_my_new.DESCRIPTIONS_…)` в вызовах `_op`.

---

## 5. Как подключить **новое приложение** (например `marketplace`)

1. Создать пакет `documentation/schema/marketplace/`:
   - `__init__.py` — `from .doc import MARKETPLACE_PATHS, MARKETPLACE_SCHEMAS, MARKETPLACE_TAG` и `__all__`;
   - `doc.py` — схемы, пути, константа `BASE = "/api/v1/marketplace"`;
   - `examples/` — по одному или нескольким файлам на область (список товаров, деталь, …).
2. В `documentation/schema/__init__.py`:
   - импорт `MARKETPLACE_*`;
   - `SCHEMAS |=` **или** `**{**MARKETPLACE_SCHEMAS}` в словаре;
   - `PATHS |= MARKETPLACE_PATHS`;
   - новый элемент в списке `TAGS` с человекочитаемым `description`.
3. Проверить отсутствие дубликатов имён в `components.schemas` после склейки.

---

## 6. Сборщик `schema/__init__.py` (актуальная логика)

Импорты из пакетов `users` и `administration`, объединение:

```python
SCHEMAS = {**BASE_SCHEMAS, **USERS_AUTH_SCHEMAS, **ADMINISTRATION_SCHEMAS}
PATHS = dict(USERS_AUTH_PATHS)
PATHS |= ADMINISTRATION_PATHS

TAGS = [{"name": USERS_TAG, "description": "…"}, *ADMINISTRATION_TAGS]

X_TAG_GROUPS = [
    {"name": "Аккаунт и вход", "tags": [USERS_TAG]},
    *ADMINISTRATION_X_TAG_GROUPS,
]

MANUAL_OPENAPI_SCHEMA = {
    # …
    "tags": TAGS,
    "x-tagGroups": X_TAG_GROUPS,
}
```

Порядок объектов в **`TAGS`** влияет на порядок секций в Swagger. **`x-tagGroups`** читает ReDoc для вложенных заголовков.

---

## 7. Где смотреть результат

| URL | Назначение |
|-----|------------|
| `/api/v1/docs/manual-schema/` | JSON/YAML схемы |
| `/api/v1/docs/manual-docs/` | Swagger UI |
| `/api/v1/docs/manual-redoc/` | ReDoc |

---

## 8. Заметки по проекту

- **JWT / cookie:** в схеме описан **CookieAuth**; фактически `AuthBackend` сначала читает cookie `access`, иначе срабатывает стандартный `Authorization` из simplejwt. Контракт для клиентов в этом проекте — **cookie**; при смене имён кук обнови `SECURITY_SCHEMES` и `REST_AUTH`.
- **Права:** админские view используют `core.permissions` — для отказа в доступе в схеме достаточно ссылок на `ForbiddenError` / `UnauthorizedError`.
- **Обёртка JSON:** при необходимости отразить `WrappedJSONRenderer` — добавь схему-обёртку в `BASE_SCHEMAS` и используй её в `content`.
- **Актуальные auth-маршруты** в `core/urls.py`: login admin, me, token refresh, logout; client register/login закомментированы — в OpenAPI их нет, пока маршруты не включены.

---

## Чеклист перед коммитом

- Путь в `PATHS` совпадает с `urls.py` (включая слэш в конце, если так заведено в Django).
- Для `{pk}` / `{user_id}` заданы `parameters` в объекте path item.
- Новые имена в `components.schemas` уникальны глобально.
- После правок: открыть Swagger и проверить секции **Users** и **Administration**.
