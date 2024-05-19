import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const ARScheduleColumns: Column[] = [
  { name: 'partner_name', displayName: 'Partner', type: 'string', isCheckbox: true },
  {
    name: 'installer_name',
    displayName: 'Installer',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'sale_type',
    displayName: 'Sale Type',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'state_name', displayName: 'State', type: 'string', isCheckbox: false },
  {
    name: 'red_line',
    displayName: 'Red Line',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'calc_date',
    displayName: 'Calc Date',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'permit_pay',
    displayName: 'Permit Pay',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'permit_max',
    displayName: 'Permit Max',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'install_pay',
    displayName: 'Install Pay',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'pto_pay',
    displayName: 'PTO Pay',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'start_date',
    displayName: 'Start Date',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'end_date', displayName: 'End Date', type: 'string', isCheckbox: false },
];
