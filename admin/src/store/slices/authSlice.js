import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isTokenValid, setSession } from 'utils/auth/jwt';
import { TOKEN_KEY } from "constants/app.constant";

import { getAdminProfileData, loginUser, logoutUser, getPermission, initializeAuth } from "../actions/authAction"

// Helper to flatten nested modules
function flattenModules(modules) {
  let result = [];
  for (const module of modules) {
    const { name, path, icon, access, actions, _id, id } = module;
    result.push({ name, path, icon, access, actions, _id, id });
    if (module.subModules && module.subModules.length > 0) {
      result = result.concat(flattenModules(module.subModules));
    }
    if (module.items && module.items.length > 0) {
      result = result.concat(flattenModules(module.items));
    }
  }
  return result;
}


const initialState = {
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
  errorMessage: null,
  user: null,
  sidebarModule: [],
  allowPages: [],
  adminData: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      setSession();
      state.isAuthenticated = false;
      state.user = null;
      state.allowPages = [];
      state.sidebarModule = [];
      state.adminData = null;
    },
    setSidebarModules(state, action) {
      state.sidebarModule = action.payload;
    },
    setAllowPages(state, action) {
      state.allowPages = action.payload;
    },
    clearError(state) {
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // initializeAuth
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isInitialized = true;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.isLoading = false;
      })
      // getAdminProfileData
      .addCase(getAdminProfileData.fulfilled, (state, action) => {
        state.adminData = action.payload.data;
      })
      // getPermission
      .addCase(getPermission.fulfilled, (state, action) => {
        state.sidebarModule = action.payload.data.modules;
        const flatModules = flattenModules(action.payload.data.modules);
        state.allowPages = flatModules;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const payload = action.payload || {};
        const authData = payload.data ?? payload.item ?? {};

        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = authData.admin ?? null;
        const permissionsNew = authData.admin?.permissions_new ?? authData.permissions_new;

        setSession(authData.token, authData.refreshToken);

        if (permissionsNew?.modules) {
          const flatModules = flattenModules(permissionsNew.modules);
          state.allowPages = flatModules;
          state.sidebarModule = permissionsNew.modules;
        } else {
          state.allowPages = [];
          state.sidebarModule = [];
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        state.allowPages = [];
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        setSession();
        state.isAuthenticated = false;
        state.user = null;
        state.allowPages = [];
        state.sidebarModule = [];
        state.adminData = null;
      });

  },
});

export const { logout, setSidebarModules, setAllowPages, clearError } =
  authSlice.actions;
export default authSlice.reducer;
