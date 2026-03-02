import React from "react";
import {
  toast as rtToast,
  type ToastContent,
  type ToastOptions,
} from "react-toastify";

import { CustomToast } from "@/widgets/custom-toast";

const renderCustomToast = (props: any) =>
  React.createElement(CustomToast, props);

export function setupCustomToastUI({
  size = 40,
  barWidth = 22,
  trackWidth = 8,
}: {
  size?: number;
  barWidth?: number;
  trackWidth?: number;
} = {}): void {
  if ((rtToast as any).__patched_with_custom_ui) return;
  (rtToast as any).__patched_with_custom_ui = true;

  // Цвета
  const colors = {
    success: "var(--green)",
    error: "var(--red3)",
    info: "var(--blue4)",
    warning: "var(--orange)",
    default: "var(--gray5)",
  };

  // Заголовки
  const titles = {
    info: "Информация",
    warning: "Предупреждение!",
    error: "Ошибка!",
    success: "Успешно!",
    default: "",
  };

  const buildOpts = (
    message: ToastContent,
    opts: ToastOptions = {},
    type: "info" | "success" | "warning" | "error" | "default",
  ): ToastOptions => {
    const title = titles[type] || "Уведомление";
    const barColor = colors[type] || colors.info;

    const customData = {
      message: message,
      title: title,
      body: message,
      barColor: barColor,
      trackColor: "var(--border-primary)",
      size,
      barWidth,
      trackWidth,
      ...(opts.data || {}),
    };

    return {
      ...opts,
      data: customData,
    };
  };

  const original = rtToast;

  const patchedBase = (content: ToastContent, opts: ToastOptions = {}) => {
    if (typeof content === "string") {
      const type = opts.type || "info";
      return original(renderCustomToast, buildOpts(content, opts, type as any));
    }
    return original(content, opts);
  };

  patchedBase.success = (msg: ToastContent, opts: ToastOptions = {}) =>
    original(renderCustomToast, buildOpts(msg, opts, "success"));

  patchedBase.error = (msg: ToastContent, opts: ToastOptions = {}) =>
    original(renderCustomToast, buildOpts(msg, opts, "error"));

  patchedBase.info = (msg: ToastContent, opts: ToastOptions = {}) =>
    original(renderCustomToast, buildOpts(msg, opts, "info"));

  patchedBase.warn = (msg: ToastContent, opts: ToastOptions = {}) =>
    original(renderCustomToast, buildOpts(msg, opts, "warning"));

  // Копируем остальные методы из оригинального toast
  Object.assign(rtToast, {
    success: patchedBase.success,
    error: patchedBase.error,
    info: patchedBase.info,
    warn: patchedBase.warn,
    __patched_with_custom_ui: true,
  });
}
