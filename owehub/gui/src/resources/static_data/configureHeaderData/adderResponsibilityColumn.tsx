import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const AdderResponsibilityColumns: Column[] = [

  {
    name: 'unique_id',
    displayName: 'Unique id',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'payscale',
    displayName: 'Pay Scale',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'percentage',
    displayName: 'Percentage',
    type: 'string',
    isCheckbox: false,
  },
];
