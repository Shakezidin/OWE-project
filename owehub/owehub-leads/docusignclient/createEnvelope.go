/**************************************************************************
 *	File            : createEnvelope.go
 * 	DESCRIPTION     : This file contains functions for creating docusign envelope
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package docusignclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"net/http"
)

type CreateEnvelopeApi struct {
	EmailSubject string                       `json:"emailSubject"`
	Documents    []CreateEnvelopeApiDocument  `json:"documents"`
	Recipients   []CreateEnvelopeApiRecipient `json:"recipients"`
	Status       string                       `json:"status"`
}
type CreateEnvelopeApiDocument struct {
	DocumentBase64 string `json:"documentBase64"`
	DocumentId     string `json:"documentId"`
	Name           string `json:"name"`
	FileExtension  string `json:"fileExtension"`
}

type CreateEnvelopeApiRecipient struct {
	Email     string `json:"email"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func (api *CreateEnvelopeApi) Call() (interface{}, error) {
	var (
		err      error
		respBody interface{}
	)

	log.EnterFn(0, "CreateEnvelopeApi.Call")
	defer log.ExitFn(0, "CreateEnvelopeApi.Call", err)

	// validate required fields
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

	err = callApi(http.MethodPost, "/restapi/v2.1/accounts/{accountId}/envelopes", api, &respBody)
	if err != nil {
		return nil, errors.New("server side error when creating envelope")
	}

	return &respBody, nil
}
