/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	log "OWEApp/shared/logger"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type SSERespPayload struct {
	Data   map[string]interface{} `json:"data"`
	IsDone bool                   `json:"is_done"`
}

/******************************************************************************
 * FUNCTION:        HandleAuroraGeneratePdfRequest
 *
 * DESCRIPTION:     This function will handle the request to generate a pdf
 *                  in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraGeneratePdfRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		ssePayloadBytes []byte
	)
	log.EnterFn(0, "HandleAuroraGeneratePdfRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGeneratePdfRequest", err) }()

	resp.Header().Set("Content-Type", "text/event-stream")
	resp.Header().Set("Cache-Control", "no-cache")
	resp.Header().Set("Connection", "keep-alive")

	respController := http.NewResponseController(resp)
	clientGone := req.Context().Done()

	for i := 0; i < 10; i++ {
		ssePayloadBytes, err = json.Marshal(SSERespPayload{
			Data: map[string]interface{}{
				"step": i + 1,
			},
			IsDone: i == 9,
		})

		if err != nil {
			return
		}

		_, err = fmt.Fprintf(resp, "data: %s\n\n", string(ssePayloadBytes))
		if err != nil {
			return
		}
		err = respController.Flush()
		if err != nil {
			return
		}
		time.Sleep(time.Second)
	}

	<-clientGone

}
