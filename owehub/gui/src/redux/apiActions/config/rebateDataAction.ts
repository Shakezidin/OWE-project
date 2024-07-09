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

export const fetchRebateData = createAsyncThunk(
  'RebateData/fetchRebateData',
  async (data: any) => {
    const response = await postCaller('get_rebate_data', data);
    console.log("rebate data test", response);
    return response.data.data.ar_data_list;
  }
);


export const createRebateData = createAsyncThunk(
  'create/rebatedata',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('create_rebate_data', params);
      if (data instanceof Error) {
        return rejectWithValue((data as Error).message);
      }
      await dispatch(fetchRebateData({ page_number: 1, page_size: 10 }));
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateRebateData = createAsyncThunk(
  'update/rebatedata',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('update_rebate_data', params);
      await dispatch(fetchRebateData({ page_number: 1, page_size: 10 }));
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
