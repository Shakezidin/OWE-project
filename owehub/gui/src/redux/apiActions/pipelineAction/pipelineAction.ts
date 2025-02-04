import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";





export const getPipeLineData = createAsyncThunk(
    'fetch/get_data',
    async (param: any, { rejectWithValue }) => {
      try {
        const data = await postCaller('getPipelineDealerData', param);
        const list = data;
        return { list, count: data.dbRecCount };
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );
  