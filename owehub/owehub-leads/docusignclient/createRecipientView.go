/**************************************************************************
*	File			: createRecipientView.go
*	Description	: This file contains create recipient view
*	DATE			: 28-Sep-2024
**************************************************************************/

package docusignclient

import (
	log "OWEApp/shared/logger"
	"errors"
	"net/http"
)

type CreateRecipientViewApi struct {
	EnvelopeId   string `json:"envelopeId"`
	RecipientId  string `json:"recipientId"`
	UserName     string `json:"userName"`
	Email        string `json:"email"`
	ClientUserId string `json:"clientUserId"`
	ReturnUrl    string `json:"returnUrl"`
}

type CreateRecipientViewApiResponse struct {
	Url string `json:"url"`
}

func (api *CreateRecipientViewApi) Call() (*CreateRecipientViewApiResponse, error) {
	var (
		err      error
		respBody CreateRecipientViewApiResponse
	)

	log.EnterFn(0, "CreateRecipientViewApi.Call")
	defer log.ExitFn(0, "CreateRecipientViewApi.Call", err)

	if api.UserName == "" {
		err = errors.New("cannot create recipient view without UserName")
		return nil, err
	}
	if api.Email == "" {
		err = errors.New("cannot create recipient view without Email")
		return nil, err
	}
	if api.ClientUserId == "" {
		err = errors.New("cannot create recipient view without ClientUserId")
		return nil, err
	}
	if api.ReturnUrl == "" {
		err = errors.New("cannot create recipient view without ReturnUrl")
		return nil, err
	}

	data := map[string]interface{}{
		"recipientId":          api.RecipientId,
		"userName":             api.UserName,
		"email":                api.Email,
		"clientUserId":         api.ClientUserId,
		"returnUrl":            api.ReturnUrl,
		"authenticationMethod": "Password",
	}

	apiUrl := "restapi/v2.1/accounts/{accountId}/envelopes/" + api.EnvelopeId + "/views/recipient"
	err = callApi(http.MethodPost, apiUrl, data, &respBody)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create recipient view err %v", err)
		return nil, errors.New("server side error when creating recipient view")
	}

	return &respBody, nil
}
