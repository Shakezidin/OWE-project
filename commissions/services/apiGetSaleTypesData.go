/**************************************************************************
 * File       	   : apiGetSaleTypesData.go
 * DESCRIPTION     : This file contains functions for get sale type data handler
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
 * FUNCTION:		HandleGetSaleTypeDataRequest
 * DESCRIPTION:     handler for get sale type data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetSaleTypeDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetSaleTypeDataRequest")
	defer func() { log.ExitFn(0, "HandleGetSaleTypeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get sale type data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get sale type data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get sale type data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get sale type data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_sale_type
	query = `
	SELECT st.type_name as type_name, st.description as description
	FROM sale_type st`

	filter, whereEleList = PrepareFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sale type data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get sale type data from DB", http.StatusBadRequest, nil)
		return
	}

	saleTypeList := models.GetSaleTypeList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		typeName, typeOk := item["type_name"].(string)
		if !typeOk {
			log.FuncErrorTrace(0, "Failed to get type name. Item: %+v\n", item)
			continue
		}

		description, descOk := item["description"].(string)
		if !descOk {
			log.FuncErrorTrace(0, "Failed to get description. Item: %+v\n", item)
			continue
		}

		// Create a new GetSaleTypeData object
		saleTypeData := models.GetSaleTypeData{
			TypeName:    typeName,
			Description: description,
		}

		saleTypeList.SaleTypeList = append(saleTypeList.SaleTypeList, saleTypeData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of sale type List fetched : %v salelist %+v", len(saleTypeList.SaleTypeList), saleTypeList)
	FormAndSendHttpResp(resp, "sale type Data", http.StatusOK, saleTypeList)
}
