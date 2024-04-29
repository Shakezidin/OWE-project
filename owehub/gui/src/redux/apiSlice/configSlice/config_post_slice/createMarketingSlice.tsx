// src/features/createMarketingSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarketingFeeModel } from '../../../../core/models/configuration/create/MarketingFeeModel';





const initialState: MarketingFeeModel = {
  record_id:0,
    source: "",
    dba:"",
    state: "",
    fee_rate:"",
    chg_dlr:0,
    pay_src:0,
    description:"",
    start_date:"",
    end_date: ""
};

const createMarketingSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateMarketingForm(state, action: PayloadAction<Partial<MarketingFeeModel>>) {
      return { ...state, ...action.payload };
    },
    marketingresetForm(state) {
      return initialState;
    },
  },
});

export const { updateMarketingForm, marketingresetForm } = createMarketingSlice.actions;
export default createMarketingSlice.reducer;
