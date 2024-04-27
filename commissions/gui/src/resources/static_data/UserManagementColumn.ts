import { Column } from "../../core/models/data_models/FilterSelectModel";

export const UserManagementTableColumn: Column[] = [
  { name: "code", displayName: "Code", type: "string", isCheckbox: true },
  { name: "name", displayName: "Name", type: "string", isCheckbox: false },
  { name: "role", displayName: "Role", type: "string", isCheckbox: false },
  {
    name: "reporting_to",
    displayName: "Reporting To",
    type: "string",
    isCheckbox: false,
  },
  {
    name: "email",
    displayName: "Email",
    type: "string",
    isCheckbox: false,
  },
  {
    name: "phone_number",
    displayName: "Phone Number",
    type: "string",
    isCheckbox: false,
  },

  {
    name: "description",
    displayName: "Description",
    type: "string",
    isCheckbox: false,
  },
];

export const UserAppointmentTableColumn: Column[] = [
  { name: "code", displayName: "Code", type: "string", isCheckbox: true },
  { name: "name", displayName: "Name", type: "string", isCheckbox: false },
  {
    name: "start_date",
    displayName: "Start Date",
    type: "string",
    isCheckbox: false,
  },
  {
    name: "end_date",
    displayName: "End Date",
    type: "string",
    isCheckbox: false,
  },
  {
    name: "pay_rate",
    displayName: "Pay Rate",
    type: "string",
    isCheckbox: false,
  },
  {
    name: "description",
    displayName: "Description",
    type: "string",
    isCheckbox: false,
  },
];

export const UserPatternTableColumn: Column[] = [
  { name: "code", displayName: "Code", type: "string", isCheckbox: true },
  { name: "name", displayName: "Name", type: "string", isCheckbox: false },
  {
    name: "details",
    displayName: "Details",
    type: "string",
    isCheckbox: false,
  },
];
