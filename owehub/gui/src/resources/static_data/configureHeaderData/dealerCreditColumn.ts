import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const DealerCreditColumn: Column[] = [
  // { name: "record_id", displayName: "Record ID", type: "number" },
  {
    name: 'unique_id',
    displayName: 'uniqueId',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'date',
    displayName: 'Date',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'exact_amt',
    displayName: 'Exact Amt',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'per_kw_amt',
    displayName: 'Per KW Amt',
    type: 'string',
    isCheckbox: false,
  },
  
  {
    name: 'approved_by',
    displayName: 'Approved By',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'notes', displayName: 'Notes', type: 'string', isCheckbox: false },
  {
    name: 'total_amt',
    displayName: 'Total Amt.',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'sys_size',
    displayName: 'Sys Size',
    type: 'string',
    isCheckbox: false,
  },
  
];
