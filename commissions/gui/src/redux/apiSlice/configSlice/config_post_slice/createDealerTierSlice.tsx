// src/features/createDealerTierSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DealerTierModel } from '../../../../core/models/configuration/DealerTierModel';



const initialState: DealerTierModel = {
    dealer_name: "",
    tier: "",
    start_date:"",
    end_date: ""
};

const createDealerTierSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateDealerTierForm(state, action: PayloadAction<Partial<DealerTierModel>>) {
      return { ...state, ...action.payload };
    },
    dealerResetForm(state) {
      return initialState;
    },
  },
});

export const { updateDealerTierForm, dealerResetForm } = createDealerTierSlice.actions;
export default createDealerTierSlice.reducer;
