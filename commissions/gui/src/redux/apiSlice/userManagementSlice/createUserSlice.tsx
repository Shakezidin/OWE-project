// src/features/createCommissionSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserAdmin } from '../../../core/models/UserManagement/UserAdmin';


const initialState: UserAdmin = {
  First_Name:"Deepak",
  Last_Name: "Chauhan",
  Role: "Admin",
  Email_ID: "imdeepak@gmail.com",
  Phone_Number:9716953624,
  Dealer_Owner: "Vinay",
  Description: 123456,

};

const createUserSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updateForm(state, action: PayloadAction<Partial<UserAdmin>>) {
      return { ...state, ...action.payload };
    },
    resetForm(state) {
      return initialState;
    },
  },
});

export const { updateForm, resetForm } = createUserSlice.actions;
export default createUserSlice.reducer;
