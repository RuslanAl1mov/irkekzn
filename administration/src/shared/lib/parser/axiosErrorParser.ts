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
