import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchRepStatusList, createRepStatus, updateRepStatus, archiveRepStatus } from '../../../apiActions/config/repstatusAction';

interface RepStatusItem {
  record_id: number;
  name: string;
  status: string;
}

interface RepStatusState {
  rep_status_list: RepStatusItem[];
  count: number;
  isSuccess: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: RepStatusState = {
  rep_status_list: [],
  count: 0,
  isSuccess: false,
  isLoading: false,
  error: null,
};

const repStatusSlice = createSlice({
  name: 'repStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepStatusList.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRepStatusList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.rep_status_list = action.payload.list || [];
        state.count = action.payload.count;
        console.log("Fetched Rep Status List:", action.payload);
      })
      .addCase(fetchRepStatusList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      })
      .addCase(createRepStatus.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createRepStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(createRepStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      })
      .addCase(updateRepStatus.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateRepStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateRepStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      })
      .addCase(archiveRepStatus.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(archiveRepStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(archiveRepStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export default repStatusSlice.reducer;