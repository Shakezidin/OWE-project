import { Column } from '../../../core/models/data_models/FilterSelectModel';

export const AdderCreditsColumn: Column[] = [
  {
    name: 'payscale',
    displayName: 'Pay Scale',
    type: 'string',
    isCheckbox: true,
  },
  { name: 'type', displayName: 'Type', type: 'string', isCheckbox: false },
  { name: 'max$', displayName: 'Max $', type: 'string', isCheckbox: false },
  { name: 'max%', displayName: 'Max %', type: 'string', isCheckbox: false },
];
