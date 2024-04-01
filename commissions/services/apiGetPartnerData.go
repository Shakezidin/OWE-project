/**************************************************************************
 * File       	   : apiGetPartnerData.go
 * DESCRIPTION     : This file contains functions for get partner type data handler
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
 * FUNCTION:		HandleGetPartnerDataRequest
 * DESCRIPTION:     handler for get partner data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPartnerDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetPartnerDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPartnerDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get partner data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get partner data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get partner data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get partner data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_partners
	query = `
	SELECT ptr.partner_name, ptr.description
	FROM partners ptr`

	filter, whereEleList = PrepareFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get partner data from DB", http.StatusBadRequest, nil)
		return
	}

	partnerList := models.GetPartnerList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		partnerName, Ok := item["partner_name"].(string)
		if !Ok || partnerName == "" {
			partnerName = ""
		}

		description, descOk := item["description"].(string)
		if !descOk || description == "" {
			description = ""
		}

		// Create a new GetSaleTypeData object
		partnerData := models.GetPartnerData{
			PartnerName: partnerName,
			Description: description,
		}

		partnerList.PartnersList = append(partnerList.PartnersList, partnerData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of partner List fetched : %v list %+v", len(partnerList.PartnersList), partnerList)
	FormAndSendHttpResp(resp, "Partner Data", http.StatusOK, partnerList)
}
