import { useState, useCallback } from "react";
import ruTranslations from "../locales/ru/translation.json";
import kgTranslations from "../locales/kg/translation.json";

// eslint-disable-next-line import/prefer-default-export
export const useTranslation = () => {
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return (savedLang) || "ru";
  });

  const translations = {
    ru: ruTranslations,
    kg: kgTranslations,
  };

  const translate = useCallback(
    (key) => {
      const keys = key.split(".");
      let translation = translations[currentLang];

      // eslint-disable-next-line no-restricted-syntax
      for (const k of keys) {
        if (translation[k] === undefined) {
          return key;
        }
        translation = translation[k];
      }

      return translation;
    },
    // eslint-disable-next-line comma-dangle
    [currentLang]
  );

  const changeLang = useCallback((lang) => {
    setCurrentLang(lang);
    localStorage.setItem("language", lang);
    window.location.reload();
  }, []);

  return { translate, changeLang, currentLang };
};
