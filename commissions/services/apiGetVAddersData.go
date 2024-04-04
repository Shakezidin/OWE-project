/**************************************************************************
 * File       	   : apiGetSaleTypesData.go
 * DESCRIPTION     : This file contains functions for get v adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetVAdderDataRequest
 * DESCRIPTION:     handler for get v adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetVAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetVAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetVAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get v adders data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get v adders data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get v adders data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get v adders data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_v_adders
	query = `
	SELECT  vadd.id as record_id,vadd.adder_name, vadd.adder_type, vadd.price_type, vadd.price_amount, vadd.active, vadd.description
	FROM v_adders vadd`

	filter, whereEleList = PrepareFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get v adders data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get v adders data from DB", http.StatusBadRequest, nil)
		return
	}

	vaddersList := models.GetVAddersList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id. Item: %+v\n", item)
			continue
		}

		AdderName, ok := item["adder_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get adder name. Item: %+v\n", item)
			continue
		}

		AdderType, ok := item["adder_type"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get adder type. Item: %+v\n", item)
			continue
		}

		PriceType, ok := item["price_type"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get price type. Item: %+v\n", item)
			continue
		}

		PriceAmount, ok := item["price_amount"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get price amount. Item: %+v\n", item)
			continue
		}

		ActiveVal, ok := item["active"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get active. Item: %+v\n", item)
			continue
		}
		Active := int(ActiveVal)

		Description, ok := item["description"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get description. Item: %+v\n", item)
			continue
		}

		// Create a new GetVAdderData object
		vaddersData := models.GetVAdderData{
			RecordId:  RecordId,
			AdderName:   AdderName,
			AdderType:   AdderType,
			PriceType:   PriceType,
			PriceAmount: PriceAmount,
			Active:      Active,
			Description: Description,
		}

		// Append the new vaddersData to the vaddersList
		vaddersList.VAddersList = append(vaddersList.VAddersList, vaddersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of v adders List fetched : %v list %+v", len(vaddersList.VAddersList), vaddersList)
	FormAndSendHttpResp(resp, "v adders Data", http.StatusOK, vaddersList)
}
