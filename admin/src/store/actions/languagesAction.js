import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import { LANGUAGES_LIST, LANGUAGES_GET, LANGUAGES_CREATE, LANGUAGES_UPDATE, LANGUAGES_STATUS, LANGUAGES_DELETE } from "constants/apiendpoints";

export const getLanguagess = createAsyncThunk(
    "languages/getList",
    async (params, { rejectWithValue }) => {
        try {
            let url = LANGUAGES_LIST;
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

export const getLanguagesById = createAsyncThunk(
    "languages/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await GET(LANGUAGES_GET(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const createLanguages = createAsyncThunk(
    "languages/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await POST(LANGUAGES_CREATE, data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateLanguages = createAsyncThunk(
    "languages/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PUT(LANGUAGES_UPDATE(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteLanguages = createAsyncThunk(
    "languages/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await DELETE(LANGUAGES_DELETE(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateLanguagesStatus = createAsyncThunk(
    "languages/updateStatus",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PATCH(LANGUAGES_STATUS(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

