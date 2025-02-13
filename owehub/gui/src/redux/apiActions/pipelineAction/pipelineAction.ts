import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { toast } from "react-toastify";





export const getPipeLineData = createAsyncThunk(
    'fetch/get_data',
    async (param: any, { rejectWithValue }) => {
      try {
        const data = await postCaller('getPipelineDealerData', param);
        const list = data;
        if (data.status > 201) {
          toast.error('Error in fetching data');
          return rejectWithValue((data as Error).message);
        }
        return { list, count: data.dbRecCount };
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );
  
