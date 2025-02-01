import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {getDatProjectList} from '../../apiActions/DatToolAction/datToolAction'
import { toast } from 'react-toastify';

interface listData {
    project_name: string;
    project_id: string;
    project_address: string;
}

// Define the interface for the initial state
interface DatToolState {
  loading: boolean;
  data: any[]; // Adjust 'any' if you have more specific data structure
  count: number;
  error: string;
  tileData: any;
}

// Initialize the state with type safety
const initialState: DatToolState = {
  loading: false,
  data: [],
  count: 0,
  error: '',
  tileData:{}
};



const datSlice = createSlice({
  name: 'datToolSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDatProjectList.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getDatProjectList.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload?.data.project_data;
    });
    builder.addCase(getDatProjectList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    });
 
  },
});

export default datSlice.reducer;
