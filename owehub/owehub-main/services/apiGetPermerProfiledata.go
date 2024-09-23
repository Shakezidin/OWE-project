/**************************************************************************
 * File       	   : apiGetPerformerData.go
 * DESCRIPTION     : This file contains functions for get Adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"

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
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Adder data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Adder data Request body", http.StatusBadRequest, nil)
		return
	}

	performerProfileData := models.GetPerformerProfileData{}

	query = `SELECT tm.team_name as team, ud.mobile_number as contact_number, ud.email_id as email, ud.user_code as user_code
			FROM user_details ud
			LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id
			LEFT JOIN teams tm ON ud.team_id = tm.team_id
			WHERE vd.dealer_name = $1 AND ud.name = $2`

	//* adding personal details for only sale rep
	if dataReq.DataType == "sale_rep" {
		whereEleList = append(whereEleList, dataReq.Dealer, dataReq.Name)
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
			return
		}
		if len(data) > 0 {
			performerProfileData.Dealer = dataReq.Dealer
			performerProfileData.TeamName, _ = data[0]["team"].(string)
			performerProfileData.ContactNumber, _ = data[0]["contact_number"].(string)
			performerProfileData.Email, _ = data[0]["email"].(string)
			performerProfileData.User_code, _ = data[0]["user_code"].(string)
		}
	}

	if dataReq.DataType == "team" {
		performerProfileData.TeamName = dataReq.Name
	}

	query = GetQueryForTotalCount(dataReq)
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get Adder data from DB", http.StatusBadRequest, nil)
		return
	}

	if len(data) > 0 {
		performerProfileData.TotalSales, _ = data[0]["total_sales"].(int64)
		performerProfileData.Total_NTP, _ = data[0]["total_ntp"].(int64)
		performerProfileData.Total_Installs, _ = data[0]["total_installs"].(int64)
	}
	whereEleList = nil

	query = "SELECT COUNT(system_size) AS weekly_sale FROM consolidated_data_view WHERE "

	filter, whereEleList = FilterPerformerProfileData(dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get weekly_sale from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get weekly_sale from DB", http.StatusBadRequest, nil)
		return
	}
	if len(data) > 0 {
		performerProfileData.WeeklySale, _ = data[0]["weekly_sale"].(int64)
	}

	performerProfileData.Rank = dataReq.Rank
	log.FuncInfoTrace(0, "performer profile data fetched : %v ", performerProfileData)
	appserver.FormAndSendHttpResp(resp, "Adder Data", http.StatusOK, performerProfileData)
}

func FilterPerformerProfileData(dataReq models.GetPerformerProfileDataReq) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "FilterPerformerProfileData")
	defer func() { log.ExitFn(0, "FilterPerformerProfileData", nil) }()
	var filtersBuilder strings.Builder

	switch dataReq.DataType {
	case "sale_rep":
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = '%v' AND (primary_sales_rep = '%v' OR secondary_sales_rep = '%v')", dataReq.Dealer, dataReq.Name, dataReq.Name))
	case "team":
		filtersBuilder.WriteString(fmt.Sprintf(" team = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "state":
		filtersBuilder.WriteString(fmt.Sprintf(" state = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "dealer":
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = '%v'", dataReq.Name))
	case "region":
		filtersBuilder.WriteString(fmt.Sprintf(" region = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "setter":
		filtersBuilder.WriteString(fmt.Sprintf(" setter = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	}

	filtersBuilder.WriteString(fmt.Sprintf(" AND contract_date BETWEEN current_date - interval '1 days' * $%d AND current_date ", len(whereEleList)+1))
	whereEleList = append(whereEleList, "7")

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters : %s", filters)
	return filters, whereEleList
}

func GetQueryForTotalCount(dataReq models.GetPerformerProfileDataReq) (filters string) {
	log.EnterFn(0, "GetQueryForTotalCount")
	defer func() { log.ExitFn(0, "GetQueryForTotalCount", nil) }()

	var filtersBuilder strings.Builder

	if dataReq.CountKwSelection {
		filtersBuilder.WriteString("SELECT COUNT(CASE WHEN contract_date IS NOT NULL THEN system_size END) AS total_sales,")
		filtersBuilder.WriteString(" COUNT(CASE WHEN ntp_date IS NOT NULL THEN system_size END) AS total_ntp,")
		filtersBuilder.WriteString(" COUNT(CASE WHEN pv_install_completed_date IS NOT NULL THEN system_size END) AS total_installs")
	} else {
		filtersBuilder.WriteString("SELECT SUM(CASE WHEN contract_date IS NOT NULL THEN system_size ELSE 0 END) AS total_sales,")
		filtersBuilder.WriteString(" SUM(CASE WHEN ntp_date IS NOT NULL THEN system_size ELSE 0 END) AS total_ntp,")
		filtersBuilder.WriteString(" SUM(CASE WHEN pv_install_completed_date IS NOT NULL THEN system_size ELSE 0 END) AS total_installs")
	}

	filtersBuilder.WriteString(" FROM consolidated_data_view ")
	filtersBuilder.WriteString(" WHERE ")

	switch dataReq.DataType {
	case "sale_rep":
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = '%v' AND (primary_sales_rep = '%v' OR secondary_sales_rep = '%v')", dataReq.Dealer, dataReq.Name, dataReq.Name))
	case "team":
		filtersBuilder.WriteString(fmt.Sprintf(" team = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "state":
		filtersBuilder.WriteString(fmt.Sprintf(" state = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "dealer":
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = '%v'", dataReq.Name))
	case "region":
		filtersBuilder.WriteString(fmt.Sprintf(" region = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "setter":
		filtersBuilder.WriteString(fmt.Sprintf(" setter = '%v' AND dealer = '%v'", dataReq.Name, dataReq.Dealer))
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters : %s", filters)
	return filters
}
