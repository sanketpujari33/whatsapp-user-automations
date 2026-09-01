import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./context";
import { setSidebarModules } from "store/slices/authSlice";
import {
  loginUser,
  logoutUser,
  initializeAuth,
  getAdminProfileData,
} from "store/actions/authAction";
import { useEffect, useMemo, useCallback } from "react";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, authState.isInitialized]);

  useEffect(() => {
    if (authState.isAuthenticated && !authState.adminData) {
      dispatch(getAdminProfileData());
    }
  }, [dispatch, authState.isAuthenticated, authState.adminData]);

  const login = useCallback(async ({ email, password, otp }) => {
    await dispatch(loginUser({ email, password, otp }));
  }, [dispatch]);

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const setSideBarModules = useCallback(async (modules) => {
    dispatch(setSidebarModules(modules));
  }, [dispatch]);

  const getAdminProfileDataCallback = useCallback(() => dispatch(getAdminProfileData()), [dispatch]);

  const contextValue = useMemo(() => ({
    ...authState,
    login,
    logout,
    setSideBarModules,
    getAdminProfileData: getAdminProfileDataCallback,
  }), [authState, login, logout, setSideBarModules, getAdminProfileDataCallback]);

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
