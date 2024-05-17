import { createSlice } from '@reduxjs/toolkit';
import {
  getDlrOth,
  createDlrOth,
  IRowDLR,
  updateDlrOth,
} from '../../../apiActions/dlrAction';
import { toast } from 'react-toastify';

interface IState {
  data: IRowDLR[];
  error: string;
  isLoading: boolean;
  isFormSubmitting: boolean;
  isSuccess: boolean;
  dbCount: 0;
}
const initialState: IState = {
  isLoading: false,
  isFormSubmitting: false,
  error: '',
  data: [],
  isSuccess: false,
  dbCount: 0,
};

const dlrOth = createSlice({
  name: 'dlrOth',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDlrOth.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDlrOth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.list;
        console.log(action.payload);
      })
      .addCase(getDlrOth.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(createDlrOth.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(createDlrOth.fulfilled, (state, action) => {
        state.isFormSubmitting = false;
        state.isSuccess = true;
        toast.success('Form submission completed');
      })
      .addCase(createDlrOth.rejected, (state, action) => {
        state.isFormSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateDlrOth.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(updateDlrOth.fulfilled, (state, action) => {
        state.isFormSubmitting = false;
        state.isSuccess = true;
        toast.success('Details updated successfully');
      })
      .addCase(updateDlrOth.rejected, (state, action) => {
        state.isFormSubmitting = false;
        state.error = action.payload as string;
      });
  },
});
export const { resetSuccess } = dlrOth.actions;
export default dlrOth.reducer;
