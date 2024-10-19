/**************************************************************************
 *	File            : retreiveProposal.go
 * 	DESCRIPTION     : This file contains api calls to retreive a proposal in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetreiveProposalApi struct {
	DesignId string `json:"design_id"`
}

type RetreiveProposalApiResponse struct {
	Proposal map[string]interface{} `json:"proposal"`
}

/******************************************************************************
 * FUNCTION:        RetreiveProposalApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			RetreiveProposalApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetreiveProposalApi) Call() (*RetreiveProposalApiResponse, error) {
	var (
		err      error
		respBody RetreiveProposalApiResponse
	)

	log.EnterFn(0, "RetreiveProposalApi.Call")
	defer log.ExitFn(0, "RetreiveProposalApi.Call", err)

	// validate required fields
	if api.DesignId == "" {
		err = fmt.Errorf("cannot retreive proposal without DesignId")
		return nil, err
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/proposals/default", api.DesignId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retreiving proposal")
	}

	return &respBody, nil
}
