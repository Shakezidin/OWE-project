/**************************************************************************
 * File       	   : initPodioUser.go
 * DESCRIPTION     : This file contains functions to initialize podio user
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"fmt"
)

type User struct {
	Name       string
	EmailID    string
	Phone      string
	DealerName string
	RoleId     int64
}

func InitPodioUsers() error {
	var (
		err              error
		oweHubData       []map[string]interface{}
		Dealerdata       []map[string]interface{}
		allUsersQuery    string
		SaleRepdata      []map[string]interface{}
		query            string
		podioAccessToken string
	)

	//* fetch all users from OWE-HUB
	allUsersQuery = `SELECT ud.user_code, ud.name, ud.email_id, ud.mobile_number, vd.dealer_name, ud.role_id
			FROM user_details ud
			JOIN v_dealer vd ON ud.dealer_id = vd.id
	`
	oweHubData, err = db.ReteriveFromDB(db.OweHubDbIndex, allUsersQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get users_details data from DB for podio insert err: %v", err)
		return err
	}

	var oweHubusers []User
	for _, data := range oweHubData {
		user_code, _ := data["user_code"].(string)
		name, ok1 := data["name"].(string)
		emailId, ok2 := data["email_id"].(string)
		phone, _ := data["mobile_number"].(string)
		dealerName, _ := data["dealer_name"].(string)
		RoleId, _ := data["role_id"].(int64)

		if !ok1 || !ok2 {
			log.FuncErrorTrace(0, "Failed to fetch name or email id for user_code: %v", user_code)
			continue
		}

		if RoleId != 5 && RoleId != 6 && RoleId != 7 {
			log.FuncErrorTrace(0, "Non podio user; user_code: %v", user_code)
			continue
		}

		user := User{
			Name:       name,
			EmailID:    emailId,
			Phone:      phone,
			DealerName: dealerName,
			RoleId:     RoleId,
		}
		oweHubusers = append(oweHubusers, user)
	}

	//* check the user exists in podio
	query = "SELECT name, item_id, work_email, dealer_id, dealer, welcome_email, sales_rep_item_id FROM sales_rep_dbhub_schema"
	SaleRepdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales_rep_dbhub_schema data from DB for podio insert err: %v", err)
		return err
	}

	var oweDbusers []User
	for _, data := range SaleRepdata {
		itemId, _ := data["item_id"].(int64)
		name, ok1 := data["name"].(string)
		emailId, ok2 := data["work_email"].(string)

		if !ok1 || !ok2 {
			log.FuncErrorTrace(0, "Failed to fetch name or email id for item_id: %v", itemId)
			continue
		}

		user := User{
			Name:    name,
			EmailID: emailId,
		}
		oweDbusers = append(oweDbusers, user)
	}

	var userDoesNotExist []User
	oweDbUserMap := make(map[string]bool)
	for _, dbUser := range oweDbusers {
		oweDbUserMap[dbUser.EmailID] = true
	}

	//* checking user alreay exists or not
	for _, hubUser := range oweHubusers {
		if _, exists := oweDbUserMap[hubUser.EmailID]; !exists {
			userDoesNotExist = append(userDoesNotExist, hubUser)
		}
	}

	podioAccessToken, err = generatePodioAccessCode()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate podio access token; err: %v", err)
		return err
	}

	for _, hubUser := range userDoesNotExist {
		query = fmt.Sprintf(`SELECT item_id, partner_id 
	 					FROM sales_partner_dbhub_schema 
						WHERE sales_partner_name = '%s';`, hubUser.DealerName)
		Dealerdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get sales_partner_dbhub_schema data from DB for email %v err: %v", hubUser.EmailID, err)
			continue
		}

		if len(Dealerdata) == 0 {
			log.FuncErrorTrace(0, "No dealer is found in podio for email: %v", hubUser.EmailID)
			continue
		}

		dealerItemId, ok := Dealerdata[0]["item_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "No dealer ItemId found in podio for email: %v", hubUser.EmailID)
			continue
		}

		dealerId, ok := Dealerdata[0]["partner_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "No partner id found in podio for email: %v", hubUser.EmailID)
			continue
		}

		positionId := assignRoleToPodioId(hubUser.RoleId)
		if positionId == 0 {
			log.FuncErrorTrace(0, "User role not authorized to be added to podio for email: %v", hubUser.EmailID)
			continue
		}

		podioData := models.PodioDatas{}
		podioData.DealerItemId = dealerItemId
		podioData.PartnerId = dealerId
		podioData.PositionId = positionId

		userData := models.CreateUserReq{
			Name:         hubUser.Name,
			MobileNumber: hubUser.Phone,
			EmailId:      hubUser.EmailID,
		}

		err = CreateOrUpdatePodioUser(userData, podioData, podioAccessToken, false)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to create user in podio for email: %v", hubUser.EmailID)
		}
	}
	return nil
}

/******************************************************************************
 * FUNCTION:				assignUserRoleToPodioId
 * DESCRIPTION:     to assign the category id in podio based on user role
 * INPUT:						resp, req
 * RETURNS:    			int
 ******************************************************************************/
func assignRoleToPodioId(role int64) int {
	var positionId int
	switch role {
	case 7: // sale representative
		positionId = 2
	case 5: // regional manager
		positionId = 3
	case 6: // sales manager
		positionId = 4
	default:
		positionId = 0
	}
	return positionId
}
