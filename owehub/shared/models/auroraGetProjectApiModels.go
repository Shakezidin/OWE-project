/**************************************************************************
 *	File            : auroraApiModels.go
 * 	DESCRIPTION     : This file contains models for aurora apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type AuroraGetProjectRequest struct {
	LeadsId int64 `json:"leads_id"`
}
