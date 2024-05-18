import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const ApptSettersColumn: Column[] = [
  { name: 'name', displayName: 'Name', type: 'string', isCheckbox: true },
  { name: 'team', displayName: 'Team', type: 'string', isCheckbox: false },
  {
    name: 'pay_rate',
    displayName: 'Pay Rate',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'start', displayName: 'Start', type: 'string', isCheckbox: false },
  { name: 'end', displayName: 'End', type: 'string', isCheckbox: false },
];
