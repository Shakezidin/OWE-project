import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const DlrOthPayColumn: Column[] = [
  // { name: "record_id", displayName: "Record ID", type: "number" },
  {
    name: 'unique_id',
    displayName: 'Unique Id',
    type: 'string',
    isCheckbox: true,
  },
  { name: 'payee', displayName: 'Payee', type: 'string', isCheckbox: false },
  { name: 'amount', displayName: 'Amount', type: 'number', isCheckbox: false },
  {
    name: 'description',
    displayName: 'Description',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'balance',
    displayName: 'Balance',
    type: 'number',
    isCheckbox: false,
  },
  {
    name: 'paid_amount',
    displayName: 'Paid Amt',
    type: 'number',
    isCheckbox: false,
  },
  {
    name: 'start_date',
    displayName: 'Start Date',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'end_date',
    displayName: 'End Date',
    type: 'date',
    isCheckbox: false,
  },
];
