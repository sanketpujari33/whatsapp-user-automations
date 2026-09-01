import { createSlice } from "@reduxjs/toolkit";
import { getAdminss, getAdminsById, createAdmins, updateAdmins, deleteAdmins } from "../actions/adminsAction";

const initialState = {
    data: [],
    item: null,
    isLoading: false,
    error: null,
    pagination: null,
};

export const adminsSlice = createSlice({
    name: "admins",
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
        // getAdminss
        builder.addCase(getAdminss.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAdminss.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload?.data || [];
            state.pagination = action.payload?.pagination || null;
        });
        builder.addCase(getAdminss.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // getAdminsById
        builder.addCase(getAdminsById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getAdminsById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.item = action.payload?.data || null;
        });
        builder.addCase(getAdminsById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // createAdmins
        builder.addCase(createAdmins.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createAdmins.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data) {
                state.data.unshift(action.payload.data);
            }
        });
        builder.addCase(createAdmins.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateAdmins
        builder.addCase(updateAdmins.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateAdmins.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateAdmins.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // deleteAdmins
        builder.addCase(deleteAdmins.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteAdmins.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToDelete = action.meta.arg;
            state.data = state.data.filter(item => item.id !== idToDelete && item._id !== idToDelete);
        });
        builder.addCase(deleteAdmins.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

    }
});

export const { clearError, clearItem } = adminsSlice.actions;
export default adminsSlice.reducer;
