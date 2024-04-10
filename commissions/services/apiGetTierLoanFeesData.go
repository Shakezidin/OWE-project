/**************************************************************************
 * File       	   : apiGetTimelineSlaData.go
 * DESCRIPTION     : This file contains functions for get v adder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/db"
	log "OWEApp/logger"
	models "OWEApp/models"
	"strings"

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
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetTierLoanFeesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetTierLoanFeesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get tier loan fee data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get tier loan fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tier loan fee data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get tier loan fee data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_tier_loan_fee
	query = `
	SELECT tlf.id as record_id, tr.tier_name as dealer_tier, ptr.partner_name as installer, st.name as state, lnt.product_code as finance_type, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date
	FROM tier_loan_fee tlf
	JOIN tier tr ON tlf.dealer_tier = tr.id
	JOIN partners ptr ON tlf.installer_id = ptr.partner_id
	JOIN states st ON tlf.state_id = st.state_id
	JOIN loan_type lnt ON tlf.finance_type = lnt.id
	`

	filter, whereEleList = PrepareTierLoanFeesFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get tier loan fee data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get tier loan fee data from DB", http.StatusBadRequest, nil)
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
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// State
		State, stateOk := item["state"].(string)
		if !stateOk || State == "" {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// FinanceType
		FinanceType, financeOk := item["finance_type"].(string)
		if !financeOk || FinanceType == "" {
			log.FuncErrorTrace(0, "Failed to get finance type for Record ID %v. Item: %+v\n", RecordId, item)
			FinanceType = ""
		}

		// OweCost
		OweCost, oweOk := item["owe_cost"].(string)
		if !oweOk || OweCost == "" {
			log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			OweCost = ""
		}

		// DlrMu
		DlrMu, muOk := item["dlr_mu"].(string)
		if !muOk || DlrMu == "" {
			log.FuncErrorTrace(0, "Failed to get dlr_mu for Record ID %v. Item: %+v\n", RecordId, item)
			DlrMu = ""
		}

		// DlrCost
		DlrCost, costOk := item["dlr_cost"].(string)
		if !costOk || DlrCost == "" {
			log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			DlrCost = ""
		}

		// StartDate
		StartDate, startOk := item["start_date"].(string)
		if !startOk || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, endOk := item["end_date"].(string)
		if !endOk || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		// Create a new GetTierLoanFeeData object
		vaddersData := models.GetTierLoanFeeData{
			RecordId:    RecordId,
			DealerTier:  DealerTierName,
			Installer:   PartnerName,
			State:       State,
			FinanceType: FinanceType,
			OweCost:     OweCost,
			DlrMu:       DlrMu,
			DlrCost:     DlrCost,
			StartDate:   StartDate,
			EndDate:     EndDate,
		}

		// Append the new vaddersData to the TierLoanFeeList
		tierLoanFeeList.TierLoanFeeList = append(tierLoanFeeList.TierLoanFeeList, vaddersData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of tier loan fee List fetched : %v list %+v", len(tierLoanFeeList.TierLoanFeeList), tierLoanFeeList)
	FormAndSendHttpResp(resp, "tier loan fee Data", http.StatusOK, tierLoanFeeList)
}

/******************************************************************************
 * FUNCTION:		PrepareTierLoanFeesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
 func PrepareTierLoanFeesFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTierLoanFeesFilters")
	defer func() { log.ExitFn(0, "PrepareTierLoanFeesFilters", nil) }()
	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			// Check if the column is a foreign key
			column := filter.Column
			switch column {
			case "dealer_tier":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(tr.tier_name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "installer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ptr.partner_name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "finance_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lnt.product_code) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			default:
				// For other columns, handle them accordingly
				filtersBuilder.WriteString("LOWER(")
				filtersBuilder.WriteString(filter.Column)
				filtersBuilder.WriteString(") ")
				filtersBuilder.WriteString(filter.Operation)
				filtersBuilder.WriteString(" LOWER($")
				filtersBuilder.WriteString(fmt.Sprintf("%d", len(whereEleList)+1))
				filtersBuilder.WriteString(")")
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			}
		}
	}

	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

