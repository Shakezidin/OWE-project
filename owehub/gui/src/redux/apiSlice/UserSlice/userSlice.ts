import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { getAR, IGetArdata } from '../../apiActions/config/arAction';
import { toast } from 'react-toastify';
import { getUser } from '../../apiActions/GetUser/getUserAction';

interface IState {
  userDetail: any;
  error: string;
  isLoading: boolean;
  isFormSubmitting: boolean;
  isSuccess: number;
  count: number;
}

const initialState: IState = {
  userDetail: [],
  error: '',
  isLoading: false,
  isFormSubmitting: false,
  isSuccess: 0,
  count: 0,
};

const userData = createSlice({
  name: 'USER DATA',
  initialState,
  reducers: {
  
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetail = action.payload
        // state.count = action.payload.count;
        // state.data = action.payload.list;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default userData.reducer;
