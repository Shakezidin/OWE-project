import { CreateUserModel } from "../core/models/api_models/UserManagementModel";

// validationUtils.ts
export const validateName = (name: string): boolean => {
  return /^[A-Za-z\s]+$/.test(name.trim());
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateMobileNumber = (mobileNumber: string): boolean => {
  return /^[0-9]{10}$/.test(mobileNumber.trim());
};

export const validateForm = (
  formData: CreateUserModel
): { [key: string]: boolean } => {
  const errors: { [key: string]: boolean } = {};

  if (!validateName(formData.first_name)) {
    errors.name = true;
  }

  if (!validateName(formData.last_name)) {
    errors.name = true;
  }

  if (!validateEmail(formData.email_id)) {
    errors.email = true;
  }

  if (!validateMobileNumber(formData.mobile_number)) {
    errors.mobileNumber = true;
  }
  if (formData.role_name.length === 0) {
    errors.role_name = true;
  }

  if (
    formData.role_name === "Appointment Setter" ||
    formData.role_name === "Patner"
  ) {
    if (formData.assigned_dealer_name.length === 0) {
      errors.assigned_dealer_name = true;
    }
  }

  if (formData.role_name === "Regional Manager") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.assigned_dealer_name = true;
    } else if (formData.add_region.length === 0) {
      errors.add_region = true;
    }
  }

  if (formData.role_name === "Sale Representative") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.assigned_dealer_name = true;
    } else if (formData.report_to.length === 0) {
      errors.report_to = true;
    } else if (formData.team_name.length === 0) {
      errors.team_name = true;
    }
  }
  if (formData.role_name === "Sales Manager") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.assigned_dealer_name = true;
    } else if (formData.report_to.length === 0) {
      errors.report_to = true;
    }
  }
  // Add more validations for other fields

  return errors;
};
