// /**************************************************************************
//  * File       	   : apiGetRepPayFromView.go
//  * DESCRIPTION     : This file contains functions for get ApptSetters data handler
//  * DATE            : 22-Jan-2024
//  **************************************************************************/

package services

// import (
// 	// 	"OWEApp/shared/db"
// 	// 	log "OWEApp/shared/logger"
// 	// 	models "OWEApp/shared/models"
// 	// 	"time"

// 	// 	"encoding/json"
// 	// 	"fmt"

// 	log "OWEApp/shared/logger"
// 	"encoding/json"
// 	"fmt"
// 	"io/ioutil"
// 	"net/http"
// )

// /******************************************************************************
// * FUNCTION:		GetRepPayFromView
// * DESCRIPTION:     handler for get ApptSetters data request
// * INPUT:			resp, req
// * RETURNS:    		void
// ******************************************************************************/

// func GetRepPayDataFromView(resp http.ResponseWriter, req *http.Request) {
// 	var (
// 		err          error
// 		dataReq      models.GetRepPayReq
// 		data         []map[string]interface{}
// 		whereEleList []interface{}
// 		query        string
// 		// queryForAlldata string
// 		// filter string
// 		// RecordCount     int64
// 	)

// 	log.EnterFn(0, "GetRepPayFromView")
// 	defer func() { log.ExitFn(0, "GetRepPayFromView", err) }()

// 	if req.Body == nil {
// 		err = fmt.Errorf("HTTP Request body is null in get ar data request")
// 		log.FuncErrorTrace(0, "%v", err)
// 		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		return
// 	}

// 	reqBody, err := ioutil.ReadAll(req.Body)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar data request err: %v", err)
// 		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	err = json.Unmarshal(reqBody, &dataReq)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "Failed to unmarshal get ar data request err: %v", err)
// 		FormAndSendHttpResp(resp, "Failed to unmarshal get ar data Request body", http.StatusBadRequest, nil)
// 		return
// 	}

// 	if dataReq.ReportType == "" || dataReq.SalePartner == "" {
// 		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
// 		log.FuncErrorTrace(0, "%v", err)
// 		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
// 		return
// 	}


// 	//* payroll date
// }
