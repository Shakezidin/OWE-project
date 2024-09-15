import { Column } from '../../../core/models/data_models/FilterSelectModel';
export const SlackColumn: Column[] = [
  {
    name: 'issue_type',
    displayName: 'Issue Type',
    type: 'string',
    isCheckbox: true,
  },
  {
    name: 'channel_name',
    displayName: 'Channel Name',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'channel_id',
    displayName: 'Channel ID',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'bot_token',
    displayName: 'Bot Token',
    type: 'string',
    isCheckbox: false,
  },
  {
    name: 'slack_app_token',
    displayName: 'Slack App token',
    type: 'string',
    isCheckbox: false,
  },
];
