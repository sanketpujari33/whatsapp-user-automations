import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST, PUT, DELETE, PATCH } from "utils/network/http";
import { handleResponse, handleError } from "utils/network/response";
import { TEAM_ROLES_LIST, TEAM_ROLES_CREATE, TEAM_ROLES_UPDATE, TEAM_ROLES_DELETE } from "constants/apiendpoints";

export const getTeamRoless = createAsyncThunk(
    "teamRoles/getList",
    async (params, { rejectWithValue }) => {
        try {
            let url = TEAM_ROLES_LIST;
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

export const createTeamRoles = createAsyncThunk(
    "teamRoles/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await POST(TEAM_ROLES_CREATE, data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const updateTeamRoles = createAsyncThunk(
    "teamRoles/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await PUT(TEAM_ROLES_UPDATE(id), data);
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

export const deleteTeamRoles = createAsyncThunk(
    "teamRoles/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await DELETE(TEAM_ROLES_DELETE(id));
            return handleResponse(response);
        } catch (error) {
            return rejectWithValue(handleError(error));
        }
    }
);

