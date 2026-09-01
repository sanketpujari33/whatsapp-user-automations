import { createAsyncThunk } from '@reduxjs/toolkit';

import { GET, PATCH, DELETE } from 'utils/network/http';
import { handleError, handleResponse } from 'utils/network/response';
import { THEME_GET, THEME_UPSERT, THEME_RESET } from 'constants/apiendpoints';

export const getAdminTheme = createAsyncThunk(
  'theme/getAdminTheme',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(THEME_GET);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const upsertAdminTheme = createAsyncThunk(
  'theme/upsertAdminTheme',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PATCH(THEME_UPSERT, payload || {});
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);

export const resetAdminTheme = createAsyncThunk(
  'theme/resetAdminTheme',
  async (_, { rejectWithValue }) => {
    try {
      const response = await DELETE(THEME_RESET);
      return handleResponse(response);
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  },
);
