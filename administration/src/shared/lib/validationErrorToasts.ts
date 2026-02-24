import { toast } from "react-toastify";

import { getParsedValidation } from "./parser/axiosErrorParser";

export function showValidationErrorToasts(
  err: unknown,
  options?: { toastIdPrefix?: string }
): void {
  const { fieldErrors, general } = getParsedValidation(err);
  const prefix = options?.toastIdPrefix ?? "validation-error";

  if (general.length) {
    toast.error(general.join("\n"), {
      toastId: `${prefix}-general`,
    });
  }

  Object.entries(fieldErrors).forEach(([field, messages]) => {
    toast.error(`${messages.join("; ")}`, {
      toastId: `${prefix}-${field}`,
    });
  });
}
