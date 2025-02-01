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
      return rejectWithValue('Failed to fetch Project List');
    }
  }
);
export const getDatGeneralInfo = createAsyncThunk(
  'dataTool/getDatGeneralInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_general_info', {
        project_id: payload.project_id
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch General Info');
    }
  }
);
export const getDatAddersInfo = createAsyncThunk(
  'dataTool/getDatAddersInfo',
  async (payload: { project_id: string; }, { rejectWithValue }) => {
    try {
      const response = await reportingCaller('get_tab_adders_info', {
        project_id: payload.project_id
      });
      
      return response;
    } catch (error) {
      return rejectWithValue('Failed to fetch Adders Info');
    }
  }
);

