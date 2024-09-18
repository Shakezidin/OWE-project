/**************************************************************************
 * File       	   : apiGetPodioData.go
 * DESCRIPTION     : This file contains functions for get Podio data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"fmt"
)

/******************************************************************************
 * FUNCTION:		HandleGetPodioDataRequest
 * DESCRIPTION:     handler for get Podio data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleCreatePodioDataRequest(reqData models.CreateUserReq, userRole string) error {
	var (
		err              error
		SaleRepdata      []map[string]interface{}
		Dealerdata       []map[string]interface{}
		whereEleList     []interface{}
		query            string
		userExists       bool
		podioAccessToken string
		itemId           int64
	)

	log.EnterFn(0, "HandleGetPodioDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPodioDataRequest", err) }()

	query = fmt.Sprintf(`SELECT name, item_id, work_email, dealer_id, dealer, welcome_email, sales_rep_item_id 
	 					FROM sales_rep_dbhub_schema 
						WHERE work_email = '%s'
						AND name = '%s';`, reqData.EmailId, reqData.Name)
	SaleRepdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales_rep_dbhub_schema data from DB; email: %v; err: %v", reqData.EmailId, err)
		return err
	}

	if len(SaleRepdata) > 0 {
		userExists = true
	}

	query = fmt.Sprintf(`SELECT item_id, partner_id 
	 					FROM sales_partner_dbhub_schema 
						WHERE sales_partner_name = '%s';`, reqData.Dealer)
	Dealerdata, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales_partner_dbhub_schema data from DB  email: %v; err: %v", reqData.EmailId, err)
		return err
	}

	if len(Dealerdata) == 0 {
		log.FuncErrorTrace(0, "No dealer is found in podio email: %v", reqData.EmailId)
		err = fmt.Errorf("no dealer is found in podio email: %v", reqData.EmailId)
		return err
	}

	dealerItemId, ok := Dealerdata[0]["item_id"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "No dealer ItemId found in podio email: %v", reqData.EmailId)
		err = fmt.Errorf("no dealer ItemId found in podio email: %v", reqData.EmailId)
		return err
	}

	dealerId, ok := Dealerdata[0]["partner_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "No partner id found in podio email: %v", reqData.EmailId)
		err = fmt.Errorf("no partner id found in podio email: %v", reqData.EmailId)
		return err
	}

	if userExists {
		itemId, ok = SaleRepdata[0]["item_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "No item id for sales rep found in podio email: %v", reqData.EmailId)
			err = fmt.Errorf("no item id for sales rep found in podio email: %v", reqData.EmailId)
			return err
		}
	}

	positionId := assignUserRoleToPodioId(userRole)
	if positionId == 0 {
		log.FuncErrorTrace(0, "User role not authorized to be added to podio email: %v", reqData.EmailId)
		err = fmt.Errorf("user role not authorized to be added to podio email: %v", reqData.EmailId)
		return err
	}

	podioData := models.PodioDatas{}
	podioData.DealerItemId = dealerItemId
	podioData.PartnerId = dealerId
	podioData.PositionId = positionId
	podioData.ItemId = itemId

	podioAccessToken, err = generatePodioAccessCode()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate podio access token; email: %v err: %v", reqData.EmailId, err)
		return err
	}

	CreateOrUpdatePodioUser(reqData, podioData, podioAccessToken, userExists)
	return err
}
