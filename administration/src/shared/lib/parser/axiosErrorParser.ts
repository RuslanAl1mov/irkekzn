import axios, { type AxiosError } from "axios";

type FieldErrors = Record<string, string[]>;

export type ParsedValidation = { fieldErrors: FieldErrors; general: string[] };

function normalizeToArray(x: unknown): string[] {
  if (Array.isArray(x)) return x.map(String);
  if (typeof x === "string") return [x];
  return [];
}

export function parseAxiosValidationError(err: unknown): {
  fieldErrors: FieldErrors;
  general: string[];
} {
  const result: { fieldErrors: FieldErrors; general: string[] } = {
    fieldErrors: {},
    general: [],
  };
  const errAxios = err as AxiosError<unknown>;

  if (!axios.isAxiosError(err)) {
    result.general.push("Unknown error");
    return result;
  }

  const data = errAxios.response?.data;

  // 1) Строка целиком
  if (typeof data === "string") {
    result.general.push(data);
    return result;
  }

  // 1.1) Массив строк целиком: ["message"]
  if (Array.isArray(data)) {
    result.general.push(...normalizeToArray(data));
    return result;
  }

  // 2) Объект с detail
  if (data && typeof data === "object" && "detail" in data) {
    const detailVal = data.detail;
    result.general.push(...normalizeToArray(detailVal));
  }

  // 3) Поля-ошибки вида { field: ["msg1", "msg2"], ... }
  if (data && typeof data === "object") {
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      if (key === "detail") continue;
      if (key === "non_field_errors") {
        result.general.push(...normalizeToArray(val));
        continue;
      }
      const msgs = normalizeToArray(val);
      if (msgs.length) {
        result.fieldErrors[key] = (result.fieldErrors[key] ?? []).concat(msgs);
      }
    }
  }

  // На всякий случай, если совсем пусто — добавим сообщение из err.message
  if (
    result.general.length === 0 &&
    Object.keys(result.fieldErrors).length === 0
  ) {
    result.general.push(err.message || "Bad Request");
  }

  console.error(err);

  return result;
}

function isParsedValidation(val: unknown): val is ParsedValidation {
  return (
    val != null &&
    typeof val === "object" &&
    "general" in val &&
    "fieldErrors" in val
  );
}

export function getParsedValidation(err: unknown): ParsedValidation {
  if (
    axios.isAxiosError(err) &&
    "parsedValidation" in err &&
    isParsedValidation(err.parsedValidation)
  ) {
    return err.parsedValidation;
  }
  return parseAxiosValidationError(err);
}

/**
 * Адаптер для преобразования всех типов ошибок в одну понятную строку
 * @param err - ошибка от axios или любой другой
 * @returns строка с понятным описанием ошибки
 */
export function getReadableErrorMessage(err: unknown): string {
  const validation = getParsedValidation(err);
  const messages: string[] = [];

  // Добавляем общие ошибки
  if (validation.general.length > 0) {
    messages.push(...validation.general);
  }

  // Добавляем ошибки полей в читаемом формате
  if (Object.keys(validation.fieldErrors).length > 0) {
    const fieldMessages = Object.entries(validation.fieldErrors)
      .map(([field, errors]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1); // Делаем первую букву заглавной
        const errorText = errors.join('. ');
        return `${fieldName}: ${errorText}`;
      });
    messages.push(...fieldMessages);
  }

  // Если сообщений нет, возвращаем дефолтное
  if (messages.length === 0) {
    return "Произошла неизвестная ошибка";
  }

  // Объединяем все в одну строку
  return messages.join('. ');
}

/**
 * Адаптер для получения HTML-форматированной ошибки (для тостов с поддержкой HTML)
 */
export function getHtmlErrorMessage(err: unknown): string {
  const validation = getParsedValidation(err);
  const parts: string[] = [];

  // Общие ошибки
  if (validation.general.length > 0) {
    parts.push(`<div>${validation.general.join('<br/>')}</div>`);
  }

  // Ошибки полей
  if (Object.keys(validation.fieldErrors).length > 0) {
    const fieldErrorsList = Object.entries(validation.fieldErrors)
      .map(([field, errors]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        return `<div><strong>${fieldName}:</strong> ${errors.join('. ')}</div>`;
      })
      .join('');
    
    parts.push(`<div>${fieldErrorsList}</div>`);
  }

  return parts.length > 0 ? parts.join('<hr/>') : 'Произошла неизвестная ошибка';
}

/**
 * Адаптер для получения краткой версии ошибки (первое сообщение)
 */
export function getBriefErrorMessage(err: unknown): string {
  const validation = getParsedValidation(err);
  
  // Сначала проверяем общие ошибки
  if (validation.general.length > 0) {
    return validation.general[0];
  }
  
  // Затем ошибки полей
  const firstFieldError = Object.values(validation.fieldErrors)[0]?.[0];
  if (firstFieldError) {
    return firstFieldError;
  }
  
  return "Произошла неизвестная ошибка";
}