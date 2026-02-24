import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "@/locales/en/common.json";
// Импорт переводов
import commonRu from "@/locales/ru/common.json";

const resources = {
  ru: {
    common: commonRu,
  },
  en: {
    common: commonEn,
  },
};

// Определение языка из localStorage или браузера
const getInitialLanguage = (): string => {
  const savedLanguage = localStorage.getItem("i18nextLng");
  if (savedLanguage && (savedLanguage === "ru" || savedLanguage === "en")) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language.split("-")[0];
  return browserLanguage === "en" ? "en" : "ru";
};

void i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: "ru",
  defaultNS: "common",
  ns: ["common"],
  interpolation: {
    escapeValue: false, // React уже экранирует значения
  },
});

export default i18n;
