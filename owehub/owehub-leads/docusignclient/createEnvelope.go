/**************************************************************************
 *	File            : createEnvelope.go
 * 	DESCRIPTION     : This file contains functions for creating docusign envelope
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package docusignclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"net/http"
	"strings"
)

type CreateEnvelopeApi struct {
	EmailSubject string                       `json:"emailSubject"`
	Documents    []CreateEnvelopeApiDocument  `json:"documents"`
	Recipients   []CreateEnvelopeApiRecipient `json:"recipients"`
}
type CreateEnvelopeApiDocument struct {
	DocumentBase64 string `json:"documentBase64"`
	DocumentId     int64  `json:"documentId"`
	Name           string `json:"name"`
	FileExtension  string `json:"fileExtension"`
}
type CreateEnvelopeApiRecipient struct {
	RecipientId string `json:"recipientId"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
}

func (api *CreateEnvelopeApi) Call() (*map[string]interface{}, error) {
	var (
		err      error
		respBody map[string]interface{}
	)

	log.EnterFn(0, "CreateEnvelopeApi.Call")
	defer log.ExitFn(0, "CreateEnvelopeApi.Call", err)

	if api.EmailSubject == "" {
		err = errors.New("cannot create envelope without EmailSubject")
		return nil, err
	}
	if api.Documents == nil || len(api.Documents) == 0 {
		err = errors.New("cannot create envelope without Documents")
		return nil, err
	}
	if api.Recipients == nil || len(api.Recipients) == 0 {
		err = errors.New("cannot create envelope without Recipients")
		return nil, err
	}

	reqBody := map[string]interface{}{
		"emailSubject": api.EmailSubject,
		"documents":    api.Documents,
		"recipients":   map[string]interface{}{"signers": api.Recipients},
		"status":       "sent",
	}

	url := fmt.Sprintf("%s/restapi/v2.1/accounts/%s/envelopes", leadsService.LeadAppCfg.DocusignApiBaseUrl, leadsService.LeadAppCfg.DocusignAccountId)
	err = callApi(http.MethodPost, url, reqBody, &respBody)

	if err != nil {
		if strings.Contains(err.Error(), "INVALID_EMAIL_ADDRESS_FOR_RECIPIENT") {
			return nil, errors.New("invalid email address for docusign recipient")
		}

		return nil, errors.New("server side error when creating envelope")
	}

	return &respBody, nil
}
