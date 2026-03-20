import type { JSX } from "react";

import { Input, type InputProps } from "@/shared/ui/input";

const PHONE_PLACEHOLDER = "+7 (___) ___-__-__";

const normalizePhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits[0] === "8") {
    return `7${digits.slice(1, 11)}`;
  }

  if (digits[0] === "7") {
    return digits.slice(0, 11);
  }

  return `7${digits.slice(0, 10)}`;
};

const formatPhoneInputValue = (value: string): string => {
  const normalized = normalizePhoneDigits(value);

  if (!normalized) {
    return "";
  }

  const nationalDigits = normalized.slice(1);
  const code = nationalDigits.slice(0, 3);
  const first = nationalDigits.slice(3, 6);
  const second = nationalDigits.slice(6, 8);
  const third = nationalDigits.slice(8, 10);

  let result = "+7";

  if (code) {
    result += ` (${code}`;
  }

  if (nationalDigits.length >= 3) {
    result += ")";
  }

  if (first) {
    result += ` ${first}`;
  }

  if (second) {
    result += `-${second}`;
  }

  if (third) {
    result += `-${third}`;
  }

  return result;
};

type Props = Omit<InputProps, "type">;

export const PhoneInput = ({
  value,
  setValue,
  defaultValue,
  placeholder = PHONE_PLACEHOLDER,
  inputMode = "tel",
  ...restProps
}: Props): JSX.Element => {
  const formattedValue =
    value !== undefined ? formatPhoneInputValue(value) : undefined;
  const formattedDefaultValue =
    defaultValue !== undefined ? formatPhoneInputValue(defaultValue) : undefined;

  const handleChange = (next: string): void => {
    setValue?.(formatPhoneInputValue(next));
  };

  return (
    <Input
      {...restProps}
      type="tel"
      inputMode={inputMode}
      autoComplete="tel-national"
      placeholder={placeholder}
      value={formattedValue}
      setValue={handleChange}
      defaultValue={formattedDefaultValue}
    />
  );
};
