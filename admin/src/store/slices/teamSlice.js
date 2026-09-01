import { createSlice } from "@reduxjs/toolkit";
import { getTeams, getTeamById, createTeam, updateTeam, deleteTeam } from "../actions/teamAction";

const initialState = {
    data: [],
    item: null,
    isLoading: false,
    error: null,
    pagination: null,
};

export const teamSlice = createSlice({
    name: "team",
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
        // getTeams
        builder.addCase(getTeams.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getTeams.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload?.data || [];
            state.pagination = action.payload?.pagination || null;
        });
        builder.addCase(getTeams.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // getTeamById
        builder.addCase(getTeamById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getTeamById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.item = action.payload?.data || null;
        });
        builder.addCase(getTeamById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // createTeam
        builder.addCase(createTeam.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createTeam.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data) {
                state.data.unshift(action.payload.data);
            }
        });
        builder.addCase(createTeam.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateTeam
        builder.addCase(updateTeam.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateTeam.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateTeam.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // deleteTeam
        builder.addCase(deleteTeam.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteTeam.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToDelete = action.meta.arg;
            state.data = state.data.filter(item => item.id !== idToDelete && item._id !== idToDelete);
        });
        builder.addCase(deleteTeam.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

    }
});

export const { clearError, clearItem } = teamSlice.actions;
export default teamSlice.reducer;
