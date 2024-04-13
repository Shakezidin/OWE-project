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
export const fetchCommissions = createAsyncThunk(
  "commissions/fetchCommissions",
  async (data: any,thunkAPI) => {
    const response = await postCaller(EndPoints.commission, data);
    return response;
  }
);


// Define fetchCommissions async thunk without filters


const commissionSlice = createSlice({
  name: "commissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
