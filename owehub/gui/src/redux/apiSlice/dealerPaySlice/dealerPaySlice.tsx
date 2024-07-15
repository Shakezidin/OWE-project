import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getDealerPay,
  getDealerPayTileData,
} from '../../apiActions/dealerPayAction';
import { toast } from 'react-toastify';

interface TileData {
  amount_prepaid: number;
  current_due: number;
  pipeline_remaining: number;
}
const initialState = {
  loading: false,
  data: [],
  count: 0,
  error: '',
  tileData: {
    amount_prepaid: 0,
    current_due: 0,
    pipeline_remaining: 0,
  } as TileData,
};

const dealerPaySlice = createSlice({
  name: 'dealerPaySlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDealerPay.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDealerPay.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.list;
      state.count = action.payload?.count;
    });
    builder.addCase(getDealerPay.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
    builder.addCase(getDealerPayTileData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDealerPayTileData.fulfilled, (state, action) => {
      state.loading = false;
      state.tileData = action.payload;
      console.log(action.payload, 'payload search');
    });
    builder.addCase(getDealerPayTileData.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
  },
});

export default dealerPaySlice.reducer;
