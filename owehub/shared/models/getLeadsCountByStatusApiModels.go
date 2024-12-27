/**************************************************************************
* File			: getLeadsCountByStatusApiModels.go
* DESCRIPTION	: This file contains models for get leads count by status api
* DATE			: 19-sept-2024
**************************************************************************/

package models

type GetLeadsCountByStatusRequest struct {
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type GetLeadsCountByStatus struct {
	Count      int64  `json:"count"`
	StatusName string `json:"status_name"`
}

type GetLeadsCountByStatusList struct {
	Leads []GetLeadsCountByStatus `json:"leads"`
}
