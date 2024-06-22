import { createAsyncThunk } from '@reduxjs/toolkit';
import { postCaller } from '../../../infrastructure/web_api/services/apiUrl';
interface Ipaginate {
  page_number: number;
  page_size: number;
  pay_roll_start_date?:string;
  pay_roll_end_date?:string,
  use_cutoff?:string;
  dealer_name?:string;
  sort_by?:string
}

export const getDealerPay = createAsyncThunk(
  'get/dealer-pay',
  async (params: Ipaginate, { rejectWithValue }) => {
    try {
      const resp = await postCaller('get_dealerpay', params);
      const count = resp.dbRecCount || 0;
      const list = resp.data.dealer_pay_data_list || [];
      return { count, list };
    } catch (error) {
      rejectWithValue((error as Error).message);
    }
  }
);
