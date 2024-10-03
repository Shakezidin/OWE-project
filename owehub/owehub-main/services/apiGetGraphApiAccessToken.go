/**************************************************************************
 * File           : apiManageTeam.go
 * DESCRIPTION    : This file contains functions for Manage team handler
 * DATE           : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"

	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

/******************************************************************************
* FUNCTION:      HandleManageTeamDataRequest
* DESCRIPTION:   handler for Manage team request
* INPUT:         resp, req
* RETURNS:       void
******************************************************************************/
func HandleGraphApiAccessToken(resp http.ResponseWriter, req *http.Request) {
	var (
		err error
	)

	log.EnterFn(0, "HandleGraphApiAccessToken")
	defer func() { log.ExitFn(0, "HandleGraphApiAccessToken", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in create RepCredit request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from create RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	var createRepCreditReq interface{}
	err = json.Unmarshal(reqBody, &createRepCreditReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal create RepCredit request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal create ar-rep request", http.StatusBadRequest, nil)
		return
	}

	clientId := "4c8d3eb2-990b-43fc-ab5f-77250f56c688"
	clientSecret := "Lwg8Q~xpznS1FVMBdlcGlaYTeXS.E1DcSUIFkaLa"
	tenantId := "ac6710b5-2c77-4589-8512-a629b28c26a5"

	tokenUrl := fmt.Sprintf("https://login.microsoftonline.com/%s/oauth2/v2.0/token", tenantId)
	data := url.Values{}
	data.Set("client_id", clientId)
	data.Set("client_secret", clientSecret)
	data.Set("scope", "https://graph.microsoft.com/.default")
	data.Set("grant_type", "client_credentials")

	reqToken, err := http.NewRequest("POST", tokenUrl, bytes.NewBufferString(data.Encode()))
	if err != nil {
		log.FuncErrorTrace(0, "Error creating request: %v", err)
		appserver.FormAndSendHttpResp(resp, "Error creating request", http.StatusInternalServerError, nil)
		return
	}
	reqToken.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	respToken, err := client.Do(reqToken)
	if err != nil {
		log.FuncErrorTrace(0, "Error sending request: %v", err)
		appserver.FormAndSendHttpResp(resp, "Error sending request", http.StatusInternalServerError, nil)
		return
	}
	defer respToken.Body.Close()

	body, err := io.ReadAll(respToken.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading response: %v", err)
		appserver.FormAndSendHttpResp(resp, "Error reading response", http.StatusInternalServerError, nil)
		return
	}

	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		log.FuncErrorTrace(0, "Error parsing response: %v", err)
		appserver.FormAndSendHttpResp(resp, "Error parsing response", http.StatusInternalServerError, nil)
		return
	}

	accessToken, ok := result["access_token"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Error: access token not found")
		appserver.FormAndSendHttpResp(resp, "Error: access token not found", http.StatusInternalServerError, nil)
		return
	}

	// accessCodeMap := map[string]string{}
	// accessCodeMap["access-code "] = accessToken
	log.FuncInfoTrace(0, fmt.Sprintf("Access Token for Outlook graph API: %v", accessToken))
	appserver.FormAndSendHttpResp(resp, "Access Token generated", http.StatusOK, result)
}
