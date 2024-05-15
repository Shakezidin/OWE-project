/**************************************************************************
 * File       	   : userAuthentication.go
 * DESCRIPTION     : This file contains functions for user authentication
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"fmt"

	"github.com/dgrijalva/jwt-go"
)

const (
	logginSessionTimeMin = 60 * 8
)

type Claims struct {
	EmailId  string `json:"emailid"`
	RoleName string `json:"rolename"`
	jwt.StandardClaims
}

/******************************************************************************
 * FUNCTION:		ValidateUser
 * DESCRIPTION:     Validate the User Credentials from DB
 * INPUT:			credentials
 * RETURNS:    		emailId, roleName, passwordChangeRequired, err
 ******************************************************************************/
func ValidateUser(cread models.Credentials) (emailId string, userName string, roleName string,
	passwordChangeRequired bool, err error) {

	data, err := GetUserInfo(cread.EmailId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to reterieve user login details err: %v", err)
		return emailId, userName, roleName, passwordChangeRequired, err
	}

	if (data == nil) || (len(data) <= 0) {
		err = fmt.Errorf("Failed to reterieve user login details")
		log.FuncErrorTrace(0, "Failed to reterieve user login details err %v", err)
		return emailId, userName, roleName, passwordChangeRequired, err
	}

	reterivedPassword := data[0]["password"].(string)
	err = CompareHashPassword(reterivedPassword, cread.Password)
	if err != nil {
		err = fmt.Errorf("Incorrect Email Id or Password")
		log.FuncErrorTrace(0, "provide user passowrd is not matching with DB password %v", err)
		return emailId, userName, roleName, passwordChangeRequired, err
	}

	emailId = data[0]["email_id"].(string)
	roleName = data[0]["role_name"].(string)
	userName = data[0]["name"].(string)
	if val, ok := data[0]["password_change_required"].(bool); ok {
		passwordChangeRequired = val
	} else {
		/* if not able to read value then set default false */
		passwordChangeRequired = false
	}

	return emailId, userName, roleName, passwordChangeRequired, err
}

/******************************************************************************
 * FUNCTION:		UpdatePassword
 * DESCRIPTION:     Update the user password in DB
 * INPUT:			emailId, roleName, passwordChangeRequired, err
 * RETURNS:    		err
 ******************************************************************************/
func UpdatePassword(newPassword string, userEmailId string) (err error) {
	var (
		query        string
		whereEleList []interface{}

		/* When update password then mark this always false */
		isPasswordChnageReq bool = false
	)

	log.EnterFn(0, "UpdatePassword")
	defer func() { log.ExitFn(0, "UpdatePassword", err) }()

	hashedPassBytes, err := GenerateHashPassword(newPassword)
	if err != nil || hashedPassBytes == nil {
		log.FuncErrorTrace(0, "Failed to hash the new password err: %v", err)
		return err
	}

	query = "UPDATE user_details SET password = $1, password_change_required =$2 where email_id = LOWER($3)"
	whereEleList = append(whereEleList, string(hashedPassBytes))
	whereEleList = append(whereEleList, isPasswordChnageReq)
	whereEleList = append(whereEleList, userEmailId)

	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update the new password err: %v", err)
		return err
	}

	return nil
}

/******************************************************************************
 * FUNCTION:		GetUserInfo
 * DESCRIPTION:     Reterive the User Infor from DB
 * INPUT:			emailId
 * RETURNS:    		true if exists, false otherwise
 ******************************************************************************/
func GetUserInfo(emailId string) (data []map[string]interface{}, err error) {
	var (
		whereEleList []interface{}
	)

	log.EnterFn(0, "GetUserInfo")
	defer func() { log.ExitFn(0, "GetUserInfo", err) }()

	query := `
		SELECT u.user_id, u.name, u.email_id, u.password, u.password_change_required, u.role_id, r.role_name
		FROM user_details u
		JOIN user_roles r ON u.role_id = r.role_id
		`

	if len(emailId) > 0 {
		query += "WHERE LOWER(u.email_id) = LOWER($1)"
		whereEleList = append(whereEleList, emailId)
	} else {
		err = fmt.Errorf("Empty EmailId Received")
		log.FuncErrorTrace(0, "%v", err)
		return nil, err
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to reterieve user login details from DB err: %v", err)
		return nil, err
	}

	if (data == nil) || (len(data) <= 0) {
		err = fmt.Errorf("User does not exist.")
		log.FuncErrorTrace(0, "%v", err)
		return nil, err
	}

	return data, nil
}
