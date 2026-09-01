import { createAsyncThunk } from "@reduxjs/toolkit";
import { POST, GET } from "../../utils/network/http";
import { handleError, handleResponse } from "../../utils/network/response";
import { GET_ADMIN_DATA, LOGIN, PERMISSSION, LOGOUT, ADMIN_LOGOUT } from "constants/apiendpoints";
import { isTokenValid, setSession, clearAllStorage } from 'utils/auth/jwt';
import { TOKEN_KEY } from "constants/app.constant";

export const initializeAuth = createAsyncThunk(
    "auth/initialize",
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const authToken = localStorage.getItem(TOKEN_KEY);
            if (authToken && isTokenValid(authToken)) {
                setSession(authToken);
                // Fetch required data to rebuild the session
                await Promise.all([
                    dispatch(getPermission()).unwrap(),
                    dispatch(getAdminProfileData()).unwrap()
                ]);
                return { isAuthenticated: true };
            }
            return { isAuthenticated: false };
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await POST(LOGIN, credentials);
            return handleResponse(response, rejectWithValue);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const getAdminProfileData = createAsyncThunk(
    "auth/getAdminProfileData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await GET(GET_ADMIN_DATA);
            return handleResponse(response, rejectWithValue);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const getPermission = createAsyncThunk(
    "auth/getPermission",
    async (_, { rejectWithValue }) => {
        try {
            const response = await GET(PERMISSSION);
            return handleResponse(response, rejectWithValue);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await POST(ADMIN_LOGOUT);
            const result = handleResponse(response, rejectWithValue);
            clearAllStorage();
            setSession();
            return result;
        } catch (error) {
            clearAllStorage();
            setSession();
            return rejectWithValue(handleError(error));
        }
    }
);
