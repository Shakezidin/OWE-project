/**************************************************************************
 * File       	   : apiGetUserAddressData.go
 * DESCRIPTION     : This file contains functions for get user address data handler
 * DATE            : 19-Sep-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetUserAddressDataRequest
 * DESCRIPTION:     handler for get user address data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetUserAddressDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		RecordCount  int64
	)

	log.EnterFn(0, "HandleGetUserAddressDataRequest")
	defer func() { log.ExitFn(0, "HandleGetUserAddressDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get user address data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get user address request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get user address data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get user address data Request body", http.StatusBadRequest, nil)
		return
	}

	// tableName := db.TableName_rep_type
	query = `SELECT unique_id, address, home_owner 
		FROM ` + db.ViewName_ConsolidatedDataView

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get RepType data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get RepType data from DB", http.StatusBadRequest, nil)
		return
	}

	UserAddressList := models.GetUserAddressList{}

	for _, item := range data {
		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", UniqueId, item)
			continue
		}
		Address, ok := item["address"].(string)
		if !ok || Address == "" {
			log.FuncErrorTrace(0, "Failed to get Address for Record ID %v. Item: %+v\n", UniqueId, item)
			Address = ""
		}
		HomeOwner, ok := item["home_owner"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get HomeOwner for Record ID %v. Item: %+v\n", UniqueId, item)
			HomeOwner = ""
		}

		UserAddress := models.GetUserAddressData{
			UniqueId:  UniqueId,
			HomeOwner: HomeOwner,
			Address:   Address,
			Latitute:  "",
			Longitude: "",
		}

		UserAddressList.UserAddressList = append(UserAddressList.UserAddressList, UserAddress)
	}

	RecordCount = int64(len(data))

	result := Paginate(UserAddressList.UserAddressList, int64(dataReq.PageNumber), int64(dataReq.PageSize))
	// Send the response
	log.FuncInfoTrace(0, "Number of user address List fetched : %v list %+v", len(result), result)
	FormAndSendHttpResp(resp, "user address Data", http.StatusOK, result, RecordCount)
}
