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
	SELECT tr.tier_name as dealer_tier, ptr.partner_name as installer, st.name as state, lnt.product_code as finance_type, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date
	FROM tier_loan_fee tlf
	JOIN tier tr ON tlf.dealer_tier = tr.id
	JOIN partners ptr ON tlf.installer_id = ptr.partner_id
	JOIN states st ON tlf.state_id = st.state_id
	JOIN loan_type lnt ON tlf.finance_type = lnt.id
	`

	filter, whereEleList = PrepareTierLoanFeeFeesFilters(tableName, dataReq)
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
		DealerTierName, tierOk := item["dealer_tier"].(string)
		if !tierOk {
			log.FuncErrorTrace(0, "Failed to get dealer tier. Item: %+v\n", item)
			continue
		}

		PartnerName, partnerOk := item["installer"].(string)
		if !partnerOk {
			log.FuncErrorTrace(0, "Failed to get partner name. Item: %+v\n", item)
			continue
		}

		State, stateOk := item["state"].(string)
		if !stateOk {
			log.FuncErrorTrace(0, "Failed to get state. Item: %+v\n", item)
			continue
		}

		FinanceType, financeOk := item["finance_type"].(string)
		if !financeOk {
			log.FuncErrorTrace(0, "Failed to get finance type. Item: %+v\n", item)
			continue
		}

		OweCost, oweOk := item["owe_cost"].(string)
		if !oweOk {
			log.FuncErrorTrace(0, "Failed to get owe cost. Item: %+v\n", item)
			continue
		}

		DlrMu, muOk := item["dlr_mu"].(string)
		if !muOk {
			log.FuncErrorTrace(0, "Failed to get dlr_mu. Item: %+v\n", item)
			continue
		}

		DlrCost, costOk := item["dlr_cost"].(string)
		if !costOk {
			log.FuncErrorTrace(0, "Failed to get dlr cost. Item: %+v\n", item)
			continue
		}

		StartDate, startOk := item["start_date"].(string)
		if !startOk {
			log.FuncErrorTrace(0, "Failed to get start date. Item: %+v\n", item)
			continue
		}

		EndDate, endOk := item["end_date"].(string)
		if !endOk {
			log.FuncErrorTrace(0, "Failed to get end date. Item: %+v\n", item)
			continue
		}

		// Create a new GetTierLoanFeeData object
		vaddersData := models.GetTierLoanFeeData{
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
 * FUNCTION:		PrepareTierLoanFeeFeesFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareTierLoanFeeFeesFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareTierLoanFeeFeesFilters")
	defer func() { log.ExitFn(0, "PrepareTierLoanFeeFeesFilters", nil) }()
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
				filtersBuilder.WriteString(fmt.Sprintf("tr.tier_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "installer":
				filtersBuilder.WriteString(fmt.Sprintf("ptr.partner_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.name %s $%d", filter.Operation, len(whereEleList)+1))
			case "finance_type":
				filtersBuilder.WriteString(fmt.Sprintf("lnt.product_code %s $%d", filter.Operation, len(whereEleList)+1))
			default:
				// For other columns, call PrepareFilters function
				if len(filtersBuilder.String()) > len(" WHERE ") {
					filtersBuilder.WriteString(" AND ")
				}
				subFilters, subWhereEleList := PrepareFilters(tableName, models.DataRequestBody{Filters: []models.Filter{filter}})
				filtersBuilder.WriteString(subFilters)
				whereEleList = append(whereEleList, subWhereEleList...)
				continue
			}

			whereEleList = append(whereEleList, filter.Data)
		}
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
