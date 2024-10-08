/**************************************************************************
 *	File            : aurora.go
 * 	DESCRIPTION     : This file contains common aurora config and helpers
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

import (
	log "OWEApp/shared/logger"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

type AuroraConfig struct {
	TenantId    string `json:"tenantId"`
	BearerToken string `json:"bearerToken"`
	ApiBaseUrl  string `json:"apiBaseUrl"`
}

var AuroraCfg AuroraConfig

/******************************************************************************
	CREATE PROJECT API
******************************************************************************/

type AuroraCreateProjectApi struct {
	ExternalProviderId    string                         `json:"external_provider_id"`
	Name                  string                         `json:"name"`
	CustomerSalutation    string                         `json:"customer_salutation"`
	CustomerFirstName     string                         `json:"customer_first_name"`
	CustomerLastName      string                         `json:"customer_last_name"`
	CustomerEmail         string                         `json:"customer_email"`
	CustomerPhone         string                         `json:"customer_phone"`
	MailingAddress        string                         `json:"mailing_address"`
	OwnerId               string                         `json:"owner_id,omitempty"`
	TeamId                string                         `json:"team_id,omitempty"`
	Status                string                         `json:"status"`
	PreferredSolarModules []string                       `json:"preferred_solar_modules"`
	Tags                  []string                       `json:"tags"`
	PartnerId             string                         `json:"partner_id,omitempty"`
	Location              AuroraCreateProjectApiLocation `json:"location"`
	ProjectType           string                         `json:"project_type,omitempty"`
}
type AuroraCreateProjectApiLocation struct {
	PropertyAddress string `json:"property_address"`
}

type AuroraCreateProjectApiResponse struct {
	Project map[string]interface{} `json:"project"`
}

/******************************************************************************
 * FUNCTION:        AuroraCreateProjectApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			AuroraCreateProjectApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *AuroraCreateProjectApi) Call() (*AuroraCreateProjectApiResponse, error) {
	var (
		err         error
		client      *http.Client
		req         *http.Request
		resp        *http.Response
		reqBodyBuff bytes.Buffer
		respBytes   []byte
		respBody    AuroraCreateProjectApiResponse
	)

	log.EnterFn(0, "AuroraCreateProjectApi.Call")
	defer log.ExitFn(0, "AuroraCreateProjectApi.Call", err)

	// validate required fields
	if api.ExternalProviderId == "" {
		err = fmt.Errorf("cannot create project without ExternalProviderId")
		return nil, err
	}
	if api.Name == "" {
		err = fmt.Errorf("cannot create project without Name")
		return nil, err
	}
	if api.CustomerSalutation == "" {
		err = fmt.Errorf("cannot create project without CustomerSalutation")
		return nil, err
	}
	if api.CustomerFirstName == "" {
		err = fmt.Errorf("cannot create project without CustomerFirstName")
		return nil, err
	}
	if api.CustomerLastName == "" {
		err = fmt.Errorf("cannot create project without CustomerLastName")
		return nil, err
	}
	if api.CustomerEmail == "" {
		err = fmt.Errorf("cannot create project without CustomerEmail")
		return nil, err
	}
	if api.CustomerPhone == "" {
		err = fmt.Errorf("cannot create project without CustomerPhone")
		return nil, err
	}
	if api.MailingAddress == "" {
		err = fmt.Errorf("cannot create project without MailingAddress")
		return nil, err
	}
	if api.Status == "" {
		err = fmt.Errorf("cannot create project without Status")
		return nil, err
	}
	if api.PreferredSolarModules == nil {
		err = fmt.Errorf("cannot create project without PreferredSolarModules")
		return nil, err
	}
	if api.Tags == nil {
		err = fmt.Errorf("cannot create project without Tags")
		return nil, err
	}
	if api.Location.PropertyAddress == "" {
		err = fmt.Errorf("cannot create project without Location.PropertyAddress")
		return nil, err
	}

	endPt := fmt.Sprintf("%s/tenants/%s/projects", AuroraCfg.ApiBaseUrl, AuroraCfg.TenantId)

	err = json.NewEncoder(&reqBodyBuff).Encode(map[string]*AuroraCreateProjectApi{
		"project": api,
	})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to encode request body err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req, err = http.NewRequest("POST", endPt, &reqBodyBuff)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", AuroraCfg.BearerToken))
	req.Header.Set("Content-Type", "application/json")

	log.FuncDebugTrace(0, "Creating aurora project with data %+v", api)
	client = &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err = client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora create project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to aurora create project failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, fmt.Errorf("server side error: %s", respString)
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from aurora create project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	log.FuncDebugTrace(0, "Successfully created aurora project with response %+v", respBody.Project)
	return &respBody, nil
}

/******************************************************************************
	CREATE DESIGN API
******************************************************************************/

type AuroraCreateDesignApi struct {
	ExternalProviderId string `json:"external_provider_id"`
	ProjectId          string `json:"project_id"`
	Name               string `json:"name"`
}

type AuroraCreateDesignApiResponse struct {
	Design map[string]interface{} `json:"design"`
}

