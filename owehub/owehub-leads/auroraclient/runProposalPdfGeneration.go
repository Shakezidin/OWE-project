/**************************************************************************
 *	File            : runProposalPdfGeneration.go
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

type RunProposalPdfGenerationApi struct {
	DesignId string `json:"design_id"`
	Timezone string `json:"timezone"`
}

type RunProposalPdfGenerationApiResponse struct {
	ProposalPdfGenerationJob map[string]interface{} `json:"proposal_pdf_generation_job"`
}

/******************************************************************************
 * FUNCTION:        RunProposalPdfGenerationApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			ListModuleApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *RunProposalPdfGenerationApi) Call() (*RunProposalPdfGenerationApiResponse, error) {
	var (
		err      error
		respBody RunProposalPdfGenerationApiResponse
	)

	log.EnterFn(0, "RunProposalPdfGenerationApi.Call")
	defer log.ExitFn(0, "RunProposalPdfGenerationApi.Call", err)

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/proposal_pdf_generation/run", api.DesignId)

	err = callApi(http.MethodPost, endPt, nil, &respBody)
	if err != nil {
		return nil, errors.New("server side error when retrieving modules")
	}

	return &respBody, nil
}
