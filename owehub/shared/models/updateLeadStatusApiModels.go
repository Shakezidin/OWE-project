/**************************************************************************
* File			: updateLeadStatusApiModels.go
* DESCRIPTION	: This file contains models for UpdateLeadStatus handler
* DATE			: 27-Sept-2024
**************************************************************************/

package models

type UpdateLeadStatusRequest struct {
	LeadsId               int64  `json:"leads_id"`
	StatusId              int64  `json:"status_id"`
	Reason                string `json:"reason"`
	AppointmentDateTime   string `json:"appointment_date_time"`
	IsAppointmentRequired bool   `json:"is_appointment_required"`
	IsManualWin           bool   `json:"is_manual_win"`
}

type UpdateLeadStatusResponse struct {
	AppointmentDateTime string `json:"appointment_date_time"`
}
