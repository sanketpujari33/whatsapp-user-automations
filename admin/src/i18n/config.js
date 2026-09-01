// Import Dependencies
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Local Imports
import { defaultTheme } from "configs/theme.config";
import { locales } from "./langs";
import enTranslations from "./locales/en/translations.json";

const supportedLanguages = Object.keys(locales);

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: 'i18nextLng',
      lookupSessionStorage: 'i18nextLng',
    },
    fallbackLng: defaultTheme.fallbackLang,
    lng: localStorage.getItem("i18nextLng") || defaultTheme.defaultLang,
    supportedLngs: supportedLanguages,
    resources: {
      en: {
        translations: enTranslations,
      },
    },
    ns: ["translations"],
    defaultNS: "translations",
    interpolation: {
      escapeValue: false,
    },
    lowerCaseLng: true,
    debug: false,
  }).languages = supportedLanguages;

export default i18n
