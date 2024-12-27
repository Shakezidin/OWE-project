/**************************************************************************
 *	File            : helpers.go
 * 	DESCRIPTION     : This file contains common helpers used across aurora api
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package auroraclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

func callApi(method string, apiPath string, reqBody interface{}, respBody interface{}) error {
	var (
		err         error
		reqBodyBuff bytes.Buffer
		req         *http.Request
	)

	log.EnterFn(0, "callApi")
	defer log.ExitFn(0, "callApi", err)

	// encode request body into buffer

	// get api url & create the request
	apiUrl := leadsService.LeadAppCfg.AuroraApiBaseUrl +
		strings.ReplaceAll(apiPath, "{tenant_id}", leadsService.LeadAppCfg.AuroraTenantId)

	if reqBody != nil {
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
	} else {
		req, err = http.NewRequest(method, apiUrl, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create request err %v", err)
			return err
		}
	}

	// set headers
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", leadsService.LeadAppCfg.AuroraBearerToken))
	req.Header.Set("Content-Type", "application/json")

	// send the request
	log.FuncDebugTrace(0, "Calling aurora api %s with data %+v", apiPath, reqBody)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call api %s err %v", apiPath, err)
		return err
	}

	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora api err %v", err)
		return err
	}

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusAccepted {
		respString := string(respBytes)
		err = fmt.Errorf("call to aurora api %s failed with status code %d, response: %+v", apiPath, resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return err
	}

	err = json.Unmarshal(respBytes, respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from aurora api err %v", err)
		return err
	}

	log.FuncDebugTrace(0, "Success from aurora api %s with response %+v", apiPath, respBody)
	return nil
}
