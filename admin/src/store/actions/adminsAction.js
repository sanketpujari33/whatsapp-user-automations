import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import { ADMINS_LIST, ADMINS_GET, ADMINS_CREATE, ADMINS_UPDATE, ADMINS_DELETE } from "constants/apiendpoints";

export const getAdminss = createAsyncThunk(
    "admins/getList",
    async (params, { rejectWithValue }) => {
        try {
            let url = ADMINS_LIST;
            if (params) {
                const query = new URLSearchParams(params).toString();
                url = `${url}?${query}`;
            }
            const response = await GET(url);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const getAdminsById = createAsyncThunk(
    "admins/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await GET(ADMINS_GET(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const createAdmins = createAsyncThunk(
    "admins/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await POST(ADMINS_CREATE, data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateAdmins = createAsyncThunk(
    "admins/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PUT(ADMINS_UPDATE(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteAdmins = createAsyncThunk(
    "admins/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await DELETE(ADMINS_DELETE(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

