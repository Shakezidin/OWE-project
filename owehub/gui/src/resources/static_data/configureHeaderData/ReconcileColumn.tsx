import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const ReconcileColumns: Column[] = [
  {
    name: 'unique_id',
    displayName: 'Unique ID',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'customer',
    displayName: 'Customer Name',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'partner_name',
    displayName: 'Partner',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'state_name',
    displayName: 'State',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'sys_size',
    displayName: 'Sys. Size',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'status', displayName: 'Status', type: 'string', isCheckbox: false },
  {
    name: 'start_date',
    displayName: 'Start Date',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'end_date',
    displayName: 'End Date',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'amount', displayName: 'Amount', type: 'string', isCheckbox: false },
  { name: 'note', displayName: 'Notes', type: 'string', isCheckbox: false },
];
