import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";
import { Credentials } from "../../core/models/api_models/AuthModel";
import { ResetPasswordModel } from "../apiSlice/authSlice/resetPasswordSlice";
/** Create user */
export const loginAction = createAsyncThunk(
  "user/login",
  async (data: Credentials, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(EndPoints.login, data);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/** send OTP */
export const generateOTP = createAsyncThunk(
  "user/Send_otp",
  async (data: any, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(
         EndPoints.resetPassword,
        data
      );
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
