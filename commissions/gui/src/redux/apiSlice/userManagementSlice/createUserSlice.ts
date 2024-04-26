// src/features/createUserSlice.ts

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { CreateOnboardUserStateModel } from "../../../core/models/data_models/UserManagementStateModel";
import {
  cretaeUserOnboarding,
  fetchDealerOwner,
  fetchRegionList,
} from "../../apiActions/createUserSliceActions";

const initialState: CreateOnboardUserStateModel = {
  loading: false,
  error: null,
  formData: {
    first_name: "",
    last_name: "",
    email_id: "",
    mobile_number: "",
    password: "",
    assigned_dealer_name: "",
    role_name: "",
    add_region: "",
    team_name: "",
    description: "",
  },
  dealerOwenerList: [],
  regionList: [],
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
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchDealerOwner.pending,
        (state: CreateOnboardUserStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchDealerOwner.fulfilled,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = true;
          state.error = null;
          state.dealerOwenerList = action.payload;
        }
      )
      .addCase(
        fetchDealerOwner.rejected,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Unable to fetch dealer Owener";
        }
      )
      /** get region list */
      .addCase(
        fetchRegionList.pending,
        (state: CreateOnboardUserStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchRegionList.fulfilled,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = true;
          state.error = null;
          state.regionList = action.payload;
        }
      )
      .addCase(
        fetchRegionList.rejected,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Unable to fetch dealer Owener";
        }
      )
      /** create user */
      .addCase(
        cretaeUserOnboarding.pending,
        (state: CreateOnboardUserStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        cretaeUserOnboarding.fulfilled,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        cretaeUserOnboarding.rejected,
        (state: CreateOnboardUserStateModel, action) => {
          state.loading = false;
          state.error =
            action.error.message ?? "Unable to create Onboarding User";
        }
      );
  },
});

export const { updateUserForm, userResetForm } = createUserSlice.actions;
export default createUserSlice.reducer;
