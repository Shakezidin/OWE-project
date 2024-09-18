package services

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
)

/******************************************************************************
 * FUNCTION:				assignUserRoleToPodioId
 * DESCRIPTION:     to assign the category id in podio based on user role
 * INPUT:						resp, req
 * RETURNS:    			int
 ******************************************************************************/
func assignUserRoleToPodioId(role string) int {
	var positionId int
	switch role {
	case "Sale Representative":
		positionId = 2
	case "Regional Manager":
		positionId = 3
	case "Sales Manager":
		positionId = 4
	case "Dealer Owner":
		positionId = 5
	default:
		positionId = 0
	}
	return positionId
}

/******************************************************************************
 * FUNCTION:				generatePodioAccessCode
 * DESCRIPTION:     to get the podio access code
 * INPUT:						resp, req
 * RETURNS:    			string
 ******************************************************************************/
func generatePodioAccessCode() (string, error) {
	var err error
	log.EnterFn(0, "generatePodioAccessCode")
	defer func() { log.ExitFn(0, "generatePodioAccessCode", err) }()

	clientID := types.CommGlbCfg.PodioCfg.PodioConfigs[1].ClientId
	clientSecret := types.CommGlbCfg.PodioCfg.PodioConfigs[1].ClientSecret
	username := types.CommGlbCfg.PodioCfg.PodioConfigs[1].Username
	password := types.CommGlbCfg.PodioCfg.PodioConfigs[1].Password

	authURL := "https://podio.com/oauth/token"

	data := url.Values{}
	data.Set("grant_type", "password")
	data.Set("username", username)
	data.Set("password", password)
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)

	resp, err := http.PostForm(authURL, data)
	if err != nil {
		fmt.Println("Error making authentication request:", err)
		return "", err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return "", err
	}

	var tokenResponse models.AccessTokenResponse
	if err := json.Unmarshal(body, &tokenResponse); err != nil {
		fmt.Println("Error parsing access token response:", err)
		return "", err
	}

	return tokenResponse.AccessToken, nil
}

/******************************************************************************
 * FUNCTION:				CreateOrUpdatePodioUser
 * DESCRIPTION:     creates or updates a user in Podio based on existence
 * INPUT:						userData, podioAccessToken
 * RETURNS:    			error
 ******************************************************************************/
func CreateOrUpdatePodioUser(userData models.CreateUserReq, podiodata models.PodioDatas, podioAccessToken string, userExists bool) error {
	var err error
	log.EnterFn(0, "CreateOrUpdatePodioUser")
	defer func() { log.ExitFn(0, "CreateOrUpdatePodioUser", err) }()

	if userExists {
		log.FuncInfoTrace(0, "Updating existing user in Podio... with work_email %v", userData.EmailId)
		err = updatePodioUser(userData, podioAccessToken, podiodata)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to update user in Podio; err: %v", err)
			return err
		}
	} else {
		log.FuncInfoTrace(0, "Creating new user in Podio...")
		err := createPodioUser(userData, podioAccessToken, podiodata)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user in Podio; err: %v", err)
			return err
		}
	}

	return nil
}

/******************************************************************************
 * FUNCTION:				createPodioUser
 * DESCRIPTION:     function to handle the user creation in Podio
 * INPUT:						userData, podioAPIURL, podioAccessToken
 * RETURNS:    			error
 ******************************************************************************/
