package services

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"bytes"
	"encoding/json"
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
		positionId = 7
	case "Sales Manager":
		positionId = 8
	case "Dealer Owner":
		positionId = 6
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

	authURL := "https://podio.com/oauth/token"

	for _, podioConfig := range types.CommGlbCfg.PodioCfg.PodioConfigs {
			clientID := podioConfig.ClientId
			clientSecret := podioConfig.ClientSecret
			username := podioConfig.Username
			password := podioConfig.Password

			data := url.Values{}
			data.Set("grant_type", "password")
			data.Set("username", username)
			data.Set("password", password)
			data.Set("client_id", clientID)
			data.Set("client_secret", clientSecret)

			resp, err := http.PostForm(authURL, data)
			if err != nil {
					fmt.Printf("Error making authentication request for config %s: %v\n", podioConfig.ClientId, err)
					continue
			}
			defer resp.Body.Close()

			body, err := ioutil.ReadAll(resp.Body)
			if err != nil {
					fmt.Printf("Error reading response body for config %s: %v\n", podioConfig.ClientId, err)
					continue
			}

			var tokenResponse models.AccessTokenResponse
			if err := json.Unmarshal(body, &tokenResponse); err != nil {
					fmt.Printf("Error parsing access token response for config %s: %v\n", podioConfig.ClientId, err)
					continue
			}

			if tokenResponse.AccessToken != "" {
					return tokenResponse.AccessToken, nil
			}
	}

	err = fmt.Errorf("failed to generate Podio access code with any configuration")
	return "", err
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
		log.FuncErrorTrace(0, "Error creating new Podio user request; email %v; err: %v", userData.EmailId, err)
		return err
	}

	req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create Podio user; email %v; err: %v", userData.EmailId, err)
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading response body; email %v; err: %v", userData.EmailId, err)
		return err
	}

	var createItemResponse models.CreateItemResponse
	err = json.Unmarshal(body, &createItemResponse)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse item creation response; email %v; err: %v", userData.EmailId, err)
		return err
	}
	itemPodioLink := createItemResponse.ItemPodioLink

	if len(itemPodioLink) == 0 {
		log.FuncErrorTrace(0, "Failed to create podio user; email %v err: %v", userData.EmailId, err)
		err = fmt.Errorf("failed to create podio user; email %v", userData.EmailId)
		return err
	}

	log.FuncInfoTrace(0, "User created in podio succesfully: %v; email: %v", userData.Name, userData.EmailId)
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

	if podiodata.DealerItemId > 0 {
		itemPayload.Fields["dealer"] = []map[string]interface{}{
			{
				"value": podiodata.DealerItemId,
			},
		}
	}

	payloadBytes, err := json.Marshal(itemPayload)
	if err != nil {
		log.FuncInfoTrace(0, "Error marshalling payload:; email %v; err: %v", userData.EmailId, err)
		return err
	}

	client := &http.Client{}
	req, err := http.NewRequest("PUT", podioAPIURL, bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.FuncErrorTrace(0, "Error creating new Podio user request: ; email %v; err: %v", userData.EmailId, err)
		return err
	}

	req.Header.Set("Authorization", "OAuth2 "+podioAccessToken)
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create Podio user: ; email %v; err: %v", userData.EmailId, err)
		return err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Error reading response body; email %v; err: %v", userData.EmailId, err)
		return err
	}

	var podioResponse map[string]interface{}
	err = json.Unmarshal(body, &podioResponse)
	if err != nil {
		log.FuncErrorTrace(0, "Error unmarshalling response; email %v; err: %v", userData.EmailId, err)
		return err
	}

	if errorValue, exists := podioResponse["error"]; exists {
		errorDesc := podioResponse["error_description"]
		err = fmt.Errorf("podio api error: %v - %v", errorValue, errorDesc)
		return err
	}

	log.FuncInfoTrace(0, "User updated in podio succesfully: %v; email: %v", userData.Name, userData.EmailId)
	return nil
}
