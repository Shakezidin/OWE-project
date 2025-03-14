/**************************************************************************
 *	File            : retrieveWebProposal.go
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

type RetrieveWebProposalApi struct {
	DesignId string `json:"design_id"`
}

type RetrieveWebProposalApiResponseWebProposal struct {
	URL        *string `json:"url"`
	URLExpired bool    `json:"url_expired"`
}

type RetrieveWebProposalApiResponse struct {
	WebProposal RetrieveWebProposalApiResponseWebProposal `json:"web_proposal"`
}

/******************************************************************************
 * FUNCTION:        RetrieveWebProposalApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			ListModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetrieveWebProposalApi) Call() (*RetrieveWebProposalApiResponse, error) {
	var (
		err      error
		respBody RetrieveWebProposalApiResponse
	)

	log.EnterFn(0, "RetrieveWebProposalApi.Call")
	defer log.ExitFn(0, "RetrieveWebProposalApi.Call", err)

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/web_proposal", api.DesignId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retrieving web proposal")
	}

	return &respBody, nil
}
