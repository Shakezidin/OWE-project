/**************************************************************************
 * File       	   : apiLoginHandler.go
 * DESCRIPTION     : This file contains functions for login handler
 * DATE            : 14-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	types "OWEApp/shared/types"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

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
		userName               string
		roleName               string
		passwordChangeRequired bool
		creds                  models.Credentials
		loginResp              models.LoginResp
	)

	log.EnterFn(0, "HandleLoginRequest")
	defer func() { log.ExitFn(0, "HandleLoginRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in Login request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from Login request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &creds)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal Login request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal Login request", http.StatusBadRequest, nil)
		return
	}

	if (len(creds.Password) <= 0) || (len(creds.EmailId) <= 0) {
		err = fmt.Errorf("empty emailId or password received in login request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty emailId or password", http.StatusBadRequest, nil)
		return
	}

	emailId, userName, roleName, passwordChangeRequired, err = ValidateUser(creds)
	if (err != nil) || (len(emailId) <= 0) || (len(roleName) <= 0) {
		log.FuncErrorTrace(0, "Failed to Validate User Unauthorize access err: %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusUnauthorized, nil)
		return
	}

	expirationTime := time.Now().Add(time.Duration(logginSessionTimeMin) * time.Minute)
	claims := &types.Claims{
		EmailId:  emailId,
		RoleName: roleName,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(types.JwtKey)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate JWT token for Login err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Unauthorize access", http.StatusInternalServerError, nil)
		return
	}

	nonDealerRoles := map[string]bool{
		"Admin":             true,
		"Finance Admin":     true,
		"DB User":           true,
		"Account Manager":   true,
		"Account Executive": true,
		"Project Manager":   true,
	}

	if !nonDealerRoles[roleName] {
		query := fmt.Sprintf("SELECT sp.sales_partner_name as dealer_name FROM user_details ud JOIN sales_partner_dbhub_schema sp ON sp.partner_id = ud.partner_id WHERE ud.email_id = '%v'", emailId)
		data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get v Dealer data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get v Dealer data from DB", http.StatusBadRequest, nil)
			return
		}
		if len(data) > 0 {
			loginResp.DealerName = data[0]["dealer_name"].(string)
		}
	}

	loginResp.EmailId = emailId
	loginResp.UserName = userName
	loginResp.RoleName = roleName
	loginResp.IsPasswordChangeRequired = passwordChangeRequired
	loginResp.AccessToken = tokenString
	loginResp.TimeToExpire = logginSessionTimeMin

	log.FuncInfoTrace(0, "Login Successful for User : %v", creds.EmailId)
	appserver.FormAndSendHttpResp(resp, "Login Successful", http.StatusOK, loginResp)
}
