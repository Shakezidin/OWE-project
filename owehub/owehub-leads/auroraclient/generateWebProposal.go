/**************************************************************************
 *	File            : generateWebProposal.go
 * 	DESCRIPTION     : This file contains api calls to generate module in aurora
 *	DATE            : 15-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type GenerateWebProposalApi struct {
	DesignId string `json:"design_id"`
}

type GenerateWebProposalApiResponse struct {
	WebProposal interface{} `json:"web_proposal"`
}

/******************************************************************************
 * FUNCTION:        GenerateWebProposalApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			GenerateWebProposalApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *GenerateWebProposalApi) Call() (*GenerateWebProposalApiResponse, error) {
	var (
		err      error
		respBody GenerateWebProposalApiResponse
	)

	log.EnterFn(0, "GenerateWebProposalApi.Call")
	defer log.ExitFn(0, "GenerateWebProposalApi.Call", err)

	if api.DesignId == "" {
		return nil, errors.New("design id is empty")
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/web_proposal/generate_url", api.DesignId)

	err = callApi(http.MethodPost, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when generating web proposal")
	}

	return &respBody, nil
}
