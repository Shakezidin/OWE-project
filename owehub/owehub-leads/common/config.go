/**************************************************************************
 *	File            : aurora.go
 * 	DESCRIPTION     : This file contains common aurora config and helpers
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

type LeadAppConfig struct {
	AuroraTenantId         string `json:"tenantId"`
	AuroraBearerToken      string `json:"bearerToken"`
	AuroraApiBaseUrl       string `json:"apiBaseUrl"`
	AppointmentSenderEmail string `json:"appointmentSenderEmail"`
}

var LeadAppCfg LeadAppConfig
