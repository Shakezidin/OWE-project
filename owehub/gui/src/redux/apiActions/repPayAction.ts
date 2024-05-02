import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

interface RepayCreateParams {
     name:string,
     state:string,
     pay_scale:String,
     position:string,
     b_e:string,
     start_date:string,
     end_date:string
}
export const fetchRepaySettings = createAsyncThunk(
    "repaySettings/fetchrepaySettings",
    async (data: any) => {
      const response = await postCaller(EndPoints.repPaySettings, data);
  
      return response;
    }
  );


  export const createRepaySettings = createAsyncThunk(
    'create/repay-settings',
    async (params: RepayCreateParams, { rejectWithValue }) => {
      try {
        const response = await postCaller(EndPoints.create_repaysettings, params);
        return response.data; // Assuming your API response contains a 'data' property
  
      } catch (error) {
        // If an error occurs, reject the promise with an error message
        return rejectWithValue((error as Error).message);
      }
    }
  );