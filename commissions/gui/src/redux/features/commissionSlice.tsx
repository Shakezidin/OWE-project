import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

export interface commissionData {
  data: any | null;
  loading: boolean;
  error: string | null;
}

export const getCommission = createAsyncThunk(
  "commission",
  async (data: any) => {
    const response = await postCaller(EndPoints.commission, data);
    return response.data;
  }
);

const initialState: commissionData = {
  data: [],
  loading: false,
  error: "",
};
export const commissionSlice = createSlice({
  name: "commission",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getCommission.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCommission.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.data = action.payload;
      })
      .addCase(getCommission.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
        state.data = [];
      });
  },
});
export default commissionSlice.reducer;
