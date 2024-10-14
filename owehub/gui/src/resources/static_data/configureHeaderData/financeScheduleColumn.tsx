import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const FinanceScheduleColumn: Column[] = [
  // { name: "record_id", displayName: "Record ID", type: "number" },
  {
    name: 'finance_company',
    displayName: 'Finance Company',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'finance_type_ref',
    displayName: 'Finance Type Ref',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'state',
    displayName: 'State',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'active_state_date',
    displayName: 'Active Start Date',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'active_end_date',
    displayName: 'Active End Date',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'finance_fee',
    displayName: 'Finance Fee',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'finance_type',
    displayName: 'Finance Type',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'finance_type_uid',
    displayName: 'Finance Type uid',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'owe_finance_fee',
    displayName: 'Owe Finance Fee',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'commissions_rate',
    displayName: 'Commissions Rate',
    type: 'string',
    isCheckbox: false,
  },
];
