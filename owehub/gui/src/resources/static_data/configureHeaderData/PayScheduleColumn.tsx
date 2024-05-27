import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const PayScheduleColumns: Column[] = [
  // { name: "record_id", displayName: "Record ID", type: "number" },

  { name: 'partner', displayName: 'Partner', type: 'string', isCheckbox: true },
  {
    name: 'partner_name',
    displayName: 'Partner Name',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'installer_name',
    displayName: 'Installer Name',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'sale_type',
    displayName: 'Sale Type',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'state', displayName: 'State', type: 'string', isCheckbox: false },
  { name: 'rl', displayName: 'Rate List', type: 'string', isCheckbox: false },
  { name: 'draw', displayName: 'Draw', type: 'string', isCheckbox: false },
  {
    name: 'draw_max',
    displayName: 'Draw Max',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'rep_draw',
    displayName: 'rep_draw',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'rep_draw_max',
    displayName: 'rep_draw_max',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'rep_pay',
    displayName: 'rep_pay',
    type: 'string',
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
