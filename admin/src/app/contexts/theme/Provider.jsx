import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useRef } from "react";

// Local Imports
import { defaultTheme } from "configs/theme.config";
import { colors } from "constants/colors.constant";
import { useIsomorphicEffect, useLocalStorage, useMediaQuery } from "hooks";
import { ThemeContext } from "./context";
import {
  setThemeMode as setThemeModeAction,
  setThemeLayout as setThemeLayoutAction,
  setMonochromeMode as setMonochromeModeAction,
  setDarkColorScheme as setDarkColorSchemeAction,
  setLightColorScheme as setLightColorSchemeAction,
  setPrimaryColorScheme as setPrimaryColorSchemeAction,
  setCardSkin as setCardSkinAction,
  setNotificationPosition as setNotificationPositionAction,
  setNotificationExpand as setNotificationExpandAction,
  setNotificationMaxCount as setNotificationMaxCountAction,
  setHeadingFont as setHeadingFontAction,
  setBodyFont as setBodyFontAction,
  setMonoFont as setMonoFontAction,
  setBaseFontSize as setBaseFontSizeAction,
  setHeadingWeight as setHeadingWeightAction,
  setLetterSpacing as setLetterSpacingAction,
  setLineHeightMode as setLineHeightModeAction,
  setAdaptiveScaling as setAdaptiveScalingAction,
  setSubpixelSmoothing as setSubpixelSmoothingAction,
} from "store/slices/themeSlice";
import { getAdminTheme, upsertAdminTheme } from "store/actions/themeAction";

// ----------------------------------------------------------------------

const initialState = {
  ...defaultTheme,
  isDark: false,
  setThemeMode: () => {},
  setThemeLayout: () => {},
  toggleMonochromeMode: () => {},
  setLightColorScheme: () => {},
  setDarkColorScheme: () => {},
  setPrimaryColorScheme: () => {},
  setNotificationPosition: () => {},
  setNotificationExpand: () => {},
  resetTheme: () => {},
};

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

const _html = document?.documentElement;

const THEME_PERSIST_KEYS = [
  "themeMode",
  "themeLayout",
  "cardSkin",
  "isMonochrome",
  "darkColorScheme",
  "lightColorScheme",
  "primaryColorScheme",
  "notification",
  "headingFont",
  "bodyFont",
  "monoFont",
  "baseFontSize",
  "headingWeight",
  "letterSpacing",
  "lineHeightMode",
  "adaptiveScaling",
  "subpixelSmoothing",
  "defaultLang",
  "fallbackLang",
  "sidebarWidth",
  "headerHeight",
  "borderRadius",
  "animations",
];

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const pickPersistedThemeSettings = (source = {}) => {
  const result = {};

  for (const key of THEME_PERSIST_KEYS) {
    if (source[key] !== undefined) result[key] = source[key];
  }

  if (!isPlainObject(result.notification)) delete result.notification;
  if (!isPlainObject(result.darkColorScheme)) delete result.darkColorScheme;
  if (!isPlainObject(result.lightColorScheme)) delete result.lightColorScheme;
  if (!isPlainObject(result.primaryColorScheme)) delete result.primaryColorScheme;
  if (!isPlainObject(result.animations)) delete result.animations;

  return result;
};

const mergePersistedThemeSettings = (base = {}, incoming = {}) => ({
  ...base,
  ...incoming,
  notification: {
    ...(base.notification || {}),
    ...(incoming.notification || {}),
  },
  darkColorScheme: {
    ...(base.darkColorScheme || {}),
    ...(incoming.darkColorScheme || {}),
  },
  lightColorScheme: {
    ...(base.lightColorScheme || {}),
    ...(incoming.lightColorScheme || {}),
  },
  primaryColorScheme: {
    ...(base.primaryColorScheme || {}),
    ...(incoming.primaryColorScheme || {}),
  },
  animations: {
    ...(base.animations || {}),
    ...(incoming.animations || {}),
  },
});

