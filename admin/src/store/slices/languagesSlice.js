import { createSlice } from "@reduxjs/toolkit";
import { getLanguagess, getLanguagesById, createLanguages, updateLanguages, deleteLanguages, updateLanguagesStatus } from "../actions/languagesAction";

const initialState = {
    data: [],
    item: null,
    isLoading: false,
    error: null,
    pagination: null,
};

export const languagesSlice = createSlice({
    name: "languages",
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
        // getLanguagess
        builder.addCase(getLanguagess.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getLanguagess.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload?.data || [];
            state.pagination = action.payload?.pagination || null;
        });
        builder.addCase(getLanguagess.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // getLanguagesById
        builder.addCase(getLanguagesById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getLanguagesById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.item = action.payload?.data || null;
        });
        builder.addCase(getLanguagesById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // createLanguages
        builder.addCase(createLanguages.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createLanguages.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data) {
                state.data.unshift(action.payload.data);
            }
        });
        builder.addCase(createLanguages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateLanguages
        builder.addCase(updateLanguages.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateLanguages.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateLanguages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // deleteLanguages
        builder.addCase(deleteLanguages.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteLanguages.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToDelete = action.meta.arg;
            state.data = state.data.filter(item => item.id !== idToDelete && item._id !== idToDelete);
        });
        builder.addCase(deleteLanguages.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateLanguagesStatus
        builder.addCase(updateLanguagesStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateLanguagesStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateLanguagesStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

    }
});

export const { clearError, clearItem } = languagesSlice.actions;
export default languagesSlice.reducer;
