/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
 * DATE            : 22-Dec-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		GetSupetsetGuestToken
 * DESCRIPTION:     handle to get superset guest token
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
 func GetSupetsetGuestToken(resp http.ResponseWriter, req *http.Request) {
	 var (
		 err            error
		 tokenReq       models.GuestTokenRequest
		 tokenResponse  models.GuestTokenResponse
	 )
 
	 log.EnterFn(0, "GetSupetsetGuestToken")
	 defer func() { log.ExitFn(0, "GetSupetsetGuestToken", err) }()
 
	 if req.Body == nil {
		 err = fmt.Errorf("HTTP request body is null")
		 log.FuncErrorTrace(0, "%v", err)
		 appserver.FormAndSendHttpResp(resp, "HTTP request body is null", http.StatusBadRequest, nil)
		 return
	 }
 
	 reqBody, err := ioutil.ReadAll(req.Body)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to read HTTP request body: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to read HTTP request body", http.StatusBadRequest, nil)
		 return
	 }
 
	 err = json.Unmarshal(reqBody, &tokenReq)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to unmarshal request body: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to parse request body", http.StatusBadRequest, nil)
		 return
	 }
 
	 // Step 1: Login to Superset
	 authToken, err := loginToSuperset()
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to log in to Superset: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to log in to Superset", http.StatusInternalServerError, nil)
		 return
	 }
	 log.FuncDebugTrace(0, "Successfully logged in to Superset")
 
	 // Step 2: Get CSRF Token
	 csrfToken, sessionCookie, err := getCSRFToken(authToken)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to fetch CSRF token: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to fetch CSRF token", http.StatusInternalServerError, nil)
		 return
	 }
	 log.FuncDebugTrace(0, "Successfully fetched CSRF token")
 
	 // Step 3: Generate Guest Token
	 guestToken, err := getGuestToken(authToken, csrfToken, sessionCookie, tokenReq.DashboardId)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to generate guest token: %v", err)
		 appserver.FormAndSendHttpResp(resp, "Failed to generate guest token", http.StatusInternalServerError, nil)
		 return
	 }
	 log.FuncDebugTrace(0, "Successfully generated guest token")
 
	 // Prepare and send response
	 tokenResponse.GuestToken = guestToken
	 appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, tokenResponse)
 }
 
 // Step 1: Login to Superset
 func loginToSuperset() (string, error) {
	 client := &http.Client{}
	 loginPayload := map[string]interface{}{
		 "password": "admin",
		 "provider": "db",
		 "refresh":  true,
		 "username": "admin",
	 }
	 loginPayloadBytes, err := json.Marshal(loginPayload)
	 if err != nil {
		 return "", err
	 }
 
	 request, err := http.NewRequest("POST", "http://45.77.121.171:8088/api/v1/security/login", bytes.NewBuffer(loginPayloadBytes))
	 if err != nil {
		 return "", err
	 }
 
	 request.Header.Set("Content-Type", "application/json")
	 response, err := client.Do(request)
	 if err != nil {
		 return "", err
	 }
	 defer response.Body.Close()
 
	 if response.StatusCode != http.StatusOK {
		 return "", fmt.Errorf("failed to log in: %s", response.Status)
	 }
 
	 var result map[string]interface{}
	 err = json.NewDecoder(response.Body).Decode(&result)
	 if err != nil {
		 return "", err
	 }
 
	 authToken, ok := result["access_token"].(string)
	 if !ok {
		 return "", fmt.Errorf("access_token not found in login response")
	 }
 
	 return authToken, nil
 }
 
 func getCSRFToken(authToken string) (string, string, error) {
	client := &http.Client{}
	request, err := http.NewRequest("GET", "http://45.77.121.171:8088/api/v1/security/csrf_token/", nil)
	if err != nil {
		return "", "", err
	}

	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", authToken))
	response, err := client.Do(request)
	if err != nil {
		return "", "", err
	}
	defer response.Body.Close()

	// Check if response is OK
	if response.StatusCode != http.StatusOK {
		return "", "", fmt.Errorf("failed to fetch CSRF token: %s", response.Status)
	}

	// Extract CSRF Token from the response body
	var result map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		return "", "", err
	}

	csrfToken, ok := result["result"].(string)
	if !ok {
		return "", "", fmt.Errorf("csrf_token not found in response")
	}

	// Extract session cookie
	sessionCookie := ""
	for _, cookie := range response.Cookies() {
		if cookie.Name == "session" { // Assuming the session cookie name is "session"
			sessionCookie = cookie.Value
			break
		}
	}

	return csrfToken, sessionCookie, nil
}
 // Step 3: Get Guest Token
func getGuestToken(authToken, csrfToken, sessionCookie, DashboardId string) (string, error) {
	client := &http.Client{}
	guestTokenPayload := map[string]interface{}{
		"resources": []map[string]interface{}{
			{
				"type": "dashboard",
				"id":   DashboardId,
			},
		},
		"rls": []interface{}{},
		"user": map[string]string{
			"username":  "admin",
			"first_name": "Superset",
			"last_name":  "Admin",
		},
	}
	guestTokenPayloadBytes, err := json.Marshal(guestTokenPayload)
	if err != nil {
		return "", err
	}

	request, err := http.NewRequest("POST", "http://45.77.121.171:8088/api/v1/security/guest_token/", bytes.NewBuffer(guestTokenPayloadBytes))
	if err != nil {
		return "", err
	}

	// Set necessary headers
	request.Header.Set("Authorization", fmt.Sprintf("Bearer %s", authToken))
	request.Header.Set("X-CSRFToken", csrfToken)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Cookie", fmt.Sprintf("session=%s", sessionCookie)) // Add session cookie

	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()

	// Check if response is OK
	if response.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to fetch guest token: %s", response.Status)
	}

	// Extract guest token from response body
	var result map[string]interface{}
	err = json.NewDecoder(response.Body).Decode(&result)
	if err != nil {
		return "", err
	}

	guestToken, ok := result["token"].(string)
	if !ok {
		return "", fmt.Errorf("guest_token not found in response")
	}

	return guestToken, nil
}