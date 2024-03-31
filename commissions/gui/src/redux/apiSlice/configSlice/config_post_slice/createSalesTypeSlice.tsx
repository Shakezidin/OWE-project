// src/features/createSalesTypeSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalesTypeModel } from '../../../../core/models/configuration/SalesTypeModel';





const initialState: SalesTypeModel = {
    type_name:"",
    description: ""
};

const createSalesTypeSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateSalesForm(state, action: PayloadAction<Partial<SalesTypeModel>>) {
      return { ...state, ...action.payload };
    },
    salesresetForm(state) {
      return initialState;
    },
  },
});

export const { updateSalesForm, salesresetForm } = createSalesTypeSlice.actions;
export default createSalesTypeSlice.reducer;
