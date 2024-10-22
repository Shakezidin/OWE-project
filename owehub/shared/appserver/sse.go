package appserver

import (
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"encoding/json"
	"fmt"
	"net/http"
)

type SSEHandler struct {
	respController   *http.ResponseController
	req              *http.Request
	resp             *http.ResponseWriter
	clientDisconnect <-chan struct{}
}

/******************************************************************************
 * FUNCTION:        NewSSEHandler
 *
 * DESCRIPTION:     This function will create a new SSE handler
 * INPUT:			resp, req
 * RETURNS:    		SSEHandler
 ******************************************************************************/
func NewSSEHandler(resp http.ResponseWriter, req *http.Request) *SSEHandler {
	resp.Header().Set("Content-Type", "text/event-stream")
	resp.Header().Set("Cache-Control", "no-cache")
	resp.Header().Set("Connection", "keep-alive")

	return &SSEHandler{
		req:              req,
		resp:             &resp,
		respController:   http.NewResponseController(resp),
		clientDisconnect: req.Context().Done(),
	}
}

// private helper to send a server sent event
func (handler *SSEHandler) sendPayload(payload types.SSERespPayload) error {
	var (
		err             error
		ssePayloadBytes []byte
	)
	log.EnterFn(0, "SSEHandler.sendWithPayload")
	defer func() { log.ExitFn(0, "SSEHandler.sendWithPayload", err) }()

	ssePayloadBytes, err = json.Marshal(payload)
	if err != nil {
		handler.SendError("Failed to marshal data to json")
		return err
	}
	_, err = fmt.Fprintf(*handler.resp, "data: %s\n\n", string(ssePayloadBytes))
	if err != nil {
		handler.SendError("Failed to write to response")
		return err
	}

	handler.respController.Flush()
	return nil
}

/******************************************************************************
 * FUNCTION:        SSEHandler.SendError
 *
 * DESCRIPTION:     This function sends an SSE with error payload
 * INPUT:			error message
 * RETURNS:    		N/A
 ******************************************************************************/
func (handler *SSEHandler) SendError(errorMsg string) {
	var err error

	log.EnterFn(0, "SSEHandler.SendError")
	defer func() { log.ExitFn(0, "SSEHandler.SendError", err) }()

	errJson := fmt.Sprintf("{\"is_done\":true, \"error\": \"%s\", \"data\": null}", errorMsg)
	_, err = fmt.Fprintf(*handler.resp, "data: %s\n\n", errJson)
	if err != nil {
		return
	}
	handler.respController.Flush()
}

/******************************************************************************
 * FUNCTION:        SSEHandler.SendData
 *
 * DESCRIPTION:     This function sends arbitrary payload as SSE
 * INPUT:			payload
 * RETURNS:    		error
 ******************************************************************************/
func (handler *SSEHandler) SendData(payload map[string]interface{}) error {
	var err error
	log.EnterFn(0, "SSEHandler.SendData")
	defer func() { log.ExitFn(0, "SSEHandler.SendData", err) }()

	err = handler.sendPayload(types.SSERespPayload{IsDone: false, Data: payload})
	return err
}

/******************************************************************************
 * FUNCTION:        SSEHandler.SendData
 *
 * DESCRIPTION:     Use this function to send last SSE to the client
 * INPUT:			payload
 * RETURNS:    		error
 ******************************************************************************/
func (handler *SSEHandler) EndResponse(payload map[string]interface{}) error {
	var err error
	log.EnterFn(0, "SSEHandler.EndResponse")
	defer func() { log.ExitFn(0, "SSEHandler.EndResponse", err) }()

	err = handler.sendPayload(types.SSERespPayload{IsDone: false, Data: payload})
	<-handler.clientDisconnect
	return err
}
