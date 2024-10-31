/**************************************************************************
 *	File            : getDocument.go
 * 	DESCRIPTION     : This file contains getDocument api
 *	DATE            : 28-Sep-2024
**************************************************************************/

package docusignclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

type GetDocumentApi struct {
	AccessToken string `json:"access_token"`
	BaseUri     string `json:"baseUri"`
	EnvelopeId  string `json:"envelopeId"`
}

func (api *GetDocumentApi) Call() (*[]byte, error) {
	var (
		err      error
		req      *http.Request
		respBody []byte
	)

	if api.EnvelopeId == "" {
		err = fmt.Errorf("cannot get document without DocumentId")
		return nil, err
	}
	// if api.AccessToken == "" {
	// 	err = fmt.Errorf("cannot get document without AccessToken")
	// 	return nil, err
	// }
	// if api.BaseUri == "" {
	// 	err = fmt.Errorf("cannot get document without BaseUri")
	// 	return nil, err
	// }

	apiUrl := fmt.Sprintf("%s/restapi/v2.1/accounts/%s/envelopes/%s/documents/combined", leadsService.LeadAppCfg.DocusignApiBaseUrl, leadsService.LeadAppCfg.DocusignAccountId, api.EnvelopeId)
	req, err = http.NewRequest(http.MethodGet, apiUrl, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	// set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", docusignAccessToken))

	// send the request
	log.FuncDebugTrace(0, "Calling docusign get document api with access token %s", docusignAccessToken)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call docusign get document api err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	defer resp.Body.Close()

	respBody, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from docusign api err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBody)
		err = fmt.Errorf("call to docusign get document api failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, err
	}

	log.FuncDebugTrace(0, "Success from docusign get document api")
	return &respBody, nil
}
