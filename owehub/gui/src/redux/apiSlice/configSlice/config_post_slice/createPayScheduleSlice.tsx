// src/features/createPayScheduleSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PayScheduleModel } from '../../../../core/models/configuration/create/PayScheduleModel';

const initialState: PayScheduleModel = {
  record_id: 0,
  partner: '',
  partner_name: '',
  installer_name: '',
  sale_type: '',
  state: '',
  rl: '',
  draw: '',
  draw_max: '',
  rep_draw: '',
  rep_draw_max: '',
  rep_pay: '',
  start_date: '',
  end_date: '',
  percentage:'',
  standard:""
};

const createPayScheduleSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updatePayForm(state, action: PayloadAction<Partial<PayScheduleModel>>) {
      return { ...state, ...action.payload };
    },
    payresetForm(state) {
      return initialState;
    },
  },
});

export const { updatePayForm, payresetForm } = createPayScheduleSlice.actions;
export default createPayScheduleSlice.reducer;
