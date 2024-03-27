import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";


interface AdderV {
active: boolean,
adder_name:string,
adder_type:string,
description:string,
price_amount: string,
price_type: string
}

interface AdderVState {
  VAdders_list: AdderV[];
  loading: boolean;
  error: string | null;
}
const initialState: AdderVState = {
  VAdders_list: [],
  loading: false,
  error: null,
};

export const fetchAdderV = createAsyncThunk(
  'adderV/fetchAdderV',
  async (data:any) => {
    const response = await postCaller(EndPoints.adderV,data);
    return response;
  }
);

const adderSlice = createSlice({
  name: 'adderV',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdderV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdderV.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.VAdders_list = action.payload.data.VAdders_list;
      })
      .addCase(fetchAdderV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch adderV data';
      });
  },
});

export default adderSlice.reducer;