/******************************************************************************
 * FUNCTION:        AuroraCreateDesignApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			AuroraCreateDesignApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *AuroraCreateDesignApi) Call() (*AuroraCreateDesignApiResponse, error) {
	var (
		err         error
		client      *http.Client
		req         *http.Request
		resp        *http.Response
		reqBodyBuff bytes.Buffer
		respBytes   []byte
		respBody    AuroraCreateDesignApiResponse
	)

	log.EnterFn(0, "AuroraCreateDesignApi.Call")
	defer log.ExitFn(0, "AuroraCreateDesignApi.Call", err)

	// validate required fields
	if api.ExternalProviderId == "" {
		err = fmt.Errorf("cannot create design without ExternalProviderId")
		return nil, err
	}
	if api.ProjectId == "" {
		err = fmt.Errorf("cannot create design without ProjectId")
		return nil, err
	}
	if api.Name == "" {
		err = fmt.Errorf("cannot create design without Name")
		return nil, err
	}

	endPt := fmt.Sprintf("%s/tenants/%s/designs", AuroraCfg.ApiBaseUrl, AuroraCfg.TenantId)

	err = json.NewEncoder(&reqBodyBuff).Encode(map[string]*AuroraCreateDesignApi{
		"design": api,
	})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to encode request body err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req, err = http.NewRequest("POST", endPt, &reqBodyBuff)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", AuroraCfg.BearerToken))
	req.Header.Set("Content-Type", "application/json")

	log.FuncDebugTrace(0, "Creating aurora design with data %+v", api)
	client = &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err = client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora design err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora create design err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to aurora create design failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, fmt.Errorf("server side error: %s", respString)
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from aurora create design err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	log.FuncDebugTrace(0, "Successfully created aurora design with response %+v", respBody.Design)
	return &respBody, nil
}

/**************************************************************************
	CREATE PROPOSAL API
**************************************************************************/

type AuroraCreateProposalApi struct {
	DesignId           string `json:"design_id,omitempty"`
	ProposalTemplateId string `json:"proposal_template_id,omitempty"`
}

type AuroraCreateProposalApiResponse struct {
	Proposal map[string]interface{} `json:"proposal"`
}

/******************************************************************************
 * FUNCTION:        AuroraCreateProposalApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			AuroraCreateProposalApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *AuroraCreateProposalApi) Call() (*AuroraCreateProposalApiResponse, error) {
	var (
		err         error
		client      *http.Client
		req         *http.Request
		resp        *http.Response
		reqBodyBuff bytes.Buffer
		respBytes   []byte
		respBody    *AuroraCreateProposalApiResponse
	)

	log.EnterFn(0, "AuroraCreateProposalApi.Call")
	defer log.ExitFn(0, "AuroraCreateProposalApi.Call", err)

	// validate required fields
	if api.DesignId == "" {
		err = fmt.Errorf("cannot create proposal without DesignId")
		return nil, err
	}

	endPt := fmt.Sprintf("%s/tenants/%s/designs/%s/proposals/default", AuroraCfg.ApiBaseUrl, AuroraCfg.TenantId, api.DesignId)

	err = json.NewEncoder(&reqBodyBuff).Encode(map[string]*AuroraCreateProposalApi{
		"proposal": {
			ProposalTemplateId: api.ProposalTemplateId,
		},
	})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to encode request body err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req, err = http.NewRequest("POST", endPt, &reqBodyBuff)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", AuroraCfg.BearerToken))
	req.Header.Set("Content-Type", "application/json")

	log.FuncDebugTrace(0, "Creating aurora proposal with data %+v", api)
	client = &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err = client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create aurora proposal err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora create proposal err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to aurora create proposal failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, fmt.Errorf("server side error: %s", respString)
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from aurora create proposal err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	log.FuncDebugTrace(0, "Successfully created aurora proposal with response %+v", respBody.Proposal)
	return respBody, nil
}

/******************************************************************************
	RETRIEVE PROJECT API
******************************************************************************/

type AuroraRetrieveProjectApi struct {
	ProjectId string `json:"project_id"`
}

type AuroraRetrieveProjectApiResponse struct {
	Project map[string]interface{} `json:"project"`
}

/******************************************************************************
 * FUNCTION:        AuroraRetrieveProjectApi.Call
 *
 * DESCRIPTION:     This function in used to call aurora api
 * INPUT:			AuroraRetrieveProjectApi
 * RETURNS:         []byte, error
 ******************************************************************************/
func (api *AuroraRetrieveProjectApi) Call() (*AuroraRetrieveProjectApiResponse, error) {
	var (
		err       error
		client    *http.Client
		req       *http.Request
		resp      *http.Response
		respBytes []byte
		respBody  AuroraRetrieveProjectApiResponse
	)

	log.EnterFn(0, "AuroraRetrieveProjectApi.Call")
	defer log.ExitFn(0, "AuroraRetrieveProjectApi.Call", err)

	// validate required fields
	if api.ProjectId == "" {
		err = fmt.Errorf("cannot retrieve project without ProjectId")
		return nil, err
	}

	endPt := fmt.Sprintf("%s/tenants/%s/projects/%s", AuroraCfg.ApiBaseUrl, AuroraCfg.TenantId, api.ProjectId)

	req, err = http.NewRequest("GET", endPt, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", AuroraCfg.BearerToken))
	req.Header.Set("Content-Type", "application/json")

	log.FuncDebugTrace(0, "Retrieving aurora project with data %+v", api)
	client = &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err = client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora retrieve project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to aurora retrieve project failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return nil, fmt.Errorf("server side error: %s", respString)
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from aurora retrieve project err %v", err)
		return nil, fmt.Errorf("server side error")
	}

	log.FuncDebugTrace(0, "Successfully retrieved aurora project with response %+v", respBody.Project)
	return &respBody, nil
}
