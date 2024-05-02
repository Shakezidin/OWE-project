import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

interface RepayCreateParams {
     unique_id:string;
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
        const response = await postCaller(EndPoints.create_repaysettings,params );
        return response.data;  
  
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );

 