import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const AdderCreditsColumn: Column[] = [
  {
    name: 'unique_id',
    displayName: 'Unique ID',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'pay_scale',
    displayName: 'Pay Scale',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'type', displayName: 'Type', type: 'string', isCheckbox: false },
  {
    name: 'min_rate',
    displayName: 'Min Rate',
    type: 'number',
    isCheckbox: false,
  },
  {
    name: 'max_rate',
    displayName: 'Max Rate',
    type: 'number',
    isCheckbox: false,
  },
];
