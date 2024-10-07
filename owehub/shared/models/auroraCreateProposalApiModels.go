/**************************************************************************
 *	File            : auroraApiModels.go
 * 	DESCRIPTION     : This file contains models for aurora apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type AuroraCreateProposalRequest struct {
	LeadsId               int64    `json:"leads_id"`
	ProjectName           string   `json:"project_name,omitempty"`
	CustomerSalutation    string   `json:"customer_salutation"`
	Status                string   `json:"status"`
	PreferredSolarModules []string `json:"preferred_solar_modules"`
	Tags                  []string `json:"tags"`
}
