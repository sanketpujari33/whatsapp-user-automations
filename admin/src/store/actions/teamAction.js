import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import { TEAM_LIST, TEAM_GET, TEAM_CREATE, TEAM_UPDATE, TEAM_DELETE } from "constants/apiendpoints";

export const getTeams = createAsyncThunk(
    "team/getList",
    async (params, { rejectWithValue }) => {
        try {
            let url = TEAM_LIST;
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

export const getTeamById = createAsyncThunk(
    "team/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await GET(TEAM_GET(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const createTeam = createAsyncThunk(
    "team/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await POST(TEAM_CREATE, data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateTeam = createAsyncThunk(
    "team/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PUT(TEAM_UPDATE(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteTeam = createAsyncThunk(
    "team/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await DELETE(TEAM_DELETE(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

