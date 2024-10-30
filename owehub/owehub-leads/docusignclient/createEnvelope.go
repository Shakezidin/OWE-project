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
	AccessToken  string                       `json:"access_token"`
	BaseUri      string                       `json:"baseUri"`
	EmailSubject string                       `json:"emailSubject"`
	Documents    []CreateEnvelopeApiDocument  `json:"documents"`
	Recipients   []CreateEnvelopeApiRecipient `json:"recipients"`
	Status       string                       `json:"status"`
}
type CreateEnvelopeApiDocument struct {
	DocumentBase64 string `json:"documentBase64"`
	DocumentId     int64  `json:"documentId"`
	Name           string `json:"name"`
	FileExtension  string `json:"fileExtension"`
}
type CreateEnvelopeApiRecipient struct {
	RecipientId string `json:"recipientId"`
	Email       string `json:"email"`
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
}

func (api *CreateEnvelopeApi) Call() (interface{}, error) {
	var (
		err      error
		respBody interface{}
	)

	log.EnterFn(0, "CreateEnvelopeApi.Call")
	defer log.ExitFn(0, "CreateEnvelopeApi.Call", err)

	// validate required fields
	if api.AccessToken == "" {
		err = errors.New("cannot create envelope without AccessToken")
		return nil, err
	}
	if api.BaseUri == "" {
		err = errors.New("cannot create envelope without BaseUri")
		return nil, err
	}
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
	if api.Status != "" && api.Status != "sent" && api.Status != "created" {
		err = errors.New("cannot create envelope without Status")
		return nil, err
	}

	reqBody := map[string]interface{}{
		"emailSubject": api.EmailSubject,
		"documents":    api.Documents,
		"recipients":   map[string]interface{}{"signers": api.Recipients},
		"status":       api.Status,
	}

	url := fmt.Sprintf("%s/restapi/v2.1/accounts/%s/envelopes", api.BaseUri, leadsService.LeadAppCfg.DocusignAccountId)
	err = callApi(http.MethodPost, url, api.AccessToken, reqBody, &respBody)

	if err != nil {
		if strings.Contains(err.Error(), "unauthorized") {
			return nil, err
		}

		return nil, errors.New("server side error when creating envelope")
	}

	return &respBody, nil
}
