/**************************************************************************
 *	File            : getUserInfo.go
 * 	DESCRIPTION     : This file contains getUserInfo api
 *	DATE            : 28-Sep-2024
**************************************************************************/
package docusignclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

type GetUserInfoApi struct {
	AccessToken string `json:"access_token"`
}

type GetUserInfoApiResponse interface{}

func (api *GetUserInfoApi) Call() (*GetUserInfoApiResponse, error) {
	var (
		err       error
		respBytes []byte
		respBody  GetUserInfoApiResponse
		req       *http.Request
	)

	log.EnterFn(0, "GetUserInfoApi.Call")
	defer log.ExitFn(0, "GetUserInfoApi.Call", err)

	if api.AccessToken == "" {
		err = errors.New("cannot get user info without AccessToken")
		return nil, err
	}
	apiUrl := fmt.Sprintf("%s/userinfo", leadsService.LeadAppCfg.DocusignOathBaseUrl)
	req, err = http.NewRequest(http.MethodGet, apiUrl, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	// set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", api.AccessToken))

	// send the request
	log.FuncDebugTrace(0, "Calling docusign user info api with access token %s", api.AccessToken)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call docusign user info api err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from docusign api err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to docusign user info api failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, err
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from docusign api err %v", err)
		return nil, errors.New("server side error when getting user info")
	}

	log.FuncDebugTrace(0, "Success from docusign user info api with response %+v", respBody)
	return &respBody, nil
}
