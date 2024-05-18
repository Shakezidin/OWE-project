import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import {
  fetchAdderCredit,
  createAdderCredit,
  updateAdderCredit,
} from '../../../apiActions/adderCreditAction';
import { RateAdjustment } from '../../../../core/models/api_models/RateAdjustmentModel';
import { toast } from 'react-toastify';

interface IState {
  data: any;
  error: string;
  isLoading: boolean;
  isFormSubmitting: boolean;
  isSuccess: boolean;
}

const initialState: IState = {
  data: [],
  error: '',
  isLoading: false,
  isFormSubmitting: false,
  isSuccess: false,
};

const adderCredit = createSlice({
  name: 'Adder Credit',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdderCredit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchAdderCredit.fulfilled,
        (state, action: PayloadAction<any | null>) => {
          state.isLoading = false;
          state.data = action.payload
            ? action.payload.data.adder_credit_list
            : [];
        }
      )
      .addCase(fetchAdderCredit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createAdderCredit.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(createAdderCredit.fulfilled, (state) => {
        state.isFormSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(createAdderCredit.rejected, (state, action) => {
        state.isFormSubmitting = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdderCredit.pending, (state, action) => {
        state.isFormSubmitting = true;
      })
      .addCase(updateAdderCredit.fulfilled, (state, action) => {
        state.isFormSubmitting = false;
        state.isSuccess = true;
      })
      .addCase(updateAdderCredit.rejected, (state, action) => {
        state.isFormSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSuccess } = adderCredit.actions;
export default adderCredit.reducer;
