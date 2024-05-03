

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

interface RateAdjustmentsParams {
     unique_id:string;
     position:string,
     adjustment:string,
     pay_scale:String,
     max_rate:number,
     min_rate:number,
     start_date:string,
     end_date:string,
     
}
export const fetchRateAdjustments = createAsyncThunk(
    "rateadjustment/fetchrateadjustments",
    async (data: any) => {
      const response = await postCaller(EndPoints.rateAdjustments, data);
  
      return response;
    }
  );


  export const createRateAdjustments = createAsyncThunk(
    'create/rate-adjustments',
    async (params: RateAdjustmentsParams, { rejectWithValue }) => {
      try {
        const response = await postCaller(EndPoints.create_rateadjustments,params );
        return response.data;  
  
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );

 