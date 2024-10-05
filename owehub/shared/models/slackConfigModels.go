/**************************************************************************
*	Function	: 		slackConfigModel.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										Slack Config data models
*	DATE        : 	17-Aug-2024
**************************************************************************/

package models

type CreateSlackConfig struct {
	IssueType     string `json:"issue_type"`
	ChannelId     string `json:"channel_id"`
	ChannelName   string `json:"channel_name"`
	BotToken      string `json:"bot_token"`
	SlackAppToken string `json:"slack_app_token"`
}

type GetSlackConfigRequest struct {
	PageNumber int `json:"page_number"`
	PageSize   int `json:"page_size"`
}

type GetSlackConfig struct {
	RecordId      int64  `json:"record_id"`
	IssueType     string `json:"issue_type"`
	ChannelId     string `json:"channel_id"`
	ChannelName   string `json:"channel_name"`
	BotToken      string `json:"bot_token"`
	SlackAppToken string `json:"slack_app_token"`
}

type GetSlackConfigList struct {
	SlackConfigList []GetSlackConfig `json:"slack_config_list"`
}

type UpdateSlackConfig struct {
	RecordId      int    `json:"record_id"`
	IssueType     string `json:"issue_type"`
	ChannelName   string `json:"channel_name"`
	ChannelId     string `json:"channel_id"`
	BotToken      string `json:"bot_token"`
	SlackAppToken string `json:"slack_app_token"`
}

type DeleteSlackConfig struct {
	RecordId []int64 `json:"record_id"`
}

type ArchiveSlackConfig struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
