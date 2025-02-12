/**************************************************************************
 *	File            : retrieveDesignSummary.go
 * 	DESCRIPTION     : This file contains api calls to retrieve design summary in aurora
 *	DATE            : 11-Feb-2025
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetrieveDesignSummaryApi struct {
	Id string `json:"id"`
}

/******************************************************************************
 * FUNCTION:        RetrieveModuleApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			List ModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetrieveDesignSummaryApi) Call() (*interface{}, error) {
	var (
		err      error
		respBody interface{}
	)

	log.EnterFn(0, "RetrieveDesignSummaryApi.Call")
	defer log.ExitFn(0, "RetrieveDesignSummaryApi.Call", err)

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/summary", api.Id)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retrieving Design Summary Components")
	}

	return &respBody, nil
}
