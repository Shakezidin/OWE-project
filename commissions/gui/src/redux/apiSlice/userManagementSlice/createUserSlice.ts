// src/features/createUserSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateOnboardUserStateModel } from "../../../core/models/data_models/UserManagementStateModel";

const initialState: CreateOnboardUserStateModel = {
  loading: false,
  error: null,
  formData: {
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
    description: "",
  },
};

const createUserSlice = createSlice({
  name: "CreateOnboardUser",
  initialState,
  reducers: {
    updateUserForm(
      state,
      action: PayloadAction<{ field: string; value: any }>
    ) {
      const { field, value } = action.payload;
      return {
        ...state,
        formData: {
          ...state.formData,
          [field]: value,
        },
      };
    },
    userResetForm(state) {
      state.formData = initialState.formData;
    },
  },
});

export const { updateUserForm, userResetForm } = createUserSlice.actions;
export default createUserSlice.reducer;
