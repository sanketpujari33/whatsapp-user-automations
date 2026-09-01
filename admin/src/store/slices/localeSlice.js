import { createSlice } from "@reduxjs/toolkit";
import { defaultTheme } from "configs/theme.config";

const initialState = {
  locale: localStorage.getItem("i18nextLng") || defaultTheme.defaultLang,
  direction: "ltr",
};

export const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
    },
  },
});

export const { setLocale, setDirection } = localeSlice.actions;

export default localeSlice.reducer;
