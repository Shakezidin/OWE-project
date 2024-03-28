import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface Dealer {
    sub_dealer:string,
    dealer:string,
    pay_rate:string,
    start_date: string,
    end_date: string
}

interface DealerState {
  Dealers_list: Dealer[];
  loading: boolean;
  error: string | null;
}
const initialState: DealerState = {
  Dealers_list: [],
  loading: false,
  error: null,
};

export const fetchDealer = createAsyncThunk(
  'dealer/fetchDealer',
  async (data:any) => {
    const response = await postCaller(EndPoints.dealer,data);

    return response;
  }
);

const dealerSlice = createSlice({
  name: 'dealer',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDealer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDealer.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload && action.payload.data && action.payload.data.Dealers_list) {
          state.Dealers_list = action.payload.data.Dealers_list;
        } else {
          state.Dealers_list = [];
        }
        state.Dealers_list = action.payload.data.Dealers_list;
      })
      .addCase(fetchDealer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch dealer data';
      });
  },
});

export default dealerSlice.reducer;
