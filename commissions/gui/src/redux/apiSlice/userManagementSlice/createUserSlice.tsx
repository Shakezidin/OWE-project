// src/features/createUserSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CreateUserModel } from "../../../core/models/api_models/UserManagementModel";

const initialState: CreateUserModel = {
  first_name: "",
  last_name: "",
  email_id: "",
  mobile_number: "",
  password: "",
  designation: "",
  assigned_dealer_name: "",
  role_name: "",
  add_region: "",
  report_to: "",
  team_name: "",
  reporting_to: "",
  description:''
};

const createUserSlice = createSlice({
  name: "CreateOnboardUser",
  initialState,
  reducers: {
    updateUserForm(state, action: PayloadAction<Partial<CreateUserModel>>) {
      return { ...state, ...action.payload };
    },
    userResetForm(state) {
      return initialState;
    },
  },
});

export const { updateUserForm, userResetForm } = createUserSlice.actions;
export default createUserSlice.reducer;
