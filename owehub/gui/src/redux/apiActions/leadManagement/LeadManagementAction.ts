import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';



export const getLeads = createAsyncThunk(
  'fetchLead/get_leads',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('get_leads', params);
      if (data.status > 201) {
        return rejectWithValue((data as Error).message);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);