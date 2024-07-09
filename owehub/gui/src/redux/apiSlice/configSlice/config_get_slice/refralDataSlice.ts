import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getReferralData } from '../../../apiActions/refralDataAction';

interface IState {
  isLoading: boolean;
  isFormSubmitting: boolean;
  error: string;
  data: [];
  isSuccess: boolean;
  count: number;
}

const initialState: IState = {
  isLoading: false,
  isFormSubmitting: false,
  error: '',
  data: [],
  isSuccess: false,
  count: 0,
};

const refralDataSlice = createSlice({
  name: 'refralDataSlice',
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getReferralData.pending,(state,action)=>{
      state.isLoading = true
    })
    .addCase(getReferralData.fulfilled,(state,action)=>{
      state.isLoading = false;
      state.data = action.payload.list;
      state.count = action.payload.count;
    })
    .addCase(getReferralData.rejected,(state,action)=>{
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(action.payload as string);
    })

  },
});

export const { resetSuccess } = refralDataSlice.actions;

export default refralDataSlice.reducer;
