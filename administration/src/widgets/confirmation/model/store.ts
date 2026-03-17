import type { ReactNode } from "react";
import { create } from "zustand";

export type ConfirmationModalType =
  | "success"
  | "warn"
  | "error"
  | "deletion_confirm"
  | "save_confirm";

type ButtonVariant = "default" | "gray" | "red";

type ConfirmationOptions = {
  type: ConfirmationModalType;
  title?: string;
  subTitle?: string;
  children?: ReactNode;
  confirmBtnTitle?: string;
  closeBtnTitle?: string;
  confirmBtnVariant?: ButtonVariant;
  closeBtnVariant?: ButtonVariant;
  hideConfirmBtn?: boolean;
  hideCloseBtn?: boolean;
  closeOnConfirm?: boolean;
  onConfirm?: (() => void | Promise<void>) | null;
  onClose?: (() => void) | null;
};

interface ConfirmationState extends Required<Omit<ConfirmationOptions, "children">> {
  isOpen: boolean;
  children: ReactNode | null;
  open: (options: ConfirmationOptions) => void;
  close: () => void;
}

const DEFAULTS_BY_TYPE: Record<ConfirmationModalType, Omit<Required<ConfirmationOptions>, "children" | "onConfirm" | "onClose">> = {
  success: {
    type: "success",
    title: "Операция выполнена",
    subTitle: "Данные успешно обновлены.",
    confirmBtnTitle: "Понятно",
    closeBtnTitle: "Закрыть",
    confirmBtnVariant: "default",
    closeBtnVariant: "gray",
    hideConfirmBtn: false,
    hideCloseBtn: true,
    closeOnConfirm: true,
  },
  warn: {
    type: "warn",
    title: "Требуется подтверждение",
    subTitle: "Проверьте действие перед продолжением.",
    confirmBtnTitle: "Продолжить",
    closeBtnTitle: "Отмена",
    confirmBtnVariant: "default",
    closeBtnVariant: "gray",
    hideConfirmBtn: false,
    hideCloseBtn: false,
    closeOnConfirm: true,
  },
  error: {
    type: "error",
    title: "Произошла ошибка",
    subTitle: "Не удалось завершить действие.",
    confirmBtnTitle: "Понятно",
    closeBtnTitle: "Закрыть",
    confirmBtnVariant: "red",
    closeBtnVariant: "gray",
    hideConfirmBtn: false,
    hideCloseBtn: true,
    closeOnConfirm: true,
  },
  deletion_confirm: {
    type: "deletion_confirm",
    title: "Подтвердите удаление",
    subTitle: "Это действие нельзя будет отменить.",
    confirmBtnTitle: "Удалить",
    closeBtnTitle: "Отмена",
    confirmBtnVariant: "red",
    closeBtnVariant: "gray",
    hideConfirmBtn: false,
    hideCloseBtn: false,
    closeOnConfirm: true,
  },
  save_confirm: {
    type: "save_confirm",
    title: "Сохранить изменения?",
    subTitle: "Проверьте данные перед сохранением.",
    confirmBtnTitle: "Сохранить",
    closeBtnTitle: "Отмена",
    confirmBtnVariant: "default",
    closeBtnVariant: "gray",
    hideConfirmBtn: false,
    hideCloseBtn: false,
    closeOnConfirm: true,
  },
};

const getInitialState = (): Omit<ConfirmationState, "open" | "close"> => ({
  isOpen: false,
  ...DEFAULTS_BY_TYPE.warn,
  children: null,
  onConfirm: null,
  onClose: null,
});

export const useConfirmationStore = create<ConfirmationState>((set) => ({
  ...getInitialState(),

  open: (options) => {
    const defaults = DEFAULTS_BY_TYPE[options.type];

    set({
      isOpen: true,
      type: options.type,
      title: options.title ?? defaults.title,
      subTitle: options.subTitle ?? defaults.subTitle,
      children: options.children ?? null,
      confirmBtnTitle: options.confirmBtnTitle ?? defaults.confirmBtnTitle,
      closeBtnTitle: options.closeBtnTitle ?? defaults.closeBtnTitle,
      confirmBtnVariant: options.confirmBtnVariant ?? defaults.confirmBtnVariant,
      closeBtnVariant: options.closeBtnVariant ?? defaults.closeBtnVariant,
      hideConfirmBtn: options.hideConfirmBtn ?? defaults.hideConfirmBtn,
      hideCloseBtn: options.hideCloseBtn ?? defaults.hideCloseBtn,
      closeOnConfirm: options.closeOnConfirm ?? defaults.closeOnConfirm,
      onConfirm: options.onConfirm ?? null,
      onClose: options.onClose ?? null,
    });
  },

  close: () => set(getInitialState()),
}));