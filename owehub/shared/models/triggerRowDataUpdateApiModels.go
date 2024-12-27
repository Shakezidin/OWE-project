/**************************************************************************
 * File			: triggerRowDataUpdateApiModels.go
 * DESCRIPTION	: This file contains models for trigger row data update API
 * DATE			: 22-May-2024
 **************************************************************************/

package models

type TriggerRowDataUpdateRequest struct {
	SecretKey string   `json:"secret_key"`
	TableName string   `json:"table_name"`
	RecordIds []string `json:"record_ids"`
	Action    string   `json:"action"`
}
