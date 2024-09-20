/**************************************************************************
 * File       	   : apideletePodioData.go
 * DESCRIPTION     : This file contains functions for delete Podio data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

type DeleteResponse struct {
	Deleted []int64 `json:"deleted"`
	Pending []int64 `json:"pending"`
}

func DeletePodioUsers(userDetails []map[string]interface{}) (error, int) {
	var (
		err error
	)

	log.EnterFn(0, "DeletePodioUsers")
	defer func() { log.ExitFn(0, "DeletePodioUsers", err) }()

	var itemIds []int64
	for _, user := range userDetails {
		userCode, ok := user["user_code"].(string)
		if !ok {
			log.FuncInfoTrace("User does not have a valid user_code", "")
			continue
		}

		name, ok := user["name"].(string)
		if !ok || name == "" {
			log.FuncInfoTrace("User with code %s does not have a valid name", userCode)
			continue
		}

		email, ok := user["email_id"].(string)
		if !ok || email == "" {
			log.FuncInfoTrace("User with code %s does not have a valid email", userCode)
			continue
		}

		RoleId, ok := user["role_id"].(int64)
		if !ok {
			log.FuncInfoTrace("User with code %s does not have a valid role id", userCode)
			continue
		}

		if RoleId != 5 && RoleId != 6 && RoleId != 7 && RoleId != 2 {
			log.FuncErrorTrace(0, "Non podio user; email: %v", email)
			continue
		}

		query := fmt.Sprintf(`
			SELECT name, item_id, work_email, dealer_id, dealer, welcome_email, sales_rep_item_id 
			FROM sales_rep_dbhub_schema 
			WHERE LOWER(work_email) = LOWER('%s') AND LOWER(name) = LOWER('%s');`, email, name)

		SaleRepdata, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get sales_rep_dbhub_schema data from DB err: %v", err)
			return err, 0
		}

		if len(SaleRepdata) == 0 {
			log.FuncErrorTrace(0, "user %v does not exist in podio", email)
			err = fmt.Errorf("user %v does not exist in podio", email)
			return err, 0
		}

		itemId, ok := SaleRepdata[0]["item_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get itemId data from DB for user_code %v; err: %v", userCode, err)
			continue
		}

		if len(SaleRepdata) != 0 {
			itemIds = append(itemIds, itemId)
		} else {
			log.FuncErrorTrace(0, "Failed to get itemId data from DB for user_code %v; err: %v", userCode, err)
			continue
		}
	}

	podioAccessToken, err := generatePodioAccessCode()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate podio access token; err: %v", err)
		return err, 0
	}

	err, itemsDeleted := deletePodioUsers(podioAccessToken, itemIds)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete user from podio; err: %v", err)
		return err, 0
	}

	log.FuncErrorTrace(0, "Item deleted succedfuly from podio;")
	return nil, itemsDeleted
}

func deletePodioUsers(podioAccessToken string, itemIds []int64) (error, int) {
	var err error
	log.EnterFn(0, "deletePodioUsers")
	defer func() { log.ExitFn(0, "deletePodioUsers", err) }()

	appID := types.CommGlbCfg.PodioAppCfg.AppId
	podioAPIURL := fmt.Sprintf("https://api.podio.com/item/app/%v/delete", appID)

	requestBody := models.PodioDeleteRequest{
		ItemIDs: itemIds,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		err = fmt.Errorf("failed to marshal request body: %v", err)
		return err, 0
	}

	maxRetries := 5
	var resp *http.Response

	for try := 1; try <= maxRetries; try++ {
		log.FuncInfoTrace(0, "Attempt %d to delete Podio users", try)

		req, err := http.NewRequest("POST", podioAPIURL, bytes.NewBuffer(jsonData))
		if err != nil {
			err = fmt.Errorf("failed to create HTTP request: %v", err)
			return err, 0
		}

		req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
		req.Header.Set("Content-Type", "application/json")

		client := &http.Client{}
		resp, err = client.Do(req)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to send request on attempt %d: %v", try, err)
			continue
		}
		defer resp.Body.Close()
		if resp.StatusCode == http.StatusOK {
			break
		} else {
			log.FuncErrorTrace(0, "Received non-OK response on attempt %d: %d", try, resp.StatusCode)
		}

		if try == maxRetries {
			err = fmt.Errorf("failed to delete after %d attempts, last status: %d", try, resp.StatusCode)
			return err, 0
		}
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		err = fmt.Errorf("error reading response: %v", err)
		return err, 0
	}
	var response DeleteResponse

	err = json.Unmarshal(body, &response)
	if err != nil {
		err = fmt.Errorf("error parsing JSON: %v", err)
		return err, 0
	}

	return nil, len(response.Deleted)
}
