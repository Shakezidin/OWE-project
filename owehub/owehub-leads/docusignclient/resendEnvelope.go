/**************************************************************************
 *	File            : resendEnvelope.go
 * 	DESCRIPTION     : This file contains resendEnvelope api
 *	DATE            : 28-Sep-2024
**************************************************************************/

package docusignclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
)

type ResendEnvelopeApi struct {
	EnvelopeId string                       `json:"envelopeId"`
	Recipients []ResendEnvelopeApiRecipient `json:"recipients"`
}

type ResendEnvelopeApiRecipient struct {
	RecipientId string `json:"recipientId"`
}

/******************************************************************************
 * FUNCTION:		ResendEnvelopeApi.Call
 * DESCRIPTION:     This function is used to resend docusign mail to recipients
 * INPUT:			N/A
 * RETURNS:    		error
 ******************************************************************************/
func (api *ResendEnvelopeApi) Call() (*map[string]interface{}, error) {
	var (
		err      error
		respBody map[string]interface{}
	)

	log.EnterFn(0, "ResendEnvelopeApi.Call")
	defer func() { log.ExitFn(0, "ResendEnvelopeApi.Call", err) }()

	if api.EnvelopeId == "" {
		err = fmt.Errorf("cannot resend envelope without EnvelopeId")
		return nil, err
	}

	if api.Recipients == nil || len(api.Recipients) == 0 {
		err = fmt.Errorf("cannot resend envelope without Recipients")
		return nil, err
	}

	apiUrl := "restapi/v2.1/accounts/{accountId}/envelopes/" + api.EnvelopeId + "/views/recipient"

	reqBody := map[string]interface{}{
		"recipients": map[string]interface{}{"signers": api.Recipients},
	}

	err = callApi(http.MethodPost, apiUrl, reqBody, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to resend docusign envelope err %v", err)
		return nil, errors.New("server side error when resending docusign envelope")
	}

	log.FuncDebugTrace(0, "Success from docusign resend envelope api with response %+v", respBody)
	return &respBody, nil
}
