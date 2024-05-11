import {
  CreateUserModel,
  CreateUserParamModel,
} from "../core/models/api_models/UserManagementModel";

// validationUtils.ts
export const validateName = (name: string): boolean => {
  return /^[A-Za-z\s\-_.,!@#$%^&*()+=?<>{}[\]:;"'|\\]+$/.test(name.trim());
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateMobileNumber = (mobileNumber: string): boolean => {
  return /^[0-9]{10,13}$/.test(mobileNumber.trim());
};
export const validateForm = (
  formData: CreateUserModel
): { [key: string]: boolean } => {
  const errors: { [key: string]: boolean } = {};

  if (!validateName(formData.first_name)) {
    errors.FirstName = true;
  }

  if (!validateName(formData.last_name)) {
    errors.LastName = true;
  }

  if (!validateEmail(formData.email_id)) {
    errors.Email = true;
  }

  if (!validateMobileNumber(formData.mobile_number)) {
    errors.PhoneNumber = true;
  }
  if (formData.role_name.length === 0) {
    errors.Role = true;
  }

  if (
    formData.role_name === "Appointment Setter" ||
    formData.role_name === "Patner"
  ) {
    if (formData.assigned_dealer_name.length === 0) {
      errors.DealerOwner = true;
    }
  }

  if (formData.role_name === "Regional Manager") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.DealerOwner = true;
    } else if (formData.add_region.length === 0) {
      errors.Region = true;
    }
  }

  if (formData.role_name === "Sale Representative") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.DealerOwner = true;
    } else if (formData.report_to.length === 0) {
      errors.ReportTo = true;
    } else if (formData.team_name.length === 0) {
      errors.Team_name = true;
    }
  }
  if (formData.role_name === "Sales Manager") {
    if (formData.assigned_dealer_name.length === 0) {
      errors.DealerOwner = true;
    } else if (formData.report_to.length === 0) {
      errors.ReportTo = true;
    }
  }
  // Add more validations for other fields

  return errors;
};

/** create user object */
export const createUserObject = (
  formData: CreateUserModel
): CreateUserParamModel => {
  let createObject: CreateUserParamModel = {
    name: formData.first_name + " " + formData.last_name,
    email_id: formData.email_id,
    mobile_number: formData.mobile_number,
    role_name: formData.role_name,
    designation: "SE",
    description: formData.description,
  };
  if (
    formData.role_name === "Appointment Setter" ||
    formData.role_name === "Patner"
  ) {
    createObject = {
      ...createObject,
      dealer_owner: formData.assigned_dealer_name,
    };
  }

  if (formData.role_name === "Regional Manager") {
    createObject = {
      ...createObject,
      dealer_owner: formData.assigned_dealer_name,
      region: formData.add_region, //TODO: need to discuss
    };
  }

  if (formData.role_name === "Sale Representative") {
    createObject = {
      ...createObject,
      dealer_owner: formData.assigned_dealer_name,
      reporting_manager: formData.report_to,
      team_name: formData.team_name,
    };
  }
  if (formData.role_name === "Sales Manager") {
    createObject = {
      ...createObject,
      dealer_owner: formData.assigned_dealer_name,
      reporting_manager: formData.report_to,
    };
  }
  //console.log("createObject", createObject);
  return createObject;
};
