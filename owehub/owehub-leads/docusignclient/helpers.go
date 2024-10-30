/**************************************************************************
 *	File            : helpers.go
 * 	DESCRIPTION     : This file contains common helpers used across docusign apis
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package docusignclient

import (
	log "OWEApp/shared/logger"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"time"
)

func callApi(method string, apiUrl string, accessToken string, reqBody interface{}, respBody interface{}) error {
	var (
		err         error
		reqBodyBuff bytes.Buffer
		req         *http.Request
	)

	log.EnterFn(0, "callApi")
	defer log.ExitFn(0, "callApi", err)

	// encode request body into buffer
	err = json.NewEncoder(&reqBodyBuff).Encode(reqBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to encode request body err %v", err)
		return err
	}

	req, err = http.NewRequest(method, apiUrl, &reqBodyBuff)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return err
	}

	// set headers
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", accessToken))

	// send the request
	log.FuncDebugTrace(0, "Calling docusign api %s with data %+v", apiUrl, reqBody)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call api %s err %v", apiUrl, err)
		return err
	}

	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from docusign api err %v", err)
		return err
	}

	if resp.StatusCode == http.StatusUnauthorized {
		log.FuncErrorTrace(0, "Unauthorized access to docusign api")
		return errors.New("unauthorized access to docusign api")
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusAccepted {
		respString := string(respBytes)
		err = fmt.Errorf("call to docusign api %s failed with status code %d, response: %+v", apiUrl, resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return err
	}

	err = json.Unmarshal(respBytes, respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from docusign api err %v", err)
		return err
	}

	log.FuncDebugTrace(0, "Success from docusign api %s with response %+v", apiUrl, respBody)
	return nil
}
