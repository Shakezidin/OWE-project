/**************************************************************************
 *	Function	: apiGetPeriodicWonLostLeads.go
 *	DESCRIPTION : Files contains struct for get performance tile data models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPeriodicWonLostLeadsRequest struct {
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type GetPeriodicWonLostLeads struct {
	WonCount    int64  `json:"won_count"`
	LostCount   int64  `json:"lost_count"`
	PeriodLabel string `json:"period_label"`
}

type GetPeriodicWonLostLeadsList struct {
	PeriodicList []GetPeriodicWonLostLeads `json:"periodic_list"`
}
