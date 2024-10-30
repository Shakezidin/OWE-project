/**************************************************************************
 *	File            : apiDocusignOauth.go
 * 	DESCRIPTION     : This file contains api handlers for docusign oauth
 *	DATE            : 28-Sep-2024
**************************************************************************/
package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func HandleDocusignOauth(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		query        string
		data         []map[string]interface{}
		dataReq      models.DocusignOauthRequest
		apiResp      models.DocusginOauthResponse
		getTokenResp *docusignclient.GetAccessTokenApiResponse
	)

	log.EnterFn(0, "HandleDocusignOauth")
	defer func() { log.ExitFn(0, "HandleDocusignOauth", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get docusign auth uri request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get docusign auth uri request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request body to get docusign auth uri request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	authenticatedEmailId := req.Context().Value("emailid").(string)

	// STEP 1. ACTION: Request authorization code from DocuSign
	if dataReq.Action == "geturl" {

		if dataReq.RedirectUri == "" {
			err = fmt.Errorf("redirect URI is empty in get docusign auth uri request")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Redirect URI is empty", http.StatusBadRequest, nil)
			return
		}

		// veirfy lead exists
		query = `SELECT email_id FROM get_leads_info_hierarchy($1) WHERE leads_id = $2`
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmailId, dataReq.LeadsId})

		if err != nil {
			log.FuncErrorTrace(0, "Failed to retrieve leads info from database err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to retrieve leads info from database", http.StatusBadRequest, nil)
			return
		}

		if len(data) == 0 {
			err = fmt.Errorf("leads info not found in database")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Leads info not found in database", http.StatusBadRequest, nil)
			return
		}

		leadEmail, ok := data[0]["email_id"].(string)
		if !ok {
			err = fmt.Errorf("leads email id not found in database")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Leads not found in database", http.StatusBadRequest, nil)
			return
		}

		apiResp.URL = fmt.Sprintf("%s/auth?response_type=code&client_id=%s&redirect_uri=%s&scope=signature&state=%d&login_hint=%s",
			leadsService.LeadAppCfg.DocusignOathBaseUrl, leadsService.LeadAppCfg.DocusignIntegrationKey, dataReq.RedirectUri, dataReq.LeadsId, leadEmail)

		appserver.FormAndSendHttpResp(resp, "Oauth begin", http.StatusOK, apiResp)
		return
	}

	// STEP 2. ACTION: Get Access Token from DocuSign
	if dataReq.Action == "gettoken" {
		if dataReq.AuthorizationCode == "" {
			err = fmt.Errorf("authorization Code is empty in get docusign auth uri request")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Authorization Code is empty", http.StatusBadRequest, nil)
			return
		}

		getTokenApi := docusignclient.GetAccessTokenApi{
			AuthorizationCode: dataReq.AuthorizationCode,
		}

		getTokenResp, err = getTokenApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get access token from docusign err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get access token from docusign", http.StatusBadRequest, nil)
			return
		}

		apiResp.AccessToken = getTokenResp.AccessToken
		apiResp.RefreshToken = getTokenResp.RefreshToken
		apiResp.TokenType = getTokenResp.TokenType
		apiResp.ExpiresIn = getTokenResp.ExpiresIn

		appserver.FormAndSendHttpResp(resp, "Access Token", http.StatusOK, apiResp)
		return
	}

	// STEP 3. ACTION: Get User Info from DocuSign
	if dataReq.Action == "getuserinfo" {
		if dataReq.AuthorizationCode == "" {
			err = fmt.Errorf("authorization Code is empty in get docusign auth uri request")
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Authorization Code is empty", http.StatusBadRequest, nil)
			return
		}

		getUserInfoApi := docusignclient.GetUserInfoApi{
			AccessToken: dataReq.AuthorizationCode,
		}

		getUserInfoResp, err := getUserInfoApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get user info from docusign err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get user info from docusign", http.StatusBadRequest, nil)
			return
		}

		apiResp.UserInfo = getUserInfoResp

		appserver.FormAndSendHttpResp(resp, "User Info", http.StatusOK, apiResp)
		return
	}

	// Invalid Action
	err = fmt.Errorf("invalid Action in get docusign auth uri request")
	log.FuncErrorTrace(0, "%v", err)
	appserver.FormAndSendHttpResp(resp, "Invalid Action", http.StatusBadRequest, nil)
}
