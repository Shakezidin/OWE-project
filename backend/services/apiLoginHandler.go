/**************************************************************************
 * File       	   : apiLoginHandler.go
 * DESCRIPTION     : This file contains functions for login handler
 * DATE            : 14-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/logger"
	types "OWEApp/types"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

type LoginResp struct {
	EmailId                  string `json:"emailid"`
	RoleName                 string `json:"rolename"`
	IsPasswordChangeRequired bool   `json:"ispasswordchangerequired"`
	JwtToken                 string `json:"jwttoken"`
}

/******************************************************************************
 * FUNCTION:		HandleLoginRequest
 * DESCRIPTION:     handler for login request
 * INPUT:			resp, req
 * RETURNS:    		void
 *****************************************************************************/
func HandleLoginRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		emailId                string
		roleName               string
		passwordChangeRequired bool
		creds                  Credentials
		loginResp              LoginResp
	)

	log.EnterFn(0, "HandleLoginRequest")
	defer func() { log.ExitFn(0, "HandleLoginRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Login request")
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		err = fmt.Errorf("Failed to read HTTP Request body from Login request")
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &creds)
	if err != nil {
		err = fmt.Errorf("Failed to unmarshal Login request")
		FormAndSendHttpResp(resp, "Failed to unmarshal Login request", http.StatusBadRequest, nil)
		return
	}

	if (len(creds.Password) <= 0) || (len(creds.EmailId) <= 0) {
		err = fmt.Errorf("empty emailId or password received in login request")
		FormAndSendHttpResp(resp, "Empty emailId or password", http.StatusBadRequest, nil)
		return
	}

	emailId, roleName, passwordChangeRequired, err = ValidateUser(creds)
	if (err != nil) || (len(emailId) <= 0) || (len(roleName) <= 0) {
		err = fmt.Errorf("Failed to Validate User Unauthorize access")
		FormAndSendHttpResp(resp, "Unauthorize access", http.StatusUnauthorized, nil)
		return
	}

	expirationTime := time.Now().Add(time.Duration(logginSessionTimeMin) * time.Minute)
	claims := &Claims{
		EmailId:  emailId,
		RoleName: roleName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(types.JwtKey)
	if err != nil {
		err = fmt.Errorf("Failed to generate JWT token for Login")
		FormAndSendHttpResp(resp, "Unauthorize access", http.StatusInternalServerError, nil)
		return
	}

	loginResp.EmailId = emailId
	loginResp.RoleName = roleName
	loginResp.IsPasswordChangeRequired = passwordChangeRequired
	loginResp.JwtToken = tokenString

	log.FuncInfoTrace(0, "Login Sucessfull for User : %v", creds.EmailId)
	FormAndSendHttpResp(resp, "Login Sucessfull", http.StatusOK, loginResp)
}
