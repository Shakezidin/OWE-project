/**************************************************************************
 *	File            : createProject.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type CreateProjectApi struct {
	ExternalProviderId    string                   `json:"external_provider_id"`
	Name                  string                   `json:"name"`
	CustomerSalutation    string                   `json:"customer_salutation"`
	CustomerFirstName     string                   `json:"customer_first_name"`
	CustomerLastName      string                   `json:"customer_last_name"`
	CustomerEmail         string                   `json:"customer_email"`
	CustomerPhone         string                   `json:"customer_phone"`
	MailingAddress        string                   `json:"mailing_address"`
	OwnerId               string                   `json:"owner_id,omitempty"`
	TeamId                string                   `json:"team_id,omitempty"`
	Status                string                   `json:"status"`
	ProjectType           string                   `json:"project_type"`
	PreferredSolarModules []string                 `json:"preferred_solar_modules"`
	Tags                  []string                 `json:"tags"`
	PartnerId             string                   `json:"partner_id,omitempty"`
	Location              CreateProjectApiLocation `json:"location"`
}
type CreateProjectApiLocation struct {
	PropertyAddress string `json:"property_address"`
}

type CreateProjectApiResponse struct {
	Project map[string]interface{} `json:"project"`
}

/******************************************************************************
 * FUNCTION:        CreateProjectApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:
 * RETURNS:         *CreateProjectApiResponse, error
 ******************************************************************************/
func (api *CreateProjectApi) Call() (*CreateProjectApiResponse, error) {
	var (
		err      error
		respBody CreateProjectApiResponse
	)

	log.EnterFn(0, "CreateProjectApi.Call")
	defer log.ExitFn(0, "CreateProjectApi.Call", err)

	// validate required fields
	if api.ExternalProviderId == "" {
		err = fmt.Errorf("cannot create project without ExternalProviderId")
		return nil, err
	}
	if api.Name == "" {
		err = fmt.Errorf("cannot create project without Name")
		return nil, err
	}
	if api.CustomerSalutation == "" {
		err = fmt.Errorf("cannot create project without CustomerSalutation")
		return nil, err
	}
	if api.CustomerFirstName == "" {
		err = fmt.Errorf("cannot create project without CustomerFirstName")
		return nil, err
	}
	if api.CustomerLastName == "" {
		err = fmt.Errorf("cannot create project without CustomerLastName")
		return nil, err
	}
	if api.CustomerEmail == "" {
		err = fmt.Errorf("cannot create project without CustomerEmail")
		return nil, err
	}
	if api.CustomerPhone == "" {
		err = fmt.Errorf("cannot create project without CustomerPhone")
		return nil, err
	}
	if api.MailingAddress == "" {
		err = fmt.Errorf("cannot create project without MailingAddress")
		return nil, err
	}
	if api.Status == "" {
		err = fmt.Errorf("cannot create project without Status")
		return nil, err
	}
	if api.PreferredSolarModules == nil {
		err = fmt.Errorf("cannot create project without PreferredSolarModules")
		return nil, err
	}
	if api.Tags == nil {
		err = fmt.Errorf("cannot create project without Tags")
		return nil, err
	}
	if api.Location.PropertyAddress == "" {
		err = fmt.Errorf("cannot create project without Location.PropertyAddress")
		return nil, err
	}
	if api.ProjectType != "commertial" && api.ProjectType != "residential" {
		err = fmt.Errorf("cannot create project with invalid project type")
		return nil, err
	}

	reqBody := map[string]*CreateProjectApi{
		"project": api,
	}

	err = callApi(http.MethodPost, "/tenants/{tenant_id}/projects", reqBody, &respBody)
	if err != nil {
		return nil, errors.New("server side error when creating project")
	}

	return &respBody, nil
}