export function ThemeProvider({ children }) {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [settings, setSettings] = useLocalStorage("settings", {
    themeMode: initialState.themeMode,
    themeLayout: initialState.themeLayout,
    cardSkin: initialState.cardSkin,
    isMonochrome: initialState.isMonochrome,
    darkColorScheme: initialState.darkColorScheme,
    lightColorScheme: initialState.lightColorScheme,
    primaryColorScheme: initialState.primaryColorScheme,
    notification: { ...initialState.notification },
    headingFont: initialState.headingFont,
    bodyFont: initialState.bodyFont,
    monoFont: initialState.monoFont,
    baseFontSize: initialState.baseFontSize,
    headingWeight: initialState.headingWeight,
    letterSpacing: initialState.letterSpacing,
    lineHeightMode: initialState.lineHeightMode,
    adaptiveScaling: initialState.adaptiveScaling,
    subpixelSmoothing: initialState.subpixelSmoothing,
  });

  const settingsRef = useRef(settings);
  const activeAdminRef = useRef(null);
  const hasLoadedRemoteThemeRef = useRef(false);
  const isApplyingRemoteThemeRef = useRef(false);
  const lastSyncedThemeRef = useRef("");

  const adminId =
    auth?.adminData?._id ||
    auth?.adminData?.id ||
    auth?.user?._id ||
    auth?.user?.id ||
    null;

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!auth?.isAuthenticated || !adminId) {
      activeAdminRef.current = null;
      hasLoadedRemoteThemeRef.current = false;
      isApplyingRemoteThemeRef.current = false;
      lastSyncedThemeRef.current = "";
      return;
    }

    if (activeAdminRef.current === adminId && hasLoadedRemoteThemeRef.current) {
      return;
    }

    activeAdminRef.current = adminId;
    hasLoadedRemoteThemeRef.current = false;

    let cancelled = false;

    const loadThemeFromServer = async () => {
      isApplyingRemoteThemeRef.current = true;

      try {
        const response = await dispatch(getAdminTheme()).unwrap();
        const remoteSettings = response?.data?.settings;
        const hasRemoteSettings =
          isPlainObject(remoteSettings) && Object.keys(remoteSettings).length > 0;

        const resolvedSettings = hasRemoteSettings
          ? mergePersistedThemeSettings(
            settingsRef.current,
            pickPersistedThemeSettings(remoteSettings),
          )
          : pickPersistedThemeSettings(initialState);

        if (!cancelled) {
          setSettings((prev) => mergePersistedThemeSettings(prev, resolvedSettings));
          lastSyncedThemeRef.current = JSON.stringify(
            pickPersistedThemeSettings(resolvedSettings),
          );
        }
      } catch (_error) {
        if (!cancelled) {
          lastSyncedThemeRef.current = JSON.stringify(
            pickPersistedThemeSettings(settingsRef.current),
          );
        }
      } finally {
        if (!cancelled) {
          hasLoadedRemoteThemeRef.current = true;
          isApplyingRemoteThemeRef.current = false;
        }
      }
    };

    loadThemeFromServer();

    return () => {
      cancelled = true;
    };
  }, [auth?.isAuthenticated, adminId, dispatch, setSettings]);

  useEffect(() => {
    if (!auth?.isAuthenticated || !adminId) return;
    if (!hasLoadedRemoteThemeRef.current) return;
    if (isApplyingRemoteThemeRef.current) return;

    const payload = pickPersistedThemeSettings(settings);
    const serialized = JSON.stringify(payload);

    if (serialized === lastSyncedThemeRef.current) return;

    const timer = setTimeout(async () => {
      try {
        await dispatch(upsertAdminTheme({ settings: payload })).unwrap();
        lastSyncedThemeRef.current = serialized;
      } catch (_error) {
        // Keep local theme even if network save fails.
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [settings, auth?.isAuthenticated, adminId, dispatch]);

  const isDark =
    (settings.themeMode === "system" && isDarkOS) ||
    settings.themeMode === "dark";

  const setThemeMode = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      themeMode: val,
    }));
    dispatch(setThemeModeAction(val));
  }, [dispatch, setSettings]);

  const setThemeLayout = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      themeLayout: val,
    }));
    dispatch(setThemeLayoutAction(val));
  }, [dispatch, setSettings]);

  const setMonochromeMode = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      isMonochrome: val,
    }));
    dispatch(setMonochromeModeAction(val));
  }, [dispatch, setSettings]);

  const setDarkColorScheme = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      darkColorScheme: {
        name: val,
        ...colors[val],
      },
    }));
    dispatch(setDarkColorSchemeAction(val));
  }, [dispatch, setSettings]);

  const setLightColorScheme = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      lightColorScheme: {
        name: val,
        ...colors[val],
      },
    }));
    dispatch(setLightColorSchemeAction(val));
  }, [dispatch, setSettings]);

  const setPrimaryColorScheme = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      primaryColorScheme: {
        name: val,
        ...colors[val],
      },
    }));
    dispatch(setPrimaryColorSchemeAction(val));
  }, [dispatch, setSettings]);

  const setNotificationPosition = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      notification: {
        ...prev.notification,
        position: val,
      },
    }));
    dispatch(setNotificationPositionAction(val));
  }, [dispatch, setSettings]);

  const setNotificationExpand = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      notification: {
        ...prev.notification,
        isExpanded: val,
      },
    }));
    dispatch(setNotificationExpandAction(val));
  }, [dispatch, setSettings]);

  const setNotificationMaxCount = useCallback((val) => {
    setSettings((prev) => ({
      ...prev,
      notification: {
        ...prev.notification,
        visibleToasts: val,
      },
    }));
    dispatch(setNotificationMaxCountAction(val));
  }, [dispatch, setSettings]);

  const setCardSkin = useCallback((val) => {
    setSettings((prev) => ({ ...prev, cardSkin: val }));
    dispatch(setCardSkinAction(val));
  }, [dispatch, setSettings]);

  const setHeadingFont = useCallback((val) => {
    setSettings((prev) => ({ ...prev, headingFont: val }));
    dispatch(setHeadingFontAction(val));
  }, [dispatch, setSettings]);

  const setBodyFont = useCallback((val) => {
    setSettings((prev) => ({ ...prev, bodyFont: val }));
    dispatch(setBodyFontAction(val));
  }, [dispatch, setSettings]);

  const setMonoFont = useCallback((val) => {
    setSettings((prev) => ({ ...prev, monoFont: val }));
    dispatch(setMonoFontAction(val));
  }, [dispatch, setSettings]);

  const setBaseFontSize = useCallback((val) => {
    setSettings((prev) => ({ ...prev, baseFontSize: val }));
    dispatch(setBaseFontSizeAction(val));
  }, [dispatch, setSettings]);

  const setHeadingWeight = useCallback((val) => {
    setSettings((prev) => ({ ...prev, headingWeight: val }));
    dispatch(setHeadingWeightAction(val));
  }, [dispatch, setSettings]);

  const setLetterSpacing = useCallback((val) => {
    setSettings((prev) => ({ ...prev, letterSpacing: val }));
    dispatch(setLetterSpacingAction(val));
  }, [dispatch, setSettings]);

  const setLineHeightMode = useCallback((val) => {
    setSettings((prev) => ({ ...prev, lineHeightMode: val }));
    dispatch(setLineHeightModeAction(val));
  }, [dispatch, setSettings]);

  const setAdaptiveScaling = useCallback((val) => {
    setSettings((prev) => ({ ...prev, adaptiveScaling: val }));
    dispatch(setAdaptiveScalingAction(val));
  }, [dispatch, setSettings]);

  const setSubpixelSmoothing = useCallback((val) => {
    setSettings((prev) => ({ ...prev, subpixelSmoothing: val }));
    dispatch(setSubpixelSmoothingAction(val));
  }, [dispatch, setSettings]);

  const resetTheme = useCallback(() => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      isMonochrome: initialState.isMonochrome,
      darkColorScheme: initialState.darkColorScheme,
      lightColorScheme: initialState.lightColorScheme,
      primaryColorScheme: initialState.primaryColorScheme,
      cardSkin: initialState.cardSkin,
      notification: { ...initialState.notification },
      headingFont: initialState.headingFont,
      bodyFont: initialState.bodyFont,
      monoFont: initialState.monoFont,
      baseFontSize: initialState.baseFontSize,
      headingWeight: initialState.headingWeight,
      letterSpacing: initialState.letterSpacing,
      lineHeightMode: initialState.lineHeightMode,
      adaptiveScaling: initialState.adaptiveScaling,
      subpixelSmoothing: initialState.subpixelSmoothing,
    });
  }, [setSettings]);

  useIsomorphicEffect(() => {
    isDark ? _html.classList.add("dark") : _html.classList.remove("dark");
  }, [isDark]);

  useIsomorphicEffect(() => {
    settings.isMonochrome
      ? document.body.classList.add("is-monochrome")
      : document.body.classList.remove("is-monochrome");
  }, [settings.isMonochrome]);

  useIsomorphicEffect(() => {
    _html.dataset.themeLight = settings.lightColorScheme.name;
  }, [settings.lightColorScheme]);

  useIsomorphicEffect(() => {
    _html.dataset.themeDark = settings.darkColorScheme.name;
  }, [settings.darkColorScheme]);

  useIsomorphicEffect(() => {
    _html.dataset.themePrimary = settings.primaryColorScheme.name;
  }, [settings.primaryColorScheme]);

  useIsomorphicEffect(() => {
    _html.dataset.cardSkin = settings.cardSkin;
  }, [settings.cardSkin]);

  useIsomorphicEffect(() => {
    if (document) document.body.dataset.layout = settings.themeLayout;
  }, [settings.themeLayout]);

  useIsomorphicEffect(() => {
    _html.style.setProperty("--font-heading", settings.headingFont);
    _html.style.setProperty("--font-body", settings.bodyFont);
    _html.style.setProperty("--font-mono", settings.monoFont);
  }, [settings.headingFont, settings.bodyFont, settings.monoFont]);

  useIsomorphicEffect(() => {
    _html.style.setProperty("--font-size-base", `${settings.baseFontSize}px`);
    _html.style.setProperty("--heading-weight", settings.headingWeight);
    _html.style.setProperty("--letter-spacing", `${settings.letterSpacing}em`);
  }, [settings.baseFontSize, settings.headingWeight, settings.letterSpacing]);

  useIsomorphicEffect(() => {
    if (settings.subpixelSmoothing) {
      _html.classList.add("antialiased");
    } else {
      _html.classList.remove("antialiased");
    }
  }, [settings.subpixelSmoothing]);

  // Sync animation speed — map "fast"/"normal"/"slow" → CSS var
  useIsomorphicEffect(() => {
    const speed = settings.animations?.speed || "normal";
    const speedMap = { fast: "150ms", normal: "300ms", slow: "600ms" };
    _html.style.setProperty("--animation-speed", speedMap[speed] || "300ms");
  }, [settings.animations?.speed]);

  const contextValue = useMemo(() => ({
    ...settings,
    isDark,
    setMonochromeMode,
    setThemeMode,
    setThemeLayout,
    setLightColorScheme,
    setDarkColorScheme,
    setPrimaryColorScheme,
    setNotificationPosition,
    setNotificationExpand,
    setNotificationMaxCount,
    setCardSkin,
    setHeadingFont,
    setBodyFont,
    setMonoFont,
    setBaseFontSize,
    setHeadingWeight,
    setLetterSpacing,
    setLineHeightMode,
    setAdaptiveScaling,
    setSubpixelSmoothing,
    setSettings,
    resetTheme,
  }), [
    settings,
    isDark,
    setMonochromeMode,
    setThemeMode,
    setThemeLayout,
    setLightColorScheme,
    setDarkColorScheme,
    setPrimaryColorScheme,
    setNotificationPosition,
    setNotificationExpand,
    setNotificationMaxCount,
    setCardSkin,
    setHeadingFont,
    setBodyFont,
    setMonoFont,
    setBaseFontSize,
    setHeadingWeight,
    setLetterSpacing,
    setLineHeightMode,
    setAdaptiveScaling,
    setSubpixelSmoothing,
    setSettings,
    resetTheme,
  ]);

  if (!children) {
    return null;
  }

  // console.log({isDark,initialState})

  return (
    <ThemeContext value={contextValue}>
      {children}
    </ThemeContext>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
