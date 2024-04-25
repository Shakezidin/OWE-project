// src/features/createUserSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserAdmin } from "../../../core/models/UserManagement/UserAdmin";

const initialState: UserAdmin = {
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
};

const createUserSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateUserForm(state, action: PayloadAction<Partial<UserAdmin>>) {
      return { ...state, ...action.payload };
    },
    userResetForm(state) {
      return initialState;
    },
  },
});

export const { updateUserForm, userResetForm } = createUserSlice.actions;
export default createUserSlice.reducer;
