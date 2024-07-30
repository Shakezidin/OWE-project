import {
  CreateUserModel,
  CreateUserParamModel,
} from '../core/models/api_models/UserManagementModel';
import { TYPE_OF_USER } from '../resources/static_data/Constant';

// validationUtils.ts
export const validateName = (name: string): boolean => {
  return /^[A-Za-z0-9\s\-_.,!@#$%^&*()+=?<>{}[\]:;"'|\\]+$/.test(name.trim());
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

export const validateMobileNumber = (mobileNumber: string): boolean => {
  return /^\+?[0-9]{10,16}$/.test(mobileNumber.trim());
};

export const validateForm = (
  formData: CreateUserModel
): { [key: string]: boolean } => {
  const errors: { [key: string]: boolean } = {};
if(formData.role_name  !== 'Partner'){
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
}
  if (formData.role_name.length === 0) {
    errors.Role = true;
  }

  // if (
  //   formData.role_name === TYPE_OF_USER.APPOINTMENT_SETTER 
  // ) {
  //   if (formData.assigned_dealer_name.length === 0) {
  //     errors.DealerOwner = true;
  //   }
  // }

  // if (formData.role_name === TYPE_OF_USER.REGIONAL_MANGER) {
  //   if (formData.assigned_dealer_name.length === 0) {
  //     errors.DealerOwner = false;
  //   } else if (formData.add_region.length === 0) {
  //     errors.Region = true;
  //   }
  // }

  // if (formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE) {
  //   if (formData.assigned_dealer_name.length === 0) {
  //     errors.DealerOwner = false;
  //   } else if (formData.report_to.length === 0) {
  //     errors.ReportTo = true;
  //   }
  //   //  else if (formData.team_name.length === 0) {
  //   //   errors.Team_name = true;
  //   // }
  // }
  // if (formData.role_name === TYPE_OF_USER.SALE_MANAGER) {
  //   if (formData.assigned_dealer_name.length === 0) {
  //     errors.DealerOwner = false;
  //   } else if (formData.report_to.length === 0) {
  //     errors.ReportTo = true;
  //   }
  // }
  // Add more validations for other fields

  return errors;
};

/** create user object */
export const createUserObject = (
  formData: CreateUserModel
): CreateUserParamModel => {
  let createObject: CreateUserParamModel = {
    name: formData.first_name + ' ' + formData.last_name,
    email_id: formData.email_id,
    mobile_number: formData.mobile_number,
    role_name: formData.role_name,
    designation: 'SE',
    description: formData.description,
  };
  if (
    formData.role_name === TYPE_OF_USER.APPOINTMENT_SETTER 
    
  ) {
    createObject = {
      ...createObject,
      dealer_owner: formData.dealer,
      reporting_manager: formData.report_to,
      team_name: formData.team_name,
    };
  }

  if (formData.role_name === TYPE_OF_USER.REGIONAL_MANGER) {
    createObject = {
      ...createObject,
      dealer_owner: formData.dealer,
      reporting_manager: formData.report_to,
      region: formData.add_region, //TODO: need to discuss
    };
  }

  if (formData.role_name === TYPE_OF_USER.SALES_REPRESENTATIVE) {
    createObject = {
      ...createObject,
      dealer_owner: formData.dealer,
      reporting_manager: formData.report_to,
      team_name: formData.team_name,
    };
  }
  if (formData.role_name === TYPE_OF_USER.SALE_MANAGER) {
    createObject = {
      ...createObject,
      dealer_owner: formData.dealer,
      reporting_manager: formData.report_to,
    };
  }
  if (formData.role_name === TYPE_OF_USER.DEALER_OWNER) {
    createObject = {
      ...createObject,
      dealer_logo: formData?.dealer_logo,
      dealer: formData.dealer,
    };
  }

  return createObject;
};
