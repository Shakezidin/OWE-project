import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
import { EndPoints } from '../../../infrastructure/web_api/api_client/EndPoints';

export interface ReconcileEditParams {
  unique_id: string;
  pay_scale: number;
  percentage: number;
  record_id: number;
}

interface ReconcileCreateParams {
  unique_id: string;
  pay_scale: number;
  percentage: number;
}

export const fetchAdderResponsibility = createAsyncThunk(
  'adderResponsibility/fetchAdderResponsibility',
  async (data: any) => {
    const response = await postCaller('get_adder_responsibility', data);

    return response.data.adder_responsibility_list;
  }
);

export const createAdderResponsibility = createAsyncThunk(
  'create/adder-responsibility',
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await postCaller('create_adder_responsibility', params);
      return response.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateAdderResponsibility = createAsyncThunk(
  'update/adder-responsibility',
  async (params: any, { rejectWithValue, dispatch }) => {
    try {
      const data = await postCaller('update_adder_responsibility', params);
      await dispatch(
        fetchAdderResponsibility({ page_number: 1, page_size: 10 })
      );
      return data.data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);
