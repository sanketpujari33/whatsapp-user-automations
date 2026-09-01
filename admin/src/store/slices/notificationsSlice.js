import { createSlice } from "@reduxjs/toolkit";
import { getNotificationss, getNotificationsById, createNotifications, updateNotifications, deleteNotifications, updateNotificationsStatus } from "../actions/notificationsAction";

const initialState = {
    data: [],
    item: null,
    isLoading: false,
    error: null,
    pagination: null,
};

export const notificationsSlice = createSlice({
    name: "notifications",
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
        // getNotificationss
        builder.addCase(getNotificationss.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getNotificationss.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = Array.isArray(action.payload?.data) ? action.payload.data : [];
            state.pagination = action.payload?.pagination || null;
        });
        builder.addCase(getNotificationss.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // getNotificationsById
        builder.addCase(getNotificationsById.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(getNotificationsById.fulfilled, (state, action) => {
            state.isLoading = false;
            state.item = action.payload?.data || null;
        });
        builder.addCase(getNotificationsById.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // createNotifications
        builder.addCase(createNotifications.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(createNotifications.fulfilled, (state, action) => {
            state.isLoading = false;
            if (action.payload?.data) {
                state.data.unshift(action.payload.data);
            }
        });
        builder.addCase(createNotifications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateNotifications
        builder.addCase(updateNotifications.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateNotifications.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateNotifications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // deleteNotifications
        builder.addCase(deleteNotifications.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(deleteNotifications.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToDelete = action.meta.arg;
            state.data = state.data.filter(item => item.id !== idToDelete && item._id !== idToDelete);
        });
        builder.addCase(deleteNotifications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

        // updateNotificationsStatus
        builder.addCase(updateNotificationsStatus.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(updateNotificationsStatus.fulfilled, (state, action) => {
            state.isLoading = false;
            const idToUpdate = action.meta.arg?.id;
            if (idToUpdate) {
                const index = state.data.findIndex(item => item.id === idToUpdate || item._id === idToUpdate);
                if (index !== -1) {
                    state.data[index] = { ...state.data[index], ...(action.payload?.data || action.meta.arg.data) };
                }
            }
        });
        builder.addCase(updateNotificationsStatus.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || "An error occurred";
        });

    }
});

export const { clearError, clearItem } = notificationsSlice.actions;
export default notificationsSlice.reducer;
