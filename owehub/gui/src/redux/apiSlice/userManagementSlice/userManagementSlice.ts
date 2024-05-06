import { createSlice } from "@reduxjs/toolkit";
import { UserOnboardingStateModel } from "../../../core/models/data_models/UserManagementStateModel";
import {
  fetchUserListBasedOnRole,
  fetchUserOnboarding,
  createTablePermission,
} from "../../apiActions/userManagementActions";

const initialState: UserOnboardingStateModel = {
  userOnboardingList: [],
  userRoleBasedList: [],
  dbTables: [],
  loading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchUserOnboarding.pending,
        (state: UserOnboardingStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchUserOnboarding.fulfilled,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error = null;
          state.userOnboardingList = action.payload;
        }
      )
      .addCase(
        fetchUserOnboarding.rejected,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error =
            action.error.message ?? "Unable to fetch Onboarding User";
        }
      )
      //get user based list
      .addCase(
        fetchUserListBasedOnRole.pending,
        (state: UserOnboardingStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        fetchUserListBasedOnRole.fulfilled,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error = null;
          state.userRoleBasedList = action.payload;
        }
      )
      .addCase(
        fetchUserListBasedOnRole.rejected,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Unable to fetch User list";
        }
      )

      //  get db tables
      .addCase(
        createTablePermission.pending,
        (state: UserOnboardingStateModel) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        createTablePermission.fulfilled,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error = null;
          state.dbTables = action.payload;
        }
      )
      .addCase(
        createTablePermission.rejected,
        (state: UserOnboardingStateModel, action) => {
          state.loading = false;
          state.error = action.error.message ?? "Unable to fetch User list";
        }
      );
  },
});

export default userManagementSlice.reducer;
