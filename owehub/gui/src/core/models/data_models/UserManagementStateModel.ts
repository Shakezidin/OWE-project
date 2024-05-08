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
  totalCount?:number
}

export interface CreateOnboardUserStateModel {
  error: string | null | any;
  loading: boolean;
  formData: CreateUserModel;
  dealerOwenerList: UserDropdownModel[];
  regionList: UserDropdownModel[];
  createUserResult: any | null;
  deleteUserResult: any | null;
}
