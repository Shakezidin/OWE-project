import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const ApDedColumn: Column[] = [
  {
    name: 'unique_id',
    displayName: 'Unique ID',
    type: 'string',
    isCheckbox: true,
  },
  { name: 'payee', displayName: 'Payee', type: 'string', isCheckbox: false },
  {
    name: 'amount',
    displayName: 'Amount',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'Date',
    displayName: 'Date',
    type: 'date',
    isCheckbox: false,
  },
  {
    name: 'Short_code',
    displayName: 'Short Code',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'Description',
    displayName: 'Description',
    type: 'string',
    isCheckbox: false,
  },

  {
    name: 'notes',
    displayName: 'Notes',
    type: 'string',
    isCheckbox: false,
  },
 
];
