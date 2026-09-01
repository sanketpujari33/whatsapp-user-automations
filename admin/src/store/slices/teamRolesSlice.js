import { createSlice } from "@reduxjs/toolkit";
import { getTeamRoless, createTeamRoles, updateTeamRoles, deleteTeamRoles } from "../actions/teamRolesAction";

const initialState = {
    data: [],
    item: null,
    isLoading: false,
    error: null,
    pagination: null,
};

export const teamRolesSlice = createSlice({
    name: "teamRoles",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearItem: (state) => {
            state.item = null;
        }
    },
    extraReducers: (builder) => {
        // getTeamRoless
        builder.addCase(getTeamRoless.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getTeamRoless.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload?.data || [];
            state.pagination = action.payload?.pagination || null;
        });
        builder.addCase(getTeamRoless.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // createTeamRoles
        builder.addCase(createTeamRoles.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createTeamRoles.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data) {
                state.data.unshift(action.payload.data);
            }
        });
        builder.addCase(createTeamRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateTeamRoles
        builder.addCase(updateTeamRoles.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateTeamRoles.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateTeamRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // deleteTeamRoles
        builder.addCase(deleteTeamRoles.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteTeamRoles.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToDelete = action.meta.arg;
            state.data = state.data.filter(item => item.id !== idToDelete && item._id !== idToDelete);
        });
        builder.addCase(deleteTeamRoles.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

    }
});

export const { clearError, clearItem } = teamRolesSlice.actions;
export default teamRolesSlice.reducer;
