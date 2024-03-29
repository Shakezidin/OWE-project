import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";

interface resetPasswordState {
  email: string;
  loading?: boolean;
  error?: string | null;
  otp?: string;
  new_password?: string;
  message?: string;
}
const initialState: resetPasswordState = {
  email: "",
  loading: false,
  error: null,
  message: "",
  otp: "",
  new_password: "",
};

const ACTION_PREFIX = "AUTH";
const TYPE_PREFIX = ACTION_PREFIX + "/forgotPassword";
export const generateOTP = createAsyncThunk(TYPE_PREFIX, async (data: any) => {
  console.log("email....", data);
  const response = await postCaller(EndPoints.resetPassword, data);

  console.log(response);

  return response;
});

const resetPasswordSlice = createSlice({
  name: "resetPassword",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(generateOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(generateOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.message = action.payload.message;
    });
    builder.addCase(generateOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message ?? "something went wrong";
    });
  },
});

export default resetPasswordSlice.reducer;
