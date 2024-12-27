/**************************************************************************
 *	File            : createDesign.go
 * 	DESCRIPTION     : This file contains api calls to create a design in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type CreateDesignApi struct {
	ExternalProviderId string `json:"external_provider_id"`
	ProjectId          string `json:"project_id"`
	Name               string `json:"name"`
}

type CreateDesignApiResponse struct {
	Design map[string]interface{} `json:"design"`
}

/******************************************************************************
 * FUNCTION:        CreateDesignApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			CreateDesignApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *CreateDesignApi) Call() (*CreateDesignApiResponse, error) {
	var (
		err      error
		respBody CreateDesignApiResponse
	)

	log.EnterFn(0, "CreateDesignApi.Call")
	defer log.ExitFn(0, "CreateDesignApi.Call", err)

	// validate required fields
	if api.ExternalProviderId == "" {
		err = fmt.Errorf("cannot create design without ExternalProviderId")
		return nil, err
	}
	if api.ProjectId == "" {
		err = fmt.Errorf("cannot create design without ProjectId")
		return nil, err
	}
	if api.Name == "" {
		err = fmt.Errorf("cannot create design without Name")
		return nil, err
	}

	reqBody := map[string]*CreateDesignApi{
		"design": api,
	}
	err = callApi(http.MethodPost, "/tenants/{tenant_id}/designs", reqBody, &respBody)
	if err != nil {
		return nil, errors.New("server side error when creating design")
	}

	return &respBody, nil
}
