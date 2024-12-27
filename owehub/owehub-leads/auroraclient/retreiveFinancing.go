/**************************************************************************
 *	File            : retreiveFinancing.go
 * 	DESCRIPTION     : This file contains api calls to retreive financing
 *	DATE            : 15-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetreiveFinancingApi struct {
	DesignId    string `json:"design_id"`
	FinancingId string `json:"financing_id"`
}

type RetreiveFinancingApiResponse struct {
	Financing map[string]interface{} `json:"financing"`
}

/******************************************************************************
 * FUNCTION:        RetreiveFinancingApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			RetreiveFinancingApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetreiveFinancingApi) Call() (*RetreiveFinancingApiResponse, error) {
	var (
		err      error
		respBody RetreiveFinancingApiResponse
	)

	log.EnterFn(0, "RetreiveFinancingApi.Call")
	defer log.ExitFn(0, "RetreiveFinancingApi.Call", err)

	if api.DesignId == "" {
		return nil, errors.New("design id is empty")
	}

	if api.FinancingId == "" {
		return nil, errors.New("financing id is empty")
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/financings/%s", api.DesignId, api.FinancingId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retreiving financing")
	}

	return &respBody, nil
}
