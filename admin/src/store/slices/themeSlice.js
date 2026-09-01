import { createSlice } from "@reduxjs/toolkit";
import { defaultTheme } from "configs/theme.config";

const initialState = {
  ...defaultTheme,
  isMonochrome: false,
  darkColorScheme: "default",
  lightColorScheme: "default",
  primaryColorScheme: "default",
  notification: {
    position: "top-right",
    isExpanded: false,
    visibleToasts: 5
  },
  headingFont: "Inter",
  bodyFont: "Inter",
  monoFont: "Fira Code",
  baseFontSize: 16,
  headingWeight: 700,
  letterSpacing: 0,
  lineHeightMode: "normal",
  adaptiveScaling: false,
  subpixelSmoothing: true,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.themeMode = action.payload;
    },
    setThemeLayout: (state, action) => {
      state.themeLayout = action.payload;
    },
    setMonochromeMode: (state, action) => {
      state.isMonochrome = action.payload;
    },
    setDarkColorScheme: (state, action) => {
      state.darkColorScheme = action.payload;
    },
    setLightColorScheme: (state, action) => {
      state.lightColorScheme = action.payload;
    },
    setPrimaryColorScheme: (state, action) => {
      state.primaryColorScheme = action.payload;
    },
    setCardSkin: (state, action) => {
      state.cardSkin = action.payload;
    },
    setNotificationPosition: (state, action) => {
      if (!state.notification) state.notification = {};
      state.notification.position = action.payload;
    },
    setNotificationExpand: (state, action) => {
      if (!state.notification) state.notification = {};
      state.notification.isExpanded = action.payload;
    },
    setNotificationMaxCount: (state, action) => {
      if (!state.notification) state.notification = {};
      state.notification.visibleToasts = action.payload;
    },
    setHeadingFont: (state, action) => {
      state.headingFont = action.payload;
    },
    setBodyFont: (state, action) => {
      state.bodyFont = action.payload;
    },
    setMonoFont: (state, action) => {
      state.monoFont = action.payload;
    },
    setBaseFontSize: (state, action) => {
      state.baseFontSize = action.payload;
    },
    setHeadingWeight: (state, action) => {
      state.headingWeight = action.payload;
    },
    setLetterSpacing: (state, action) => {
      state.letterSpacing = action.payload;
    },
    setLineHeightMode: (state, action) => {
      state.lineHeightMode = action.payload;
    },
    setAdaptiveScaling: (state, action) => {
      state.adaptiveScaling = action.payload;
    },
    setSubpixelSmoothing: (state, action) => {
      state.subpixelSmoothing = action.payload;
    },
    resetTheme: () => initialState,
  },
});

export const {
  setThemeMode,
  setThemeLayout,
  setMonochromeMode,
  setDarkColorScheme,
  setLightColorScheme,
  setPrimaryColorScheme,
  setCardSkin,
  setNotificationPosition,
  setNotificationExpand,
  setNotificationMaxCount,
  setHeadingFont,
  setBodyFont,
  setMonoFont,
  setBaseFontSize,
  setHeadingWeight,
  setLetterSpacing,
  setLineHeightMode,
  setAdaptiveScaling,
  setSubpixelSmoothing,
  resetTheme
} = themeSlice.actions;

export default themeSlice.reducer;
