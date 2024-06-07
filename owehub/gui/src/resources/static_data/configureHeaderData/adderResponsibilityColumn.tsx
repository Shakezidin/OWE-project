import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const AdderResponsibilityColumns: Column[] = [
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
  {
    name: 'percentage',
    displayName: 'Percentage',
    type: 'number',
    isCheckbox: false,
  },
];
