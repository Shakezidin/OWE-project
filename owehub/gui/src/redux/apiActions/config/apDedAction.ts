import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';

export interface ReconcileEditParams {
  unique_id: string;
  name: string;
  team_name: string;
  pay_rate: number;
  start_date: string;
  end_date: string;
  record_id: string;
}

export const fetchApptSetters = createAsyncThunk(
  'apptsetters/fetchapptsetters',
  async (data: any) => {
    const response = await postCaller('get_apded', data);
    return {
      list: response.data.appt_setters_list,
      count: response.dbRecCount,
    };
  }
);

export const createApttSetters = createAsyncThunk(
  'create/appsetters',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('create_apded', params);
      if (data.status > 201) {
        return rejectWithValue((data as Error).message);
      }
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateApptSetters = createAsyncThunk(
  'update/appsetters',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('update_apded', params);
      if (data.status > 201) {
        return rejectWithValue((data as Error).message);
      }
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
