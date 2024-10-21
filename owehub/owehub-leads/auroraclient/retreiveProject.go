/**************************************************************************
 *	File            : retreiveProject.go
 * 	DESCRIPTION     : This file contains api calls to retreive a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetreiveProjectApi struct {
	ProjectId string `json:"project_id"`
}

type RetreiveProjectApiResponse struct {
	Project map[string]interface{} `json:"project"`
}

/******************************************************************************
 * FUNCTION:        RetreiveProjectApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			RetreiveProjectApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetreiveProjectApi) Call() (*RetreiveProjectApiResponse, error) {
	var (
		err      error
		respBody RetreiveProjectApiResponse
	)

	log.EnterFn(0, "RetreiveProjectApi.Call")
	defer log.ExitFn(0, "RetreiveProjectApi.Call", err)

	// validate required fields
	if api.ProjectId == "" {
		err = fmt.Errorf("cannot retreive project without ProjectId")
		return nil, err
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/projects/%s", api.ProjectId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retreiving project")
	}

	return &respBody, nil
}
