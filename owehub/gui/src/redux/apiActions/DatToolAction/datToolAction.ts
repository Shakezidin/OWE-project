// get_dlr_oth_data
import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller, reportingCaller } from '../../../infrastructure/web_api/services/apiUrl';



export const getDatProjectList = createAsyncThunk(
  'dataTool/getDatProjectList',
  async (payload: { search: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_project_list', {
        search: payload.search
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch summary data');
    }
  }
);

