/**************************************************************************
 *	File            : retrieveModule.go
 * 	DESCRIPTION     : This file contains api calls to retrieve module in aurora
 *	DATE            : 15-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetrieveModuleApi struct {
	ModuleId string `json:"module_id"`
}

/******************************************************************************
 * FUNCTION:        RetrieveModuleApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			List ModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetrieveModuleApi) Call() (*interface{}, error) {
	var (
		err      error
		respBody interface{}
	)

	log.EnterFn(0, "RetrieveModuleApi.Call")
	defer log.ExitFn(0, "RetrieveModuleApi.Call", err)

	endPt := fmt.Sprintf("/tenants/{tenant_id}/components/modules/%s", api.ModuleId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retrieving modules")
	}

	return &respBody, nil
}
