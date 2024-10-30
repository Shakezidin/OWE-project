/**************************************************************************
 *	File            : retrieveProposalPdfGeneration.go
 * 	DESCRIPTION     : This file contains api calls to retrieve module in aurora
 *	DATE            : 29-october-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type RetrieveProposalPdfGenerationApi struct {
	DesignId string `json:"design_id"`
	JobId    string `json:"job_id"`
}

// type RetrieveProposalPdfGenerationApiResponseWebProposal struct {
// 	URL        *string `json:"url"`
// 	URLExpired bool    `json:"url_expired"`
// }

type RetrieveProposalPdfGenerationApiResponse struct {
	ProposalPdfGenerationJob RetrieveWebProposalApiResponseWebProposal `json:"proposal_pdf_generation_job"`
}

/******************************************************************************
 * FUNCTION:        RetrieveProposalPdfGenerationApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			ListModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RetrieveProposalPdfGenerationApi) Call() (*RetrieveProposalPdfGenerationApiResponse, error) {
	var (
		err      error
		respBody RetrieveProposalPdfGenerationApiResponse
	)

	log.EnterFn(0, "RetrieveProposalPdfGenerationApi.Call")
	defer log.ExitFn(0, "RetrieveProposalPdfGenerationApi.Call", err)

	//endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/proposal_pdf_generation/status", api.DesignId)
	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/proposal_pdf_generation/status?job_id=%s", api.DesignId, api.JobId)

	err = callApi(http.MethodGet, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retrieving modules")
	}

	return &respBody, nil
}
