/**************************************************************************
 * File       	   : apiUpdateTeamName.go
 * DESCRIPTION     : This file contains functions for update team name handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

var TempMap = make(map[string]map[string]string)

/******************************************************************************
 * FUNCTION:		HandleUpdateSetterSalesRepRequest
 * DESCRIPTION:     handler for update setter and sales rep name request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleUpdateSetterSalesRepRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err        error
		updateData models.UpdateSetterSalesRepReq
		// query      string
		// rows       int64
	)

	log.EnterFn(0, "HandleUpdateSetterSalesRepRequest")
	defer func() { log.ExitFn(0, "HandleUpdateSetterSalesRepRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update setter and sales rep name request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update setter and sales rep name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &updateData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update setter and sales rep name request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update team name request", http.StatusBadRequest, nil)
		return
	}

	if len(updateData.UniqueId) <= 0 || updateData.Field == "" || updateData.Data == "" {
		err = fmt.Errorf("Invalid input fields in API request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid input fields in API request", http.StatusBadRequest, nil)
		return
	}

	//temporary solution
	if TempMap[updateData.UniqueId] == nil {
		TempMap[updateData.UniqueId] = make(map[string]string)
	}

	TempMap[updateData.UniqueId][updateData.Field] = updateData.Data

	// query = fmt.Sprintf(`update customers_customers_schema set %v = '%v' where unique_id = '%v'`, updateData.Field, updateData.Data, updateData.UniqueId)

	// err, rows = db.UpdateDataInDB(db.RowDataDBIndex, query, nil)
	// if err != nil || rows == 0 {
	// 	log.FuncErrorTrace(0, "Failed to update %v name in DB with err: %v", updateData.Field, err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to update"+updateData.Field+"name", http.StatusInternalServerError, nil)
	// 	return
	// }

	appserver.FormAndSendHttpResp(resp, updateData.Field+" name updated successfully", http.StatusOK, nil)
}
