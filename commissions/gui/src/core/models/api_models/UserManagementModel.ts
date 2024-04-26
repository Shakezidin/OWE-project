export interface UserOnboardingModel {
  role_name: string;
  user_count: number;
}

export interface OnboardingChartModel {
  name: string;
  value: number;
  fill: string;
}

export interface UserDropdownModel {
  label: string;
  value: string;
}

export interface DealerOwner {
  role: string;
  name?: string;
  sub_role?: string;
}

export interface UserRoleBasedListModel {
  name: string;
  user_code: string;
  email_id: string;
  mobile_number: string;
  designation: string;
  role_name: string;
  password_change_required: boolean;
  reporting_manager: string;
  dealer_owner: string;
  user_status: string;
  description: string;
  street_address: string;
  state: string;
  city: string;
  zipcode: string;
  country: string;
  startData: string;
  endDate: string;
  amount: string;
  region: string;
}

export interface CreateUserModel {
  first_name: string;
  last_name: string;
  email_id: string;
  mobile_number: string;
  assigned_dealer_name: string;
  role_name: string;
  add_region: string;
  team_name: string;
  description: string;
  report_to: string;
}

export interface CreateUserParamModel {
  name: string;
  email_id: string;
  mobile_number: string;
  designation: string;
  role_name: string;
  reporting_manager: string;
  dealer_owner: string;
  description: string;
}
