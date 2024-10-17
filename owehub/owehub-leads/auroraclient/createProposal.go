/**************************************************************************
 *	File            : createProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a proposal in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/
package auroraclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type CreateProposalApi struct {
	DesignId           string `json:"design_id,omitempty"`
	ProposalTemplateId string `json:"proposal_template_id,omitempty"`
}

type CreateProposalApiResponse struct {
	Proposal map[string]interface{} `json:"proposal"`
}

/******************************************************************************
 * FUNCTION:        CreateProposalApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			CreateProposalApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *CreateProposalApi) Call() (*CreateProposalApiResponse, error) {
	var (
		err      error
		respBody CreateProposalApiResponse
	)

	log.EnterFn(0, "CreateProposalApi.Call")
	defer log.ExitFn(0, "CreateProposalApi.Call", err)

	// validate required fields
	if api.DesignId == "" {
		err = fmt.Errorf("cannot create proposal without DesignId")
		return nil, err
	}

	reqBody := map[string]*CreateProposalApi{
		"proposal": {
			ProposalTemplateId: api.ProposalTemplateId,
		},
	}

	endPt := fmt.Sprintf("/tenants/{tenant_id}/designs/%s/proposals/default", api.DesignId)
	err = callApi(http.MethodPost, endPt, reqBody, &respBody)
	if err != nil {
		return nil, errors.New("server side error when creating proposal")
	}

	return &respBody, nil
}
