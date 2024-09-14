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
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
)

func DeletePodioUsersByCodes(userCodes []string) error {
	var (
		err         error
		userDetails []map[string]interface{}
		whereClause string
	)

	log.EnterFn(0, "DeletePodioUsersByCodes")
	defer func() { log.ExitFn(0, "DeletePodioUsersByCodes", err) }()

	whereClause = fmt.Sprintf("WHERE user_code IN ('%s')", stringJoin(userCodes, "','"))

	query := fmt.Sprintf(`SELECT name, email_id, user_code
							 FROM user_details %s;`, whereClause)

	userDetails, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get user details from DB err: %v", err)
		return err
	}

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

		email, ok := user["email"].(string)
		if !ok || email == "" {
			log.FuncInfoTrace("User with code %s does not have a valid email", userCode)
			continue
		}

		query := fmt.Sprintf(`
			SELECT name, item_id, work_email, dealer_id, dealer, welcome_email, sales_rep_item_id 
			FROM sales_rep_dbhub_schema 
			WHERE work_email = '%s' AND name = '%s';`, email, name)

		SaleRepdata, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get sales_rep_dbhub_schema data from DB err: %v", err)
			return err
		}

		if len(SaleRepdata) == 0 {
			log.FuncErrorTrace(0, "user %v does not exist in podio", email)
			return fmt.Errorf("user %v does not exist in podio", email)
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
		return err
	}
	deletePodioUserByCode(podioAccessToken, itemIds)

	return nil
}

func stringJoin(elements []string, delimiter string) string {
	return strings.Join(elements, delimiter)
}

func deletePodioUserByCode(podioAccessToken string, itemIds []int64) error {
	appID := "29406203" //* app id for sales rep db in podio
	podioAPIURL := fmt.Sprintf("https://api.podio.com/item/app/%v/delete", appID)

	requestBody := models.PodioDeleteRequest{
		ItemIDs: itemIds,
	}

	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		return fmt.Errorf("failed to marshal request body: %v", err)
	}

	req, err := http.NewRequest("POST", podioAPIURL, bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create HTTP request: %v", err)
	}

	req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("received non-OK response: %d", resp.StatusCode)
	}

	return nil
}