func createPodioUser(userData models.CreateUserReq, podioAccessToken string, podiodata models.PodioDatas) error {
	var err error
	log.EnterFn(0, "createPodioUser")
	defer func() { log.ExitFn(0, "createPodioUser", err) }()

	appID := types.CommGlbCfg.PodioAppCfg.AppId
	log.FuncInfoTrace(0, "Podio Connected with APP: %v", types.CommGlbCfg.PodioAppCfg.AppName)

	podioAPIURL := fmt.Sprintf("https://api.podio.com/item/app/%s/", appID)

	itemPayload := models.CreateItemRequest{
		Fields: map[string]interface{}{
			"title": userData.Name,
			"status": []interface{}{
				1,
			},
			"position": []interface{}{
				podiodata.PositionId,
			},
			"number": []map[string]interface{}{
				{
					"value": userData.MobileNumber,
				},
			},
			"email": []map[string]interface{}{
				{
					"value": userData.EmailId,
				},
			},
			"portal-email": []map[string]interface{}{
				{
					"value": userData.EmailId,
				},
			},
			"podio-username": []map[string]interface{}{
				{
					"value": userData.EmailId,
				},
			},
			"dealer-id": []map[string]interface{}{
				{
					"value": podiodata.PartnerId,
				},
			},
			"dealer": []map[string]interface{}{
				{
					"value": podiodata.DealerItemId,
				},
			},
		},
	}

	payloadBytes, err := json.Marshal(itemPayload)
	if err != nil {
		fmt.Println("Error marshalling payload:", err)
		return err
	}

	client := &http.Client{}
	req, err := http.NewRequest("POST", podioAPIURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.FuncErrorTrace(0, "Error creating new Podio user request: %v", err)
		return err
	}

	req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create Podio user: %v", err)
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading response body")
		return err
	}

	var createItemResponse models.CreateItemResponse
	err = json.Unmarshal(body, &createItemResponse)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse item creation response")
		return err
	}
	itemPodioLink := createItemResponse.ItemPodioLink

	if len(itemPodioLink) == 0 {
		log.FuncErrorTrace(0, "Failed to create podio user")
		return errors.New("failed to create podio user")
	}

	log.FuncInfoTrace(0, "User created in podio succesfully: %v; email: ", userData.Name, userData.EmailId)
	return nil
}

/******************************************************************************
 * FUNCTION:				updatePodioUser
 * DESCRIPTION:     function to handle updating an existing user in Podio
 * INPUT:						userData, podioAPIURL, podioAccessToken
 * RETURNS:    			error
 ******************************************************************************/
func updatePodioUser(userData models.CreateUserReq, podioAccessToken string, podiodata models.PodioDatas) error {
	var err error
	log.EnterFn(0, "updatePodioUser")
	defer func() { log.ExitFn(0, "updatePodioUser", err) }()

	podioAPIURL := fmt.Sprintf("https://api.podio.com/item/%v", podiodata.ItemId)

	itemPayload := models.UpdateItemRequest{
		Fields: map[string]interface{}{},
	}

	if userData.Name != "" {
		itemPayload.Fields["title"] = userData.Name
	}

	if podiodata.PositionId != 0 {
		itemPayload.Fields["position"] = []interface{}{podiodata.PositionId}
	}

	if userData.MobileNumber != "" {
		itemPayload.Fields["number"] = []map[string]interface{}{
			{
				"value": userData.MobileNumber,
			},
		}
	}

	if userData.EmailId != "" {
		itemPayload.Fields["email"] = []map[string]interface{}{
			{
				"value": userData.EmailId,
			},
		}
	}

	if userData.EmailId != "" {
		itemPayload.Fields["portal-email"] = []map[string]interface{}{
			{
				"value": userData.EmailId,
			},
		}
	}

	if userData.EmailId != "" {
		itemPayload.Fields["podio-username"] = []map[string]interface{}{
			{
				"value": userData.EmailId,
			},
		}
	}

	if podiodata.PartnerId != "" {
		itemPayload.Fields["dealer-id"] = []map[string]interface{}{
			{
				"value": podiodata.PartnerId,
			},
		}
	}

	if podiodata.DealerItemId <= 0 {
		itemPayload.Fields["dealer"] = []map[string]interface{}{
			{
				"value": podiodata.DealerItemId,
			},
		}
	}

	payloadBytes, err := json.Marshal(itemPayload)
	if err != nil {
		fmt.Println("Error marshalling payload:", err)
		return err
	}

	client := &http.Client{}
	req, err := http.NewRequest("PUT", podioAPIURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.FuncErrorTrace(0, "Error creating new Podio user request: %v", err)
		return err
	}

	req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create Podio user: %v", err)
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading response body")
		return err
	}

	var podioResponse map[string]interface{}
	err = json.Unmarshal(body, &podioResponse)
	if err != nil {
		log.FuncErrorTrace(0, "Error unmarshalling response: %v", err)
		return err
	}

	if errorValue, exists := podioResponse["error"]; exists {
		errorDesc := podioResponse["error_description"]
		return fmt.Errorf("podio api error: %v - %v", errorValue, errorDesc)
	}

	log.FuncInfoTrace(0, "User updated in podio succesfully: %v; email: %v", userData.Name, userData.EmailId)
	return nil
}
