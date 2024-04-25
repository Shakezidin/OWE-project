import { createSlice } from "@reduxjs/toolkit";
import { UserOnboardingStateModel } from "../../../core/models/data_models/UserManagementStateModel";
import { fetchUserOnboarding } from "../../apiActions/userManagementActions";

const initialState: UserOnboardingStateModel = {
  userOnboardingList: [],
  loading: false,
  error: null,
};

const userManagementSlice = createSlice({
  name: "userManagement",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOnboarding.pending, (state: UserOnboardingStateModel) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOnboarding.fulfilled, (state: UserOnboardingStateModel, action) => {
        state.loading = false;
        state.error = null;
        state.userOnboardingList = action.payload;
      })
      .addCase(fetchUserOnboarding.rejected, (state:UserOnboardingStateModel, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Unable to fetch Onboarding User";
      });
  },
});

export default userManagementSlice.reducer;
