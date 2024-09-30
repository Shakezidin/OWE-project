/**************************************************************************
 * File       	   : apiGetTierLoanFeeData.go
 * DESCRIPTION     : This file contains functions for get tier loan fee data handler
 * DATE            : 22-Jan-2024
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
 * FUNCTION:		HandleGetTierLoanFeesDataRequest
 * DESCRIPTION:     handler for get tier loan fee data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetTierLoanFeesDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetTierLoanFeesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTierLoanFeesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get tier loan fee data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get tier loan fee data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tier loan fee data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get tier loan fee data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_tier_loan_fee
	query = `
	SELECT tlf.id as record_id, tr.tier_name as dealer_tier, ptr.partner_name as installer, st.name as state, lnt.product_code as loan_type, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date
	FROM tier_loan_fee tlf
	LEFT JOIN tier tr ON tlf.dealer_tier = tr.id
	LEFT JOIN partners ptr ON tlf.installer_id = ptr.partner_id
	LEFT JOIN states st ON tlf.state_id = st.state_id
	LEFT JOIN loan_type lnt ON tlf.loan_type = lnt.id
	`

	filter, whereEleList = PrepareTierLoanFeesFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get tier loan fee data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get tier loan fee data from DB", http.StatusBadRequest, nil)
		return
	}

	tierLoanFeeList := models.GetTierLoanFeeList{}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// DealerTierName
		DealerTierName, tierOk := item["dealer_tier"].(string)
		if !tierOk || DealerTierName == "" {
			log.FuncErrorTrace(0, "Failed to get dealer tier for Record ID %v. Item: %+v\n", RecordId, item)
			DealerTierName = ""
		}

		// PartnerName
		PartnerName, partnerOk := item["installer"].(string)
		if !partnerOk || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// State
		State, stateOk := item["state"].(string)
		if !stateOk || State == "" {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// LoanType
		LoanType, financeOk := item["loan_type"].(string)
		if !financeOk || LoanType == "" {
			log.FuncErrorTrace(0, "Failed to get loan type for Record ID %v. Item: %+v\n", RecordId, item)
			LoanType = ""
		}

		// OweCost
		OweCost, oweOk := item["owe_cost"].(float64)
		if !oweOk || OweCost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			OweCost = 0.0
		}

		// DlrMu
		DlrMu, muOk := item["dlr_mu"].(float64)
		if !muOk || DlrMu == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr_mu for Record ID %v. Item: %+v\n", RecordId, item)
			DlrMu = 0.0
		}

		// DlrCost
		DlrCost, costOk := item["dlr_cost"].(float64)
		if !costOk || DlrCost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			DlrCost = 0.0
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

		// Create a new GetTierLoanFeeData object
		vaddersData := models.GetTierLoanFeeData{
			RecordId:   RecordId,
			DealerTier: DealerTierName,
			Installer:  PartnerName,
			State:      State,
			LoanType:   LoanType,
			OweCost:    OweCost,
			DlrMu:      DlrMu,
			DlrCost:    DlrCost,
			StartDate:  StartDateStr,
			EndDate:    EndDateStr,
		}

		// Append the new vaddersData to the TierLoanFeeList
		tierLoanFeeList.TierLoanFeeList = append(tierLoanFeeList.TierLoanFeeList, vaddersData)
	}

	filter, whereEleList = PrepareTierLoanFeesFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get tier loan fee data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get tier loan fee data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of tier loan fee List fetched : %v list %+v", len(tierLoanFeeList.TierLoanFeeList), tierLoanFeeList)
	appserver.FormAndSendHttpResp(resp, "Tier Loan Fee Data", http.StatusOK, tierLoanFeeList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareTierLoanFeesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTierLoanFeesFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTierLoanFeesFilters")
	defer func() { log.ExitFn(0, "PrepareTierLoanFeesFilters", nil) }()

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
			case "dealer_tier":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(tr.tier_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ptr.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "loan_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lnt.product_code) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "owe_cost", "dlr_mu", "dlr_cost":
				filtersBuilder.WriteString(fmt.Sprintf("%s %s $%d", filter.Column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("tlf.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("tlf.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(tlf.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("tlf.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("tlf.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY tlf.id, tr.tier_name, ptr.partner_name, st.name, lnt.product_code, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY tlf.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
