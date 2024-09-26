/**************************************************************************
*	Function	: 	SentAppointmentModels.go
*	DESCRIPTION : 	Files contains struct for sent appointment data models
*	DATE        : 	20-sept-2024
**************************************************************************/

package models

type GetSentAppointmentRequest struct {
	AppointmentDate string `json:"appointment_date"`
	AppointmentTime string `json:"appointment_time"`
	LeadsId         int    `json:"leads_id"`
}
