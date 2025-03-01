import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';
import { Credentials } from '../../../core/models/api_models/AuthModel';
import axios from 'axios';
const BASE_URL = `${process.env.REACT_APP_BASE_URL}`;

/** Create user */
export const loginAction = createAsyncThunk(
  'user/login',
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
  'user/Send_otp',
  async (data: any, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(EndPoints.resetPassword, data);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

/** Change password */
export const changePasswordAction = createAsyncThunk(
  'user/Change_password',
  async (data: any, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(EndPoints.changePassword, data);
      console.log(response);
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// check user exist

/** Check if user exists */
export const checkUserExists = createAsyncThunk(
  'user/check_exists',
  async (email: string, { rejectWithValue }): Promise<any> => {
    try {
      const response = await postCaller(EndPoints.checkUser, { email });
      return response.data.exists;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);



export const checkDBStatus = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/is_owedb_ready`, {});
    console.log(response.data, "DB Status Response");
    
    // Handle different possible response formats
    if (response.data?.data?.is_up === true) {
      return true;
    } else if (response.data?.status === 200 && 
              response.data?.message === "Historical Data Status") {
      return true;
    }
    
    return false; // Default to false if response format doesn't match expected
  } catch (error) {
    console.error("Error in checking DB status:", error);
    return false; // Return false if an error occurs
  }
};
