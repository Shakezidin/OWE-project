import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";

interface TierLoan {
  dealer_tier: string;
  installer: string;
  state: string;
  finance_type: string;
  owe_cost: string;
  dlr_mu: string;
  dlr_cost: string;
  start_date: string;
  end_date: string;
}

interface TierLoanState {
  tier_loan_fee_list: TierLoan[];
  loading: boolean;
  error: string | null;
}
const initialState: TierLoanState = {
  tier_loan_fee_list: [],
  loading: false,
  error: null,
};

export const fetchTearLoan = createAsyncThunk(
  "tierLoan/fetchTearLoan",
  async (data: any) => {
    const response = await postCaller(EndPoints.tierLoan, data);

    return response;
  }
);

const tearLoanSlice = createSlice({
  name: "tierLoan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTearLoan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTearLoan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (
          action.payload &&
          action.payload.data &&
          action.payload.data.tier_loan_fee_list
        ) {
          state.tier_loan_fee_list = action.payload.data.tier_loan_fee_list;
        } else {
          state.tier_loan_fee_list = [];
        }
      })
      .addCase(fetchTearLoan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch TierLoan data";
      });
  },
});

export default tearLoanSlice.reducer;
