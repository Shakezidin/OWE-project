import { Column } from '../../../core/models/data_models/FilterSelectModel';
export const DbaColumn: Column[] = [
  {
    name: 'record_id',
    displayName: 'Record ID',
    type: 'number',
    isCheckbox: true,
  },
  {
    name: 'preferred_name',
    displayName: 'Preferred Name',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'dba',
    displayName: 'DBA',
    type: 'string',
    isCheckbox: false,
  },
];
