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
}
type CreateEnvelopeApiDocument struct {
	DocumentBase64 string `json:"documentBase64"`
	DocumentId     int64  `json:"documentId"`
	Name           string `json:"name"`
	FileExtension  string `json:"fileExtension"`
}
type CreateEnvelopeApiRecipient struct {
	ClientUserId string `json:"clientUserId"`
	RecipientId  string `json:"recipientId"`
	Name         string `json:"name"`
	Email        string `json:"email"`
	FirstName    string `json:"firstName"`
	LastName     string `json:"lastName"`
}

func (api *CreateEnvelopeApi) Call() (*map[string]interface{}, error) {
	var (
		err      error
		respBody map[string]interface{}
	)

	log.EnterFn(0, "CreateEnvelopeApi.Call")
	defer log.ExitFn(0, "CreateEnvelopeApi.Call", err)

	// validate required fields
	// if api.AccessToken == "" {
	// 	err = errors.New("cannot create envelope without AccessToken")
	// 	return nil, err
	// }
	// if api.BaseUri == "" {
	// 	err = errors.New("cannot create envelope without BaseUri")
	// 	return nil, err
	// }
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

	api.AccessToken = "eyJ0eXAiOiJNVCIsImFsZyI6IlJTMjU2Iiwia2lkIjoiNjgxODVmZjEtNGU1MS00Y2U5LWFmMWMtNjg5ODEyMjAzMzE3In0.AQoAAAABAAUABwCA01uOavncSAgAgDsg8HL53EgCAKO2Rdg_6iNIu0apjmWWt-QVAAEAAAAYAAIAAAAFAAAAHQAAAA0AJAAAAGRmYmQ4MGRlLWY5NDgtNDY1Yy1hYmQ2LWM4NDIxYTZmMjc5MyIAJAAAAGRmYmQ4MGRlLWY5NDgtNDY1Yy1hYmQ2LWM4NDIxYTZmMjc5MxIAAQAAAAYAAABqd3RfYnIjACQAAABkZmJkODBkZS1mOTQ4LTQ2NWMtYWJkNi1jODQyMWE2ZjI3OTM.qsfsj0icn3QYEo7a53CJ9tnQrDfMeIjJN_SBpCC-fX4xDQ8i5-Kknb3KCa_zc82fxRvlMcizBSxcL8fYQnkB2ATSh7u0jsS6hNJdKTn_e2FxMp90SoYJM5NuxbrIaM3hLKL013Vsovb7DzSy5sKkeFYDauOo73EJ-Xbz-QXkWZXBpc2P-vMAtvv2ZrYh2W8RRLEAqsOGrTcMigT5PeXVfFQ3QmiluJ_OHrmoiadQsISNTY-pOQXg4LALt0zECtigp_NfGi1shFPZU1v2FQAhNt2nUlYbtjW8_JzNbIlvc9qnBxndpe33_ABe508zTnPtTNejbmGbxhI0fxGAyavDOg"

	url := fmt.Sprintf("%s/restapi/v2.1/accounts/%s/envelopes", leadsService.LeadAppCfg.DocusignApiBaseUrl, leadsService.LeadAppCfg.DocusignAccountId)
	err = callApi(http.MethodPost, url, reqBody, &respBody)

	if err != nil {
		if strings.Contains(err.Error(), "unauthorized") {
			return nil, err
		}

		return nil, errors.New("server side error when creating envelope")
	}

	return &respBody, nil
}
