import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";
import { HTTP_STATUS } from "../../core/models/api_models/RequestModel";
import {
  OnboardingChartModel,
  UserOnboardingModel,
} from "../../core/models/api_models/UserManagementModel";

/** get dealer */
export const fetchUserOnboarding = createAsyncThunk(
  "user/userOnboarding",
  async () => {
    const response = await postCaller(EndPoints.get_user_by_role, {});
    if (response.status !== HTTP_STATUS.OK) {
      throw new Error("Failed to fetch onboarding data");
    }

    const { usermgmt_onboarding_list } = response.data;
    const mapList: OnboardingChartModel[] = usermgmt_onboarding_list.map(
      (el: UserOnboardingModel, index: number) => {
        return {
          name: el.role_name,
          value: el.user_count,
          fill: "",
        };
      }
    );
    return mapList;
  }
);
