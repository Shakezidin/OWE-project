/**************************************************************************
 * File       	   : apiGetLoanFee.go
 * DESCRIPTION     : This file contains functions for get LoanFee data handler
 * DATE            : 29-Apr-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
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
 * FUNCTION:		HandleGetLoanFeeDataRequest
 * DESCRIPTION:     handler for get LoanFee data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLoanFeeDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err             error
		dataReq         models.DataRequestBody
		data            []map[string]interface{}
		whereEleList    []interface{}
		query           string
		queryWithFiler  string
		queryForAlldata string
		filter          string
		RecordCount     int64
	)

	log.EnterFn(0, "HandleGetLoanFeeDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLoanFeeDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get loan fee data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get loan fee data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get loan fee data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get loan fee data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_LoanFee
	query = `
	   SELECT lf.id as record_id, vd.dealer_name, pt.partner_name AS installer, st.name AS state_name, lt.product_code AS loan_type,
	   lf.owe_cost, lf.dlr_mu, lf.dlr_cost,lf.start_date, lf.end_date
	   FROM loan_fee lf
	   JOIN v_dealer vd ON vd.id = lf.dealer_id
	   JOIN partners pt ON pt.partner_id = lf.installer
	   JOIN states st ON st.state_id = lf.state_id
	   JOIN loan_type lt ON lt.id = lf.loan_type`

	filter, whereEleList = PrepareLoanFeeFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan fee data from DB", http.StatusBadRequest, nil)
		return
	}

	LoanFeeList := models.GetLoanFeeList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Dealer_name
		Dealer_name, ok := item["dealer_name"].(string)
		if !ok || Dealer_name == "" {
			log.FuncErrorTrace(0, "Failed to get dealer_name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer_name = ""
		}

		// Installer
		Installer, ok := item["installer"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// state_name
		State_name, ok := item["state_name"].(string)
		if !ok || State_name == "" {
			log.FuncErrorTrace(0, "Failed to get state_name for Record ID %v. Item: %+v\n", RecordId, item)
			State_name = ""
		}

		// Loan_type
		Loan_type, ok := item["loan_type"].(string)
		if !ok || Loan_type == "" {
			log.FuncErrorTrace(0, "Failed to get loan type for Record ID %v. Item: %+v\n", RecordId, item)
			Loan_type = ""
		}

		// Owe_cost
		Owe_cost, ok := item["owe_cost"].(float64)
		if !ok || Owe_cost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			Owe_cost = 0.0
		}

		// Dlr_Mu
		Dlr_Mu, ok := item["dlr_mu"].(float64)
		if !ok || Dlr_Mu == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr mu for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Mu = 0.0
		}

		// Dlr_Cost
		Dlr_Cost, ok := item["dlr_cost"].(float64)
		if !ok || Dlr_Cost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Cost = 0.0
		}

		// start_date
		Start_date, ok := item["start_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		StartDateStr := Start_date.Format("2006-01-02")
		EndDateStr := EndDate.Format("2006-01-02")

		LoanFeeData := models.GetLoanFee{
			RecordId:  RecordId,
			Dealer:    Dealer_name,
			Installer: Installer,
			State:     State_name,
			LoanType:  Loan_type,
			OweCost:   Owe_cost,
			DlrMu:     Dlr_Mu,
			DlrCost:   Dlr_Cost,
			StartDate: StartDateStr,
			EndDate:   EndDateStr,
		}
		LoanFeeList.LoanFeeList = append(LoanFeeList.LoanFeeList, LoanFeeData)
	}

	filter, whereEleList = PrepareLoanFeeFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan fee data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of loan fee List fetched : %v list %+v", len(LoanFeeList.LoanFeeList), LoanFeeList)
	appserver.FormAndSendHttpResp(resp, "Loan Fee Data", http.StatusOK, LoanFeeList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareLoanFeeFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareLoanFeeFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareLoanFeeFilters")
	defer func() { log.ExitFn(0, "PrepareLoanFeeFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true // Set flag to true as WHERE clause is added

		for i, filter := range dataFilter.Filters {
			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			// Build the filter condition using correct db column name
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lf.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "loan_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lt.product_code)  %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "owe_cost":
				filtersBuilder.WriteString(fmt.Sprintf("lf.owe_cost %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dlr_mu":
				filtersBuilder.WriteString(fmt.Sprintf("lf.dlr_mu %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dlr_cost":
				filtersBuilder.WriteString(fmt.Sprintf("lf.dlr_cost %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("lf.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("lf.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lf.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	// Handle the Archived field
	if dataFilter.Archived {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("lf.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("lf.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY lf.id, vd.dealer_name, pt.partner_name, st.name, lt.product_code, lf.owe_cost, lf.dlr_mu, lf.dlr_cost")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY lf.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
