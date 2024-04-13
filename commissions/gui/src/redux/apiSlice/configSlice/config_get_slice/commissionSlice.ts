import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../../infrastructure/web_api/api_client/EndPoints";
import { CommissionModel } from "../../../../core/models/configuration/create/CommissionModel";

interface CommissionsState {
  commissionsList: CommissionModel[];
  loading: boolean;
  error: string | null;
}
const initialState: CommissionsState = {
  commissionsList: [],
  loading: false,
  error: null,
};
interface FetchCommissionsWithFiltersArgs {
  page_number: number;
  page_size: number;
  filters: any[]; // Adjust the type according to your filter data type
}
interface FetchCommissionsWithoutFiltersArgs {
  page_number: number;
  page_size: number;
}
export const fetchCommissions = createAsyncThunk(
  "commissions/fetchCommissions",
  async (data: any,thunkAPI) => {
    const response = await postCaller(EndPoints.commission, data);
    return response;
  }
);
export const fetchCommissionsWithFilters = createAsyncThunk(
  "commissions/fetchCommissionsWithFilters",
  async ({ page_number, page_size, filters }: FetchCommissionsWithFiltersArgs) => {
    try {
      const response = await postCaller(EndPoints.commission, { page_number, page_size, filters });
      // Assuming response.data contains the relevant data from the API
      return response.data;
    } catch (error) {
      // Handle errors here
      throw error; // This will be caught by the rejected action
    }
  }
);

// Define fetchCommissions async thunk without filters


const commissionSlice = createSlice({
  name: "commissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchCommissionsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissionsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Assuming action.payload contains the commissions list
        state.commissionsList = action.payload;
      })
      .addCase(fetchCommissionsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch commissions data";
      })
      .addCase(fetchCommissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommissions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (
          action.payload &&
          action.payload.data &&
          action.payload.data.commissions_list
        ) {
          state.commissionsList = action.payload.data.commissions_list;
        } else {
          state.commissionsList = [];
        }
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Failed to fetch commissions data";
      });
  },
});

export default commissionSlice.reducer;
