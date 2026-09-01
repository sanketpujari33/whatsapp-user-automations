import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  isXs: false,
  isSm: false,
  isMd: false,
  isLg: false,
  isXl: false,
  is2xl: false,
  smAndDown: false,
  smAndUp: false,
  mdAndDown: false,
  mdAndUp: false,
  lgAndDown: false,
  lgAndUp: false,
  xlAndDown: false,
  xlAndUp: false,
};

export const breakpointSlice = createSlice({
  name: "breakpoint",
  initialState,
  reducers: {
    setBreakpoint: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setBreakpoint } = breakpointSlice.actions;

export default breakpointSlice.reducer;
