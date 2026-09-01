import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExpanded: true,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarExpanded: (state, action) => {
      state.isExpanded = action.payload;
    },
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },
    openSidebar: (state) => {
      state.isExpanded = true;
    },
    closeSidebar: (state) => {
      state.isExpanded = false;
    },
  },
});

export const { setSidebarExpanded, toggleSidebar, openSidebar, closeSidebar } = sidebarSlice.actions;

export default sidebarSlice.reducer;
