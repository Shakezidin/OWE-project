/**************************************************************************
 *	File            : auroraApiModels.go
 * 	DESCRIPTION     : This file contains models for aurora apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type AuroraCreateProjectRequest struct {
	LeadsId               int64    `json:"leads_id"`
	ProjectName           string   `json:"project_name,omitempty"`
	ProjectType           string   `json:"project_type"`
	CustomerSalutation    string   `json:"customer_salutation"`
	Status                string   `json:"status"`
	PreferredSolarModules []string `json:"preferred_solar_modules"`
	Tags                  []string `json:"tags"`
}

type AuroraCreateDesignRequest struct {
	ProjectName string `json:"project_name,omitempty"`
	LeadsId     int64  `json:"leads_id"`
}

type AuroraCreateProposalRequest struct {
	LeadsId int64 `json:"leads_id"`
}

type AuroraGetProjectRequest struct {
	LeadsId int64 `json:"leads_id"`
}

type AuroraGetProposalRequest struct {
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

type AuroraGenerateWebProposalRequest struct {
	LeadsId int64 `json:"leads_id"`
}

type AuroraUpdateProjectRequest struct {
	LeadId        int64  `json:"leads_id"`
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	PhoneNumber   string `json:"phone_number"`
	EmailId       string `json:"email_id"`
	StreetAddress string `json:"street_address"`
}
