/**************************************************************************
 *	File            : listModules.go
 * 	DESCRIPTION     : This file contains api calls to list module in aurora
 *	DATE            : 15-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type ListModuleApi struct {
	PageNumber int64 `json:"page_number"`
	PageSize   int64 `json:"page_size"`
}

type ListModuleApiResponse struct {
	Modules []interface{} `json:"modules"`
}

/******************************************************************************
 * FUNCTION:        ListModuleApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			ListModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *ListModuleApi) Call() (*ListModuleApiResponse, error) {
	var (
		err      error
		respBody ListModuleApiResponse
	)

	log.EnterFn(0, "ListModuleApi.Call")
	defer log.ExitFn(0, "ListModuleApi.Call", err)

	endPt := fmt.Sprintf("/tenants/{tenant_id}/components/modules?page=%d&per_page=%d", api.PageNumber, api.PageSize)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when listing modules")
	}

	return &respBody, nil
}
