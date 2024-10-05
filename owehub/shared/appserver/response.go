/**************************************************************************
 * Function        : response.go
 * DESCRIPTION     : This file contains common function for http
 * DATE            : 16-Sept-2024
 **************************************************************************/

package appserver

import (
	"encoding/json"
	"net/http"

	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
)

func FormAndSendHttpResp(httpResp http.ResponseWriter, message string, httpStatusCode int, data types.Data, dbRecCount ...int64) {
	log.EnterFn(0, "FormAndSendHttpResp")
	defer func() { log.ExitFn(0, "FormAndSendHttpResp", nil) }()
	// Check if dbRecCount is provided
	var count int64
	if len(dbRecCount) > 0 {
		count = dbRecCount[0]
	}

	response := types.ApiResponse{
		Status:     httpStatusCode,
		Message:    message,
		DbRecCount: count,
		Data:       data,
	}

	jsonResp, err := json.Marshal(response)
	if err != nil {
		httpResp.Header().Set("Content-Type", "application/json; charset=UTF-8")
		httpResp.WriteHeader(http.StatusInternalServerError)
		httpResp.Write([]byte("Error marshaling response"))
		return
	} else {
		httpResp.Header().Set("Content-Type", "application/json; charset=UTF-8")
		httpResp.WriteHeader(httpStatusCode)
		httpResp.Write([]byte(jsonResp))
	}
}
