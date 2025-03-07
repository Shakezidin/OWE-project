/**************************************************************************
 * File       	   : apiUpdateTeamName.go
 * DESCRIPTION     : This file contains functions for update team name handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"bytes"
	"sync"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"golang.org/x/time/rate"
)

var (
	mu         sync.Mutex
	limiters   = make(map[string]*rate.Limiter) // Map to store rate limiters per IP
	rateLimit  = 5                              // 5 requests per second
	burstLimit = 10                             // Allow small bursts
	authTokens = []string{"user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJm77-977-9XHUwMDAzVO-_vWPvv73vv70iLCJzY29wZSI6InVrX3YxIiwidHlwZSI6IlVTRVJfQVBJX0tFWSJ9.oHUitRsj8CQgROYR9Q-pCSc1Mc3YkHpU3rJSDddKMg8",
		"user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjXe-_ve-_vW3vv73vv73vv70x77-9Iiwic2NvcGUiOiJ1a192MSIsInR5cGUiOiJVU0VSX0FQSV9LRVkifQ.ewBrfXelga2DDikb4rUiiIbljaOYc03PNwAOLSEFdnA",
		"user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJrbe-_vXnYs--_vWJhTiIsInNjb3BlIjoidWtfdjEiLCJ0eXBlIjoiVVNFUl9BUElfS0VZIn0.H8JCYHMpobgbHQxVLD__2aBPyn0fLlM24vH7v-lnS8o",
		"user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJcdO-_vWbvv73vv71x77-9bVx1MDAwZe-_vSIsInNjb3BlIjoidWtfdjEiLCJ0eXBlIjoiVVNFUl9BUElfS0VZIn0.hQuW6xoWVakBpORnTayWGsT9uaGm2J8QEF8gRnvCh6k",
		"user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjXe-_ve-_vW3vv73vv73vv70x77-9Iiwic2NvcGUiOiJ1a192MSIsInR5cGUiOiJVU0VSX0FQSV9LRVkifQ.ewBrfXelga2DDikb4rUiiIbljaOYc03PNwAOLSEFdnA"}
)

/******************************************************************************
 * FUNCTION:		HandleUpdateSetterSalesRepRequest
 * DESCRIPTION:     handler for update setter and sales rep name request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateSetterSalesRepRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		updateData models.UpdateSetterSalesRepReq
		// query      string
		// rows       int64
	)

	log.EnterFn(0, "HandleUpdateSetterSalesRepRequest")
	defer func() { log.ExitFn(0, "HandleUpdateSetterSalesRepRequest", err) }()

	// Get user's IP
	userIP := req.RemoteAddr

	limiter := getLimiter(userIP)
	if !limiter.Allow() {
		http.Error(resp, "Too many requests. Please try again later.", http.StatusTooManyRequests)
		return
	}

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update setter and sales rep name request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update setter and sales rep name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update setter and sales rep name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update team name request", http.StatusBadRequest, nil)
		return
	}

	if len(updateData.ProjectRecordId) <= 0 || updateData.Field == "" || len(updateData.UpdatedRecordid) <= 0 {
		err = fmt.Errorf("Invalid input fields in API request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid input fields in API request", http.StatusBadRequest, nil)
		return
	}

	switch updateData.Field {
	case "primary_sales_rep":
		updateData.Field = "primary_sales_rep"
		updateData.UpdatedRecordid = updateData.UpdatedRecordid[:1]
	case "secondary_sales_rep":
		updateData.Field = "secondary_sales_rep"
		updateData.UpdatedRecordid = updateData.UpdatedRecordid[:1]
	case "setter":
		updateData.Field = "setter"
	default:
		log.FuncErrorTrace(0, "invalide field name")
		appserver.FormAndSendHttpResp(resp, "Invalid input field name in API request", http.StatusBadRequest, nil)
	}
	log.FuncDebugTrace(0, "project_id = %v  old_data = %v   new_data = %v, field = %v", updateData.ProjectRecordId, updateData.OldData, updateData.NewData, updateData.Field)

	// Call the API with retry mechanism
	respAPI, err := sendTapeAPIRequest(updateData.ProjectRecordId, updateData.Field, updateData.UpdatedRecordid)
	if err != nil {
		log.FuncErrorTrace(0, "API request failed: %v", err)
		appserver.FormAndSendHttpResp(resp, fmt.Sprintf("Failed to update data: %v", err), http.StatusInternalServerError, nil)
		return
	}
	defer respAPI.Body.Close()

	// Handle successful response
	appserver.FormAndSendHttpResp(resp, updateData.Field+" name updated successfully", http.StatusOK, nil)
}

// Get rate limiter for an IP
func getLimiter(ip string) *rate.Limiter {
	mu.Lock()
	defer mu.Unlock()

	limiter, exists := limiters[ip]
	if !exists {
		limiter = rate.NewLimiter(rate.Limit(rateLimit), burstLimit)
		limiters[ip] = limiter
	}
	return limiter
}

func sendTapeAPIRequest(projectRecordID, field string, updatedRecordIDs []string) (*http.Response, error) {
	// Prepare request payload
	apiURL := "https://api.tapeapp.com/v1/record/" + projectRecordID
	payload := map[string]interface{}{
		"fields": map[string][]string{
			field: updatedRecordIDs,
		},
	}

	// Convert payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal JSON: %w", err)
	}

	maxRetries := len(authTokens)
	client := &http.Client{Timeout: 10 * time.Second}
	var respAPI *http.Response
	var lastErr error

	// Try with each auth token until success or all tokens exhausted
	for retry := 0; retry < maxRetries; retry++ {
		// Create HTTP request
		req, err := http.NewRequest(http.MethodPut, apiURL, bytes.NewBuffer(jsonData))
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create request: %v\n", err)
			lastErr = fmt.Errorf("failed to create request: %w", err)
			continue
		}

		// Set headers with current token
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+authTokens[retry])

		// Make HTTP request
		respAPI, err = client.Do(req)
		if err != nil {
			log.FuncErrorTrace(0, "Request attempt %d failed: %v\n", retry+1, err)
			lastErr = fmt.Errorf("request attempt %d failed: %w", retry+1, err)
			continue
		}

		// Check for token expiration or rate limiting
		if respAPI.StatusCode == http.StatusUnauthorized ||
			respAPI.StatusCode == http.StatusForbidden ||
			respAPI.StatusCode == http.StatusTooManyRequests {

			log.FuncErrorTrace(0, "Token expired or rate limited (status: %d). Trying next token.\n", respAPI.StatusCode)
			respAPI.Body.Close()
			lastErr = fmt.Errorf("token expired or rate limited (status: %d)", respAPI.StatusCode)
			continue
		}

		// Success
		return respAPI, nil
	}

	// All retries failed
	if lastErr == nil {
		lastErr = fmt.Errorf("failed to update record after trying all available tokens")
	}

	return nil, lastErr
}
