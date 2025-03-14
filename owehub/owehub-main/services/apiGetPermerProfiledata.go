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
			LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
			LEFT JOIN teams tm ON ud.team_id = tm.team_id
			WHERE sp.sales_partner_name = $1 AND ud.name = $2`

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

	// Helper function to convert interface{} to int64
	toInt64 := func(v interface{}) int64 {
		switch value := v.(type) {
		case float64:
			return int64(value)
		case int64:
			return value
		default:
			return 0
		}
	}
	if len(data) > 0 {
		performerProfileData.TotalSales = toInt64(data[0]["total_sales"])
		performerProfileData.Total_NTP = toInt64(data[0]["total_ntp"])
		performerProfileData.Total_Installs = toInt64(data[0]["total_installs"])
		performerProfileData.Total_Battery = toInt64(data[0]["total_battery"])

	}
	whereEleList = nil

	query = `SELECT COUNT(contracted_system_size) AS weekly_sale FROM customers_customers_schema cs 
	LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id
	LEFT JOIN sales_rep_dbhub_schema srs ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
	WHERE `

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
		filtersBuilder.WriteString(fmt.Sprintf(" cs.dealer = '%v' AND cs.primary_sales_rep = '%v'", dataReq.Dealer, dataReq.Name))
	case "team":
		filtersBuilder.WriteString(fmt.Sprintf(" split_part(srs.team_region_untd, '/'::text, 1) = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "state":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.state = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "dealer":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.dealer = '%v'", dataReq.Name))
	case "region":
		filtersBuilder.WriteString(fmt.Sprintf(" split_part(srs.team_region_untd, '/'::text, 2) = '%v' ", dataReq.Name))
	case "setter":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.setter = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	}

	filtersBuilder.WriteString(fmt.Sprintf(" AND cs.sale_date BETWEEN current_date - interval '1 days' * $%d AND current_date ", len(whereEleList)+1))
	whereEleList = append(whereEleList, "7")
	filtersBuilder.WriteString(" AND cs.unique_id != ''")

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters : %s", filters)
	return filters, whereEleList
}

func GetQueryForTotalCount(dataReq models.GetPerformerProfileDataReq) (filters string) {
	log.EnterFn(0, "GetQueryForTotalCount")
	defer func() { log.ExitFn(0, "GetQueryForTotalCount", nil) }()

	var filtersBuilder strings.Builder

	if dataReq.CountKwSelection {
		filtersBuilder.WriteString("SELECT COUNT(DISTINCT CASE WHEN cs.sale_date IS NOT NULL THEN cs.unique_id ELSE NULL END) AS total_sales,")
		filtersBuilder.WriteString(" COUNT(DISTINCT CASE WHEN ns.ntp_complete_date IS NOT NULL THEN ns.unique_id ELSE NULL END) AS total_ntp,")
		filtersBuilder.WriteString(" COUNT(DISTINCT CASE WHEN pis.pv_completion_date IS NOT NULL THEN pis.customer_unique_id ELSE NULL END) AS total_installs,")
		filtersBuilder.WriteString(" SUM(CASE WHEN ns.ntp_complete_date IS NOT NULL THEN ns.battery_count ELSE 0 END) AS total_battery")

	} else {
		filtersBuilder.WriteString("SELECT SUM(CASE WHEN cs.sale_date IS NOT NULL THEN scs.contracted_system_size_parent ELSE 0 END) AS total_sales,")
		filtersBuilder.WriteString(" SUM(CASE WHEN ns.ntp_complete_date IS NOT NULL THEN scs.contracted_system_size_parent ELSE 0 END) AS total_ntp,")
		filtersBuilder.WriteString(" SUM(CASE WHEN pis.pv_completion_date IS NOT NULL THEN scs.contracted_system_size_parent ELSE 0 END) AS total_installs,")
		filtersBuilder.WriteString(" SUM(CASE WHEN ns.ntp_complete_date IS NOT NULL THEN ns.battery_count ELSE 0 END) AS total_battery")

	}

	filtersBuilder.WriteString(` FROM customers_customers_schema cs LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id 
								LEFT JOIN pv_install_install_subcontracting_schema pis ON pis.customer_unique_id = cs.unique_id 
								LEFT JOIN sales_rep_dbhub_schema srs ON SPLIT_PART(ns.prospectid_dealerid_salesrepid, ',', 3) = srs.record_id::text
								LEFT JOIN system_customers_schema scs ON scs.customer_id = cs.unique_id
`)
	filtersBuilder.WriteString(" WHERE ")

	switch dataReq.DataType {
	case "sale_rep":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.dealer = '%v' AND cs.primary_sales_rep = '%v'", dataReq.Dealer, dataReq.Name))
	case "team":
		filtersBuilder.WriteString(fmt.Sprintf(" split_part(srs.team_region_untd, '/'::text, 1) = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "state":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.state = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	case "dealer":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.dealer = '%v'", dataReq.Name))
	case "region":
		filtersBuilder.WriteString(fmt.Sprintf(" split_part(srs.team_region_untd, '/'::text, 2) = '%v'", dataReq.Name))
	case "setter":
		filtersBuilder.WriteString(fmt.Sprintf(" cs.setter = '%v' AND cs.dealer = '%v'", dataReq.Name, dataReq.Dealer))
	}

	filtersBuilder.WriteString(" AND cs.unique_id != ''")
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters : %s", filters)
	return filters
}
