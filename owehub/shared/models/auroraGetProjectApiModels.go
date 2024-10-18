/**************************************************************************
 *	File            : auroraApiModels.go
 * 	DESCRIPTION     : This file contains models for aurora apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type AuroraGetProjectRequest struct {
	LeadsId int64 `json:"leads_id"`
}

type AuroraListModulestRequest struct {
	PageNumber int64 `json:"page_number"`
	PageSize   int64 `json:"page_size"`
}

type AuroraRetrieveModulestRequest struct {
	ModuleId string `json:"module_id"`
}

type AuroraRetrieveWebProposaltRequest struct {
	LeadsId int64 `json:"leads_id"`
}
