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
	authToken  = "user_key_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJm77-977-9XHUwMDAzVO-_vWPvv73vv70iLCJzY29wZSI6InVrX3YxIiwidHlwZSI6IlVTRVJfQVBJX0tFWSJ9.oHUitRsj8CQgROYR9Q-pCSc1Mc3YkHpU3rJSDddKMg8"
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

	// Prepare request payload
	apiURL := "https://api.tapeapp.com/v1/record/" + updateData.ProjectRecordId
	payload := map[string]interface{}{
		"fields": map[string][]string{
			updateData.Field: updateData.UpdatedRecordid,
		},
	}

	// Convert payload to JSON
	jsonData, err := json.Marshal(payload)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to marshal JSON: %v\n", err)
		appserver.FormAndSendHttpResp(resp, "Failed to marshal JSON", http.StatusBadRequest, nil)
		return
	}

	log.FuncDebugTrace(0, "project_id = %v  old_data = %v   new_data = %v, field = %v", updateData.ProjectRecordId, updateData.OldData, updateData.NewData, updateData.Field)
	// Create HTTP request
	req, err = http.NewRequest(http.MethodPut, apiURL, bytes.NewBuffer(jsonData))
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request: %v\n", err)
		appserver.FormAndSendHttpResp(resp, "Failed to marshal JSON", http.StatusBadRequest, nil)
		return
	}

	// Set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+authToken)

	// Make HTTP request
	client := &http.Client{}
	respAPI, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send request: %v\n", err)
		appserver.FormAndSendHttpResp(resp, "failed to update data", http.StatusBadRequest, nil)
		return
	}
	defer respAPI.Body.Close()

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
