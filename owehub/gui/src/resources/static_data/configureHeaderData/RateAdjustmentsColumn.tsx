import { Column } from '../../../core/models/data_models/FilterSelectModel';
export const RateAdjustmentsColumns: Column[] = [
  {
    name: 'pay_scale',
    displayName: 'Pay Scale',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'position',
    displayName: 'Position',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'adjustment',
    displayName: 'Adjustment',
    type: 'string',
    isCheckbox: false,
  },
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
