import { createAsyncThunk } from "@reduxjs/toolkit";
import { postCaller } from "../../infrastructure/web_api/services/apiUrl";
import { HTTP_STATUS } from "../../core/models/api_models/RequestModel";
import {
  OnboardingChartModel,
  UserOnboardingModel,
} from "../../core/models/api_models/UserManagementModel";
import { EndPoints } from "../../infrastructure/web_api/api_client/EndPoints";

const COLORS = [
  "#5e5ef0",
  "#ff3f66",
  "#fb7955",
  "#ffa133",
  "#5edd74",
  "#52cafe",
  "#0181ff",
];

export const fetchUserOnboarding = createAsyncThunk(
  "user/userOnboarding",
  async () => {
    const response = await postCaller(EndPoints.Get_User_onboarding_list, {});
    if (response.status !== HTTP_STATUS.OK) {
      throw new Error("Failed to fetch onboarding data");
    }

    const { usermgmt_onboarding_list } = response.data;
    const mapList: OnboardingChartModel[] = usermgmt_onboarding_list.map(
      (el: UserOnboardingModel, index: number) => {
        return {
          name: el.role_name,
          value: el.user_count,
          fill: COLORS[index],
        };
      }
    );
    return mapList;
  }
);
