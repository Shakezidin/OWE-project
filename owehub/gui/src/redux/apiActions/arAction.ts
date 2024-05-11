// get_dlr_oth_data
import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";

interface Ipaginate {
    page_number: number;
    page_size: number;
    archived?:boolean;
    report_type:string;
    sale_partner:string; 
  }
  
 

export const getAR = createAsyncThunk(
    "fetch/get-ar",
    async (param:Ipaginate, { rejectWithValue }) => {
      try {
        const data = await postCaller("get_ar_data", param);
        const list = data.data
        return {list,count:data.dbRecCount}
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );


 
 

