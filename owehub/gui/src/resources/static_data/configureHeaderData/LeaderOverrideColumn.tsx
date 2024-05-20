import { Column } from '../../../core/models/data_models/FilterSelectModel';
export const LeaderOverrideColumns: Column[] = [
  {
    name: 'team_name',
    displayName: 'Team Name',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'unique_id',
    displayName: 'Unique Id',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'leader_name',
    displayName: 'Leader Name',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'type', displayName: 'Type', type: 'string', isCheckbox: false },
  { name: 'term', displayName: 'Term', type: 'string', isCheckbox: false },
  { name: 'qual', displayName: 'Qual', type: 'string', isCheckbox: false },
  {
    name: 'sales_q',
    displayName: 'Sales Q',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'team_kw_q',
    displayName: 'Team kW Q',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'pay_rate',
    displayName: 'Pay Rate',
    type: 'string',
    isCheckbox: false,
  },
  { name: 'start_date', displayName: 'Start Date', type: 'string', isCheckbox: false },
  { name: 'end_date', displayName: 'End Date', type: 'string', isCheckbox: false },
];
