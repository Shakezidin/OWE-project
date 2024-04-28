import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";
import { Credentials } from "../../core/models/api_models/AuthModel";
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
