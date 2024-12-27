/**************************************************************************
 *	File            : listFinancings.go
 * 	DESCRIPTION     : This file contains api calls to list financings
 *	DATE            : 15-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type ListFinancingsApi struct {
	DesignId string `json:"design_id"`
}

type ListFinancingsApiResponse struct {
	Financings []map[string]interface{} `json:"financings"`
}

/******************************************************************************
 * FUNCTION:        ListFinancingsApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			ListFinancingsApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *ListFinancingsApi) Call() (*ListFinancingsApiResponse, error) {
	var (
		err      error
		respBody ListFinancingsApiResponse
	)

	log.EnterFn(0, "ListFinancingsApi.Call")
	defer log.ExitFn(0, "ListFinancingsApi.Call", err)

	if api.DesignId == "" {
		return nil, errors.New("design id is empty")
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/financings", api.DesignId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when listing financings")
	}

	return &respBody, nil
}
