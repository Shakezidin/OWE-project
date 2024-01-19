/**************************************************************************
 * File       	   : userAuthentication.go
 * DESCRIPTION     : This file contains functions for user authentication
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	db "OWEApp/db"
	log "OWEApp/logger"

	"fmt"

	"github.com/dgrijalva/jwt-go"
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
