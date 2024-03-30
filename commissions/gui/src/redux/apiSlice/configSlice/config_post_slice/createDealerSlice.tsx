// src/features/createDealerSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DealerModel } from '../../../../core/models/configuration/DealerModel';



const initialState: DealerModel = {
    sub_dealer: "",
    dealer: "",
    pay_rate:"",
    start_date:"",
    end_date: ""
};

const createDealerSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateDealerForm(state, action: PayloadAction<Partial<DealerModel>>) {
      return { ...state, ...action.payload };
    },
    dealerResetForm(state) {
      return initialState;
    },
  },
});

export const { updateDealerForm, dealerResetForm } = createDealerSlice.actions;
export default createDealerSlice.reducer;
