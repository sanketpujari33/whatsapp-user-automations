import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLocale, setDirection as setDirectionAction } from "store/slices/localeSlice";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import { useIsomorphicEffect } from "hooks";
import { defaultTheme } from "configs/theme.config";
import i18n from "i18n/config";
import { LocaleContext } from "./context";
import { locales } from "i18n/langs";

const initialLang = localStorage.getItem("i18nextLng") || defaultTheme.defaultLang;
const langConfig = locales[initialLang] || locales.en;

export function LocaleProvider({ children }) {
  const dispatch = useDispatch();
  const { locale, direction } = useSelector((state) => state.locale);

  /** Return 'rtl' or 'ltr' based on the lang config's rtl flag */
  const langDirection = useCallback((lang) => {
    return locales[lang]?.rtl ? "rtl" : "ltr";
  }, []);

  const updateLocale = useCallback(async (newLocale) => {
    try {
      const cfg = locales[newLocale] || locales.en;
      if (cfg.dayjs) { const m = await cfg.dayjs(); if (m) dayjs.locale(newLocale); }
      if (cfg.i18n) {
        const module = await cfg.i18n();
        const resources = module.default || module;
        i18n.addResourceBundle(newLocale, "translations", resources, true, true);
      }
      i18n.changeLanguage(newLocale);
      dispatch(setLocale(newLocale));
    } catch (error) {
      console.error("Failed to update locale:", error);
      i18n.changeLanguage(newLocale);
      dispatch(setLocale(newLocale));
    }
  }, [dispatch]);

  useIsomorphicEffect(() => {
    if (locale) updateLocale(locale);
  }, []);

  // Direction sync: use langs.js rtl field (not i18n.dir which is unreliable)
  useIsomorphicEffect(() => {
    const newDir = langDirection(locale);
    if (newDir !== direction) dispatch(setDirectionAction(newDir));
  }, [locale, direction, dispatch, langDirection]);

  useIsomorphicEffect(() => {
    document.documentElement.dir = direction;
    if (direction === "rtl") {
      document.documentElement.classList.add("rtl");
    } else {
      document.documentElement.classList.remove("rtl");
    }
  }, [direction]);

  const setDirectionCallback = useCallback((dir) => dispatch(setDirectionAction(dir)), [dispatch]);

  const contextValue = useMemo(() => ({
    locale,
    updateLocale,
    direction,
    setDirection: setDirectionCallback,
    isRtl: direction === "rtl",
  }), [locale, updateLocale, direction, setDirectionCallback]);

  return (
    <LocaleContext value={contextValue}>
      {children}
    </LocaleContext>
  );
}

LocaleProvider.propTypes = { children: PropTypes.node.isRequired };
