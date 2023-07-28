import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next  } from "react-i18next";

import translationDE from './locales/de/translation.json';
import translationIT from './locales/it/translation.json';
import translationES from './locales/es/translation.json';
import translationRU from './locales/ru/translation.json';
import translationEN from './locales/en/translation.json';

//translations
const resources = {
    de: {
        translation: translationDE
    },
    it: {
        translation: translationIT
    },
    es: {
        translation: translationES
    },
    ru: {
        translation: translationRU
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(detector)
    .use(initReactI18next ) // passes i18n down to react-i18next
    .init({
        resources,
        lng: localStorage.getItem("language") || "en",
        fallbackLng: "en", // use en if detected lng is not available

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
        escapeValue: false // react already safes from xss
        }
    });

export default i18n;