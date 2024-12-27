/**************************************************************************
 *	File            : getAccessToken.go
 * 	DESCRIPTION     : This file contains getAccessToken api
 *	DATE            : 28-Sep-2024
**************************************************************************/
package docusignclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

type GetAccessTokenApi struct {
	AuthorizationCode string `json:"authorization_code"`
}

type GetAccessTokenApiResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int64  `json:"expires_in"`
}

func (api *GetAccessTokenApi) Call() (*GetAccessTokenApiResponse, error) {
	var (
		err       error
		respBytes []byte
		respBody  GetAccessTokenApiResponse
		req       *http.Request
	)

	log.EnterFn(0, "GetAccessTokenApi.Call")
	defer log.ExitFn(0, "GetAccessTokenApi.Call", err)

	if api.AuthorizationCode == "" {
		err = errors.New("cannot get access token without AuthorizationCode")
		return nil, err
	}

	apiUrl := fmt.Sprintf("%s/token", leadsService.LeadAppCfg.DocusignOathBaseUrl)
	data := bytes.NewBufferString(fmt.Sprintf("grant_type=authorization_code&code=%s", api.AuthorizationCode))
	req, err = http.NewRequest(http.MethodPost, apiUrl, data)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, errors.New("server side error when getting access token")
	}

	// set headers
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.SetBasicAuth(leadsService.LeadAppCfg.DocusignIntegrationKey, leadsService.LeadAppCfg.DocusignSecretKey)

	// send the request
	log.FuncDebugTrace(0, "Calling docusign oauth api with code %s", api.AuthorizationCode)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call docusgin oauth api err %v", err)
		return nil, errors.New("server side error when getting access token")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from docusign api err %v", err)
		return nil, errors.New("server side error when getting access token")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to docusign oauth api failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, err
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from docusign api err %v", err)
		return nil, errors.New("server side error when getting access token")
	}

	log.FuncDebugTrace(0, "Success from docusign oauth api with response %+v", respBody)
	return &respBody, nil
}
