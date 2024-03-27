import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface Commission {
  partner: string;
  installer: string;
  state: string;
  sale_type: string;
  sale_price: number;
  rep_type: string;
  rl: number;
  rate: number;
  start_date: string;
  end_date: string;
}

interface CommissionsState {
  commissionsList: Commission[];
  loading: boolean;
  error: string | null;
}
const initialState: CommissionsState = {
  commissionsList: [],
  loading: false,
  error: null,
};

export const fetchCommissions = createAsyncThunk(
  'commissions/fetchCommissions',
  async (data:any) => {
    const response = await postCaller(EndPoints.commission,data);
    return response;
  }
);

const commissionSlice = createSlice({
  name: 'commissions',
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
        state.commissionsList = action.payload.data.commissions_list;
      })
      .addCase(fetchCommissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch commissions data';
      });
  },
});

export default commissionSlice.reducer;
