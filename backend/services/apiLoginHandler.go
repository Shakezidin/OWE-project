/**************************************************************************
 * File       	   : apiLoginHandler.go
 * DESCRIPTION     : This file contains functions for login handler
 * DATE            : 14-Jan-2024
 **************************************************************************/

package services

import (
	db "OWEApp/db"
	log "OWEApp/logger"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

var (
	jwtKey = []byte("9B$Vw#pLX6aY)0~[<l4?NjT+-yS=%s?bP/3C{m1G*!KQ]nJ`u>E)Dh]l;1Rx6Y`#X=[<k^C~Y}R-*b~K_ym0K&N=JVtnzRf@9z=c%B>Xt`ya9Ug(Uj")
)

const (
	logginSessionTimeMin = 50
)

type Credentials struct {
	EmailId  string `json:"emailid"`
	Password string `json:"password"`
}

type Claims struct {
	EmailId  string `json:"emailid"`
	RoleName string `json:"rolename"`
	jwt.StandardClaims
}

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
 ******************************************************************************/
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
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		err = fmt.Errorf("Failed to read HTTP Request body from Login request")
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest)
		return
	}

	err = json.Unmarshal(reqBody, &creds)
	if err != nil {
		err = fmt.Errorf("Failed to unmarshal Login request")
		FormAndSendHttpResp(resp, "Failed to unmarshal Login request", http.StatusBadRequest)
		return
	}

	if (len(creds.Password) <= 0) && (len(creds.EmailId) <= 0) {
		err = fmt.Errorf("empty emailId or password received in login request")
		FormAndSendHttpResp(resp, "Empty emailId or password", http.StatusBadRequest)
		return
	}

	emailId, roleName, passwordChangeRequired, err = ValidateUser(creds)
	if (err != nil) || (len(emailId) <= 0) || (len(roleName) <= 0) {
		err = fmt.Errorf("Failed to Validate User Unauthorize access")
		FormAndSendHttpResp(resp, "Unauthorize access", http.StatusUnauthorized)
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
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		err = fmt.Errorf("Failed to generate JWT token for Login")
		FormAndSendHttpResp(resp, "Unauthorize access", http.StatusInternalServerError)
		return
	}

	loginResp.EmailId = emailId
	loginResp.RoleName = roleName
	loginResp.IsPasswordChangeRequired = passwordChangeRequired
	loginResp.JwtToken = tokenString

	jsonResp, err := json.Marshal(loginResp)
	if err != nil {
		FormAndSendHttpResp(resp, "Error marshaling response", http.StatusInternalServerError)
		return
	}

	log.FuncInfoTrace(0, "Login Sucessfull for User : %v", creds.EmailId)
	FormAndSendHttpResp(resp, string(jsonResp), http.StatusOK)
}

/******************************************************************************
 * FUNCTION:		ValidateUser
 * DESCRIPTION:     Validate the User Credentials from DB
 * INPUT:			emailId, roleName, passwordChangeRequired, err
 * RETURNS:    		void
 ******************************************************************************/
func ValidateUser(cread Credentials) (emailId string, roleName string,
	passwordChangeRequired bool, err error) {
	var (
		whereEleList []interface{}
	)

	log.EnterFn(0, "ValidateUser")
	defer func() { log.ExitFn(0, "ValidateUser", err) }()

	query := `
		SELECT u.user_id, u.email_id, u.password, u.passwordChangeRequired, u.role_id, r.role_name
		FROM user_auth u
		JOIN user_roles r ON u.role_id = r.role_id
		`

	if len(cread.EmailId) > 0 {
		query += "WHERE LOWER(u.email_id) = LOWER($1)"
		whereEleList = append(whereEleList, cread.EmailId)
	} else {
		log.FuncErrorTrace(0, "Empty EmailId Received")
		err = fmt.Errorf("empty emailid received")
		return emailId, roleName, passwordChangeRequired, err
	}

	data, err := db.ReteriveFromDB(query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to reterieve user login details from DB err: %v", err)
		return emailId, roleName, passwordChangeRequired, err
	}

	if (data == nil) || (len(data) <= 0) {
		log.FuncErrorTrace(0, "Empty user info reterived from db data: %v", data)
		err = fmt.Errorf("empty user info reterived")
		return emailId, roleName, passwordChangeRequired, err
	}

	reterivedPassword := data[0]["password"].(string)
	err = CompareHashPassword(reterivedPassword, cread.Password)
	if err != nil {
		log.FuncErrorTrace(0, "Invalid password, did not matched with DB: %v", data)
		err = fmt.Errorf("invalid password, did not matched with db")
		return emailId, roleName, passwordChangeRequired, err
	}

	emailId = data[0]["email_id"].(string)
	roleName = data[0]["role_name"].(string)
	if val, ok := data[0]["passwordchangerequired"].(bool); ok {
		passwordChangeRequired = val
	} else {
		/* if not able to read value then set default false */
		passwordChangeRequired = false
	}

	return emailId, roleName, passwordChangeRequired, err
}
