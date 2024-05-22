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
    const response = await postCaller('get_appt_setters', data);

    return response.data.appt_setters_list;
  }
);

export const createApttSetters = createAsyncThunk(
  'create/appsetters',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('create_appt_setters', params);
      if (data instanceof Error) {
        return rejectWithValue((data as Error).message);
      }
      await dispatch(fetchApptSetters({ page_number: 1, page_size: 10 }));
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
      const data = await postCaller('update_appt_setters', params);
      await dispatch(fetchApptSetters({ page_number: 1, page_size: 10 }));
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
