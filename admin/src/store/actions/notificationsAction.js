import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import { NOTIFICATIONS_LIST, NOTIFICATIONS_GET, NOTIFICATIONS_CREATE, NOTIFICATIONS_UPDATE, NOTIFICATIONS_STATUS, NOTIFICATIONS_DELETE } from "constants/apiendpoints";

export const getNotificationss = createAsyncThunk(
    "notifications/getList",
    async (params, { rejectWithValue }) => {
        try {
            let url = NOTIFICATIONS_LIST;
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

export const getNotificationsById = createAsyncThunk(
    "notifications/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await GET(NOTIFICATIONS_GET(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const createNotifications = createAsyncThunk(
    "notifications/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await POST(NOTIFICATIONS_CREATE, data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateNotifications = createAsyncThunk(
    "notifications/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PUT(NOTIFICATIONS_UPDATE(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteNotifications = createAsyncThunk(
    "notifications/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await DELETE(NOTIFICATIONS_DELETE(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateNotificationsStatus = createAsyncThunk(
    "notifications/updateStatus",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PATCH(NOTIFICATIONS_STATUS(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

