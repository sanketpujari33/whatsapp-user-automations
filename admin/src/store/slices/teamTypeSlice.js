import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from 'utils/network/axiosInstance';
import { FETCH_TEAM_TYPES } from "constants/apiendpoints";
import { TOKEN_KEY } from "constants/app.constant";

export const fetchTeamTypeStatus = createAsyncThunk(
  "teamType/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const authToken = localStorage.getItem(TOKEN_KEY) || localStorage.getItem("token");
      if (!authToken) {
        return rejectWithValue("Authentication token missing");
      }

      const res = await axiosInstance.get(FETCH_TEAM_TYPES, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data?.success) {
        return Boolean(res.data.data);
      } else {
        return rejectWithValue(res.data?.message || "Failed to fetch team type status");
      }
    } catch (err) {
      return rejectWithValue("Unauthorized or session expired");
    }
  }
);

const initialState = {
  isTeamTypeEnabled: true,
  isLoading: false,
  error: null,
};

export const teamTypeSlice = createSlice({
  name: "teamType",
  initialState,
  reducers: {
    setTeamTypeEnabled: (state, action) => {
      state.isTeamTypeEnabled = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamTypeStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeamTypeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isTeamTypeEnabled = action.payload;
      })
      .addCase(fetchTeamTypeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setTeamTypeEnabled } = teamTypeSlice.actions;

export default teamTypeSlice.reducer;
