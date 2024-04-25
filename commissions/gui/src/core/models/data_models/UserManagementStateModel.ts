import {
  OnboardingChartModel,
  UserRoleBasedListModel,
} from "../api_models/UserManagementModel";

export interface UserOnboardingStateModel {
  error: string | null;
  loading: boolean;
  userOnboardingList: OnboardingChartModel[];
  userRoleBasedList: UserRoleBasedListModel[];
}
