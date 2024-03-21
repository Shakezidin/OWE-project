// apiSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface ApiState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchData = createAsyncThunk(
  'api/fetchData',
  async (endpoint: string, thunkAPI) => {
    try {
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

interface PostDataPayload {
  endpoint: string;
  requestData: any;
}

export const postData = createAsyncThunk(
  'api/postData',
  async ({ endpoint, requestData }: PostDataPayload, thunkAPI) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('Failed to post data');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchData.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(fetchData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(postData.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(postData.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload;
        })
        .addCase(postData.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });
  

export default apiSlice.reducer;
