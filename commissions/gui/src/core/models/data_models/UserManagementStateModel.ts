import {
  CreateUserModel,
  OnboardingChartModel,
  UserDropdownModel,
  UserRoleBasedListModel,
} from "../api_models/UserManagementModel";

export interface UserOnboardingStateModel {
  error: string | null;
  loading: boolean;
  userOnboardingList: OnboardingChartModel[];
  userRoleBasedList: UserRoleBasedListModel[];
}

export interface CreateOnboardUserStateModel {
  error: string | null;
  loading: boolean;
  formData: CreateUserModel;
  dealerOwenerList: UserDropdownModel[];
}
