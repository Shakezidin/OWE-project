/**************************************************************************
 *	File            : helpers.go
 * 	DESCRIPTION     : This file contains common helpers used across docusign apis
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package docusignclient

import (
	leadsService "OWEApp/owehub-leads/common"
	log "OWEApp/shared/logger"
	"bytes"
	"crypto/rsa"
	"crypto/x509"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var docusignAccessToken string

func callApi(method string, apiUrl string, reqBody interface{}, respBody interface{}) error {
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
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", docusignAccessToken))

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

func InitializeDocusignClient() error {
	var (
		err       error
		rsaKey    *rsa.PrivateKey
		jwtString string
		req       *http.Request
		respBytes []byte
		respBody  map[string]interface{}
	)

	log.EnterFn(0, "InitializeDocusignClient")
	defer log.ExitFn(0, "InitializeDocusignClient", err)

	jwtToken := jwt.New(jwt.SigningMethodRS256)

	aud, _ := strings.CutSuffix(leadsService.LeadAppCfg.DocusignOathBaseUrl, "/oauth")
	aud, _ = strings.CutPrefix(aud, "https://")

	jwtToken.Claims = jwt.MapClaims{
		"iss":   leadsService.LeadAppCfg.DocusignIntegrationKey,
		"sub":   leadsService.LeadAppCfg.DocusignUserId,
		"aud":   aud,
		"exp":   time.Now().Add(time.Hour).Unix(),
		"iat":   time.Now().Unix(),
		"scope": "signature impersonation",
	}

	log.FuncDebugTrace(0, "JWT Token: %+v", jwtToken.Claims)

	privBlock, _ := pem.Decode([]byte(leadsService.LeadAppCfg.DocusignRsaPrivateKey))
	if privBlock == nil {
		err = fmt.Errorf("Failed to decode private key")
		return err
	}

	rsaKey, err = x509.ParsePKCS1PrivateKey(privBlock.Bytes)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse private key err: %v", err)
		return err
	}

	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate JWT token for Login err: %v", err)
		return err
	}

	jwtString, err = jwtToken.SignedString(rsaKey)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate JWT token for Docusign err: %v", err)
		return err
	}

	apiUrl := fmt.Sprintf("%s/token", leadsService.LeadAppCfg.DocusignOathBaseUrl)
	data := bytes.NewBufferString(fmt.Sprintf("grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=%s", jwtString))
	req, err = http.NewRequest(http.MethodPost, apiUrl, data)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create request err %v", err)
		return err
	}

	// set headers
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	// send the request
	log.FuncDebugTrace(0, "Calling docusign oauth api with jwt %s", jwtString)
	client := &http.Client{
		Timeout: 30 * time.Second,
	}
	resp, err := client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to call docusgin oauth api err %v", err)
		return err
	}

	defer resp.Body.Close()

	respBytes, err = io.ReadAll(resp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from docusign api err %v", err)
		return err
	}

	if resp.StatusCode != http.StatusOK {
		respString := string(respBytes)
		err = fmt.Errorf("call to docusign oauth api failed with status code %d, response: %+v", resp.StatusCode, respString)
		log.FuncErrorTrace(0, "%v", err)
		return err
	}

	err = json.Unmarshal(respBytes, &respBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal response body from docusign api err %v", err)
		return err
	}

	accessToken, ok := respBody["access_token"].(string)
	if !ok {
		err = fmt.Errorf("Failed to get access token from docusign api")
		return err
	}

	docusignAccessToken = accessToken
	log.FuncDebugTrace(0, "Success from docusign oauth api with response %+v", respBody)

	return nil
}
