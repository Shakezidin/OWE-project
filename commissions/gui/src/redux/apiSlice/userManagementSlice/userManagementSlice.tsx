import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postCaller } from "../../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../../infrastructure/web_api/api_client/EndPoints";
import { UserOnboardingStateModel } from "../../../core/models/data_models/UserManagementStateModel";
import { HTTP_STATUS } from "../../../core/models/api_models/RequestModel";
import { OnboardingChartModel, UserOnboardingModel } from "../../../core/models/api_models/UserManagementModel";

const initialState: UserOnboardingStateModel = {
  userOnboardingList: [],
  loading: false,
  error: null,
};
const COLORS = ['#5e5ef0', '#ff3f66', '#fb7955', '#ffa133',"#5edd74", "#52cafe", '#0181ff'];

export const fetchUserOnboarding = createAsyncThunk(
  "user/userOnboarding",
  async (): Promise<any> => {
    const response = await postCaller(EndPoints.Get_User_onboarding_list,{});
    if (response.status !== HTTP_STATUS.OK) {
        throw new Error('Failed to fetch onboarding data');
    }

    const {usermgmt_onboarding_list} = response.data;
    const mapList:OnboardingChartModel[] =  usermgmt_onboarding_list.map((el: UserOnboardingModel, index: number)=>{
      return {
          name: el.role_name,
          value: el.user_count,
          fill: COLORS[index],
      }
  });
    return mapList
  }
);

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
