import type { IUserLog } from "@/entities/user-logs";

/**
 * Полные имена классов сериализаторов, как приходят с бэкенда (см. UserLoggingMixin).
 */
export const SERIALIZER_DISPLAY_NAMES: Record<string, string> = {
  "administration.serializers.SizeSerializer": "Размер товара",
  "administration.serializers.SizeUpdateSerializer": "Размер товара",
  "administration.serializers.ColorPaletteSerializer": "Цвет палитры",
  "administration.serializers.ShopSerializer": "Бутик",
  "administration.serializers.SettingsSerializer": "Настройки системы",
  "users.serializers.EmployeeSerializer": "Сотрудник",
  "users.serializers.EmployeeCreateSerializer": "Сотрудник",
  "users.serializers.UserSerializer": "Пользователь",
  "users.serializers.ClientSerializer": "Клиент",
  "users.serializers.GroupSerializer": "Группа доступа",
  "users.serializers.PermissionSerializer": "Право доступа",
};

/** Fallback по имени модели Django (object_name), если сериализатор не в списке */
export const MODEL_DISPLAY_NAMES: Record<string, string> = {
  Size: "Размер товара",
  ColorPalette: "Цвет палитры",
  Shop: "Бутик",
  Settings: "Настройки системы",
  User: "Пользователь",
  Group: "Группа доступа",
  Permission: "Право доступа",
};

/**
 * Список / раздел без id (fallback, если нет object_id или нет сегмента сущности).
 */
const SERIALIZER_TO_HREF: Record<string, string> = {
  "administration.serializers.SizeSerializer": "/settings/?tab=sizes-table",
  "administration.serializers.SizeUpdateSerializer": "/settings/?tab=sizes-table",
  "administration.serializers.ColorPaletteSerializer": "/settings/?tab=color-palette",
  "administration.serializers.ShopSerializer": "/shops/",
  "administration.serializers.SettingsSerializer": "/settings/?tab=general",
  "users.serializers.EmployeeSerializer": "/employees/",
  "users.serializers.EmployeeCreateSerializer": "/employees/",
  "users.serializers.ClientSerializer": "/clients/",
  "users.serializers.UserSerializer": "/employees/",
  "users.serializers.GroupSerializer": "/settings/?tab=permissions",
  "users.serializers.PermissionSerializer": "/settings/?tab=permissions",
};

const MODEL_TO_HREF: Record<string, string> = {
  Size: "/settings/?tab=sizes-table",
  ColorPalette: "/settings/?tab=color-palette",
  Shop: "/shops/",
  Settings: "/settings/?tab=general",
  User: "/employees/",
  Group: "/settings/?tab=permissions",
  Permission: "/settings/?tab=permissions",
};

/** Сегмент пути: `/${segment}/${object_id}/` (не для DELETE). */
const SERIALIZER_TO_ENTITY_SEGMENT: Record<string, string> = {
  "users.serializers.EmployeeSerializer": "employee",
  "users.serializers.EmployeeCreateSerializer": "employee",
  "users.serializers.UserSerializer": "employee",
  "users.serializers.ClientSerializer": "client",
  "administration.serializers.ShopSerializer": "shop",
};

const MODEL_TO_ENTITY_SEGMENT: Record<string, string> = {
  Shop: "shop",
};

const hrefWithEntityId = (segment: string, objectId: number): string =>
  `/${segment}/${objectId}/`;

export const getMethodLabel = (method: string): string => {
  const upper = method.toUpperCase();
  if (upper === "POST") return "Создание";
  if (upper === "PATCH" || upper === "PUT") return "Изменение";
  if (upper === "DELETE") return "Удаление";
  return method;
};

export const getSerializerDisplayName = (serializerClass: string | null): string | null =>
  serializerClass ? (SERIALIZER_DISPLAY_NAMES[serializerClass] ?? null) : null;

export const getModelDisplayName = (modelName: string | null): string | null =>
  modelName ? MODEL_DISPLAY_NAMES[modelName] ?? null : null;

export const getLogEntityTitle = (log: IUserLog): string => {
  const fromSerializer = getSerializerDisplayName(log.serializer_class);
  if (fromSerializer) return fromSerializer;
  const fromModel = getModelDisplayName(log.model_name);
  if (fromModel) return fromModel;
  if (log.model_name) return log.model_name;
  if (log.serializer_class) {
    const parts = log.serializer_class.split(".");
    return parts[parts.length - 1]?.replace(/Serializer$/, "") ?? log.serializer_class;
  }
  return "Запись";
};

export const getLogObjectHref = (log: IUserLog): string | null => {
  if (log.method?.toUpperCase() === "DELETE") {
    return null;
  }

  const id = log.object_id;

  if (log.serializer_class && SERIALIZER_TO_ENTITY_SEGMENT[log.serializer_class] != null && id != null) {
    return hrefWithEntityId(SERIALIZER_TO_ENTITY_SEGMENT[log.serializer_class], id);
  }
  if (log.model_name && MODEL_TO_ENTITY_SEGMENT[log.model_name] != null && id != null) {
    return hrefWithEntityId(MODEL_TO_ENTITY_SEGMENT[log.model_name], id);
  }

  if (log.serializer_class && SERIALIZER_TO_HREF[log.serializer_class]) {
    return SERIALIZER_TO_HREF[log.serializer_class];
  }
  if (log.model_name && MODEL_TO_HREF[log.model_name]) {
    return MODEL_TO_HREF[log.model_name];
  }
  return null;
};
