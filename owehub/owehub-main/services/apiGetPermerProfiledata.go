/**************************************************************************
 * File       	   : apiGetPerformerData.go
 * DESCRIPTION     : This file contains functions for get Adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		GetperformerProfileDataRequest
 * DESCRIPTION:     handler for get Adder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func GetperformerProfileDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.GetPerformerProfileDataReq
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "get_performerProfileDataRequest")
	defer func() { log.ExitFn(0, "get_performerProfileDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Adder data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Adder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Adder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Adder data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}
	performerProfileData := models.GetPerformerProfileData{}

	query = `SELECT ud1.name as dealer, tm.team_name as team, ud.mobile_number as contact_number, ud.email_id as email, ud.name as primary_sales_rep
			FROM user_details ud
			LEFT JOIN user_details ud1 ON ud.dealer_owner = ud1.user_id
			LEFT JOIN teams tm ON ud.team_id = tm.team_id
			WHERE ud.email_id = $1`

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}

	performerProfileData.Dealer, _ = data[0]["dealer"].(string)
	performerProfileData.TeamName, _ = data[0]["team"].(string)
	performerProfileData.ContactNumber, _ = data[0]["contact_number"].(string)
	performerProfileData.Email, _ = data[0]["email"].(string)
	PrimarysalesRep, _ := data[0]["primary_sales_rep"].(string)

	query = fmt.Sprintf("SELECT COUNT(system_size) AS total_sales, COUNT(ntp_date) AS total_ntp, COUNT(project_status) as install FROM consolidated_data_view WHERE dealer = '%v' AND primary_sales_rep = '%v' AND ntp_date IS NOT NULL AND project_status = 'INSTALL' AND ", performerProfileData.Dealer, PrimarysalesRep)

	filter, whereEleList = FilterPerformerProfileData(dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}

	performerProfileData.TotalSales, _ = data[0]["total_sales"].(float64)
	performerProfileData.Total_NTP, _ = data[0]["total_ntp"].(float64)
	performerProfileData.Total_Installs, _ = data[0]["install"].(float64)
	// Send the response
	log.FuncInfoTrace(0, "performer profile data fetched : %v ", performerProfileData)
	FormAndSendHttpResp(resp, "Adder Data", http.StatusOK, performerProfileData)
}

func FilterPerformerProfileData(dataReq models.GetPerformerProfileDataReq) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "FilterPerformerProfileData")
	defer func() { log.ExitFn(0, "FilterPerformerProfileData", nil) }()

	var filtersBuilder strings.Builder
	startDate, err := time.Parse("2006-01-02", dataReq.StartDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}
	endDate, err := time.Parse("2006-01-02", dataReq.EndDate) // Correct date format for parsing
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting date")
	}

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	switch dataReq.LeaderType {
	case "sale":
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "ntp":
		filtersBuilder.WriteString(fmt.Sprintf(" ntp_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "install":
		filtersBuilder.WriteString(fmt.Sprintf(" pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "cancel":
		filtersBuilder.WriteString(fmt.Sprintf(" cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters : %s", filters)
	return filters, whereEleList

}
