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
	"OWEApp/shared/types"
	"fmt"
	"regexp"
	"strings"
)

type User struct {
	Name       string
	EmailID    string
	Phone      string
	DealerName string
	UserRole   string
	ItemId     int64
}

func SyncHubUsersToPodioOnInit() error {
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
	allUsersQuery = `SELECT ud.user_code, ud.name, ud.email_id, ud.mobile_number, sp.sales_partner_name as dealer_name, ur.role_name, ud.podio_user
			FROM user_details ud
			JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
      JOIN user_roles ur ON ud.role_id = ur.role_id
      WHERE ud.podio_user = True
	`

	oweHubData, err = db.ReteriveFromDB(db.OweHubDbIndex, allUsersQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get users_details data from DB for podio insert err: %v", err)
		return err
	}

	if len(oweHubData) == 0 {
		log.FuncErrorTrace(0, "No users to be inserted to podio")
		return nil
	}

	podioAccessToken, err = generatePodioAccessCode()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate podio access token; err: %v", err)
		return err
	}

	for _, data := range oweHubData {
		var podioUpdateCheck bool
		var itemId int64

		user_code, _ := data["user_code"].(string)
		name, ok1 := data["name"].(string)
		emailId, ok2 := data["email_id"].(string)
		phone, _ := data["mobile_number"].(string)
		dealerName, _ := data["dealer_name"].(string)
		userRole, _ := data["role_name"].(string)

		if !ok1 || !ok2 {
			log.FuncErrorTrace(0, "Failed to fetch name or email id for user_code: %v", user_code)
			continue
		}

		//* this rejects roles other than sale manager, regional manager, sales rep
		if userRole != string(types.RoleSalesManager) && userRole != string(types.RoleRegionalManager) &&
			userRole != string(types.RoleSalesRep) && userRole != string(types.RoleDealerOwner) {
			log.FuncErrorTrace(0, "Non podio user; user_code: %v", user_code)
			continue
		}

		query = fmt.Sprintf(`SELECT name, item_id, phone, work_email, position, dealer_id, dealer, welcome_email, sales_rep_item_id 
													FROM sales_rep_dbhub_schema
													WHERE LOWER(name) = LOWER('%s') AND work_email = '%s'`, name, emailId)
		SaleRepdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get sales_rep_dbhub_schema data from DB for podio insert err: %v", err)
			return err
		}

		if len(SaleRepdata) > 0 {
			itemId, _ = SaleRepdata[0]["item_id"].(int64)
			podioDealerName, _ := SaleRepdata[0]["dealer"].(string)
			podionName, _ := SaleRepdata[0]["name"].(string)
			podioPhone, _ := SaleRepdata[0]["phone"].(string)
			podioEmail, _ := SaleRepdata[0]["work_email"].(string)
			podioPosition, _ := SaleRepdata[0]["position"].(string)

			normalizedPhone := normalizePhoneNumber(phone)
			normalizedPodioPhone := normalizePhoneNumber(podioPhone)

			if strings.EqualFold(name, podionName) &&
				strings.EqualFold(userRole, podioPosition) &&
				strings.EqualFold(emailId, podioEmail) &&
				normalizedPhone == normalizedPodioPhone &&
				strings.EqualFold(dealerName, podioDealerName) {
				log.FuncInfoTrace(0, "No changes detected for user %v; skipping update", name)
				continue
			}

			log.FuncInfoTrace(0, "User %v to be updated in Podio; email: %v", name, emailId)
			podioUpdateCheck = true
		} else {
			log.FuncInfoTrace(0, "User %v to be added in Podio; email: %v", name, emailId)
			podioUpdateCheck = false
		}

		query = fmt.Sprintf(`SELECT item_id, partner_id 
	 					FROM sales_partner_dbhub_schema 
						WHERE LOWER(sales_partner_name) = LOWER('%s');`, dealerName)
		Dealerdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

		if err != nil {
			log.FuncErrorTrace(0, "Failed to get sales_partner_dbhub_schema data from DB for email %v err: %v", emailId, err)
			continue
		}

		if len(Dealerdata) == 0 {
			log.FuncErrorTrace(0, "No dealer is found in podio for mail: %v", emailId)
			continue
		}

		dealerItemId, ok := Dealerdata[0]["item_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "No dealer ItemId found in podio for email: %v", emailId)
			continue
		}

		dealerId, ok := Dealerdata[0]["partner_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "No partner id found in podio for email: %v", emailId)
			continue
		}

		positionId := assignUserRoleToPodioId(userRole)
		if positionId == 0 {
			log.FuncErrorTrace(0, "User role not authorized to be added to podio for email: %v", emailId)
			continue
		}

		podioData := models.PodioDatas{}
		podioData.DealerItemId = dealerItemId
		podioData.PartnerId = dealerId
		podioData.PositionId = positionId
		podioData.ItemId = itemId

		userData := models.CreateUserReq{
			Name:         name,
			MobileNumber: phone,
			EmailId:      emailId,
		}

		err = CreateOrUpdatePodioUser(userData, podioData, podioAccessToken, podioUpdateCheck)
		if err != nil {
			if podioUpdateCheck {
				log.FuncErrorTrace(0, "Failed to update user in podio for email: %v", emailId)
				continue
			} else {
				log.FuncErrorTrace(0, "Failed to add user in podio for email: %v", emailId)
				continue
			}
		}

		if podioUpdateCheck {
			log.FuncInfoTrace(0, "User %v updated succesfully in Podio; email: %v", name, emailId)
		} else {
			log.FuncInfoTrace(0, "User %v added succesfully to Podio; email: %v", name, emailId)
		}
	}
	return nil
}

func normalizePhoneNumber(phone string) string {
	re := regexp.MustCompile(`\D`)
	return re.ReplaceAllString(phone, "")
}
