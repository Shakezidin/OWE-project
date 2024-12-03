/**************************************************************************
 *	File            : updateProject.go
 * 	DESCRIPTION     : This file contains api calls to update a project in aurora
 *	DATE            : 02-Sep-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type UpdateProjectApi struct {
	ProjectId         string `json:"project_id"`
	CustomerFirstName string `json:"customer_first_name"`
	CustomerLastName  string `json:"customer_last_name"`
	CustomerPhone     string `json:"customer_phone"`
	CustomerEmail     string `json:"customer_email"`
	MailingAddress    string `json:"mailing_address"`
}

type UpdateProjectApiResponse struct {
	Project map[string]interface{} `json:"project"`
}

/******************************************************************************
 * FUNCTION:        updateProjectApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:
 * RETURNS:         *UpdateProjectApiResponse, error
 ******************************************************************************/
func (api *UpdateProjectApi) Call() (*UpdateProjectApiResponse, error) {
	var (
		err      error
		respBody UpdateProjectApiResponse
	)

	log.EnterFn(0, "UpdateProjectApi.Call")
	defer log.ExitFn(0, "UpdateProjectApi.Call", err)

	// validate required fields
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

	endPt := fmt.Sprintf("/tenants/{tenant_id}/projects/%s", api.ProjectId)

	reqBody := map[string]*UpdateProjectApi{
		"project": api,
	}

	err = callApi(http.MethodPut, endPt, reqBody, &respBody)
	if err != nil {
		return nil, errors.New("server side error when updating project")
	}

	return &respBody, nil
}
