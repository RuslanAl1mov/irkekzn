import { useTranslation } from "react-i18next";

/**
 * Хук для использования переводов
 * @example
 * const { t } = useI18n();
 * <button>{t('common.save')}</button>
 */
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    language: i18n.language,
    changeLanguage: (lang: string) => {
      void i18n.changeLanguage(lang);
      localStorage.setItem("i18nextLng", lang);
    },
  };
};
