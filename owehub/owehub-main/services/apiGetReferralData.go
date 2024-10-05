/**************************************************************************
* File       	   : apiGetReferralData.go
* DESCRIPTION     : This file contains functions to get Referral data handler
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
* FUNCTION:		HandleGetReferralDataRequest
* DESCRIPTION:     handler for get Referral data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetReferralDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetReferralDataRequest")
	defer func() { log.ExitFn(0, "HandleGetReferralDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get referral data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get referral data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get referral data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_referral_data
	query = `SELECT ad.id AS record_id, ad.unique_id, ad.new_customer, ad.start_date,
		ad.end_date,  ad.referrer_serial, ad.referrer_name, ad.amount, ad.rep_doll_divby_per, ad.notes,
		ad.type, ad.sys_size, ad.rep_count, ad.per_rep_addr_share, ad.per_rep_ovrd_share, ad.r1_pay_scale, ad."r1_referral_credit_$" AS r1_referral_credit,
		ad.r1_referral_credit_perc AS r1_referral_credit_perc, ad.r1_addr_resp, ad.r2_pay_scale,
		ad."r2_referral_credit_$" AS r2_referral_credit, ad.r2_referral_credit_perc AS r2_referral_credit_perc, ad.r2_addr_resp,
		ud1.name AS rep_1_name, ud2.name AS rep_2_name, st.name AS state
		FROM referral_data ad
		LEFT JOIN states st ON st.state_id = ad.state_id
		LEFT JOIN user_details ud1 ON ud1.user_id = ad.rep_1
		LEFT JOIN user_details ud2 ON ud2.user_id = ad.rep_2`

	filter, whereEleList = PrepareReferralDataFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get referral data from DB", http.StatusBadRequest, nil)
		return
	}

	ReferralDataList := models.GetReferralDataList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		// new_customer
		NewCustomer, ok := item["new_customer"].(string)
		if !ok || NewCustomer == "" {
			log.FuncErrorTrace(0, "Failed to get new customer for Record ID %v. Item: %+v\n", RecordId, item)
			NewCustomer = ""
		}

		// referrer_serial
		ReferrerSerial, ok := item["referrer_serial"].(string)
		if !ok || ReferrerSerial == "" {
			log.FuncErrorTrace(0, "Failed to get referrer serial for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerSerial = ""
		}

		// referrer_name
		ReferrerName, ok := item["referrer_name"].(string)
		if !ok || ReferrerName == "" {
			log.FuncErrorTrace(0, "Failed to get referrer name for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerName = ""
		}

		// amount
		Amount, ok := item["amount"].(float64)
		if !ok || Amount == 0.0 {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
		}

		// rep_doll_divby_per
		RepDollDivbyPer, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			RepDollDivbyPer = 0.0
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// rep_1_name
		Rep1Name, ok := item["rep_1_name"].(string)
		if !ok || Rep1Name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_1_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep1Name = ""
		}

		// rep_2_name
		Rep2Name, ok := item["rep_2_name"].(string)
		if !ok || Rep2Name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_2_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep2Name = ""
		}

		// sys_size
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		// rep_count
		RepCount, ok := item["rep_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep count for Record ID %v. Item: %+v\n", RecordId, item)
			RepCount = 0.0
		}

		// state
		State, ok := item["state"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// per_rep_addr_share
		PerRepAddrShare, ok := item["per_rep_addr_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_addr_share for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepAddrShare = 0.0
		}

		// per_rep_ovrd_share
		PerRepOvrdShare, ok := item["per_rep_ovrd_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_ovrd_share for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepOvrdShare = 0.0
		}

		// r1_pay_scale
		R1PayScale, ok := item["r1_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R1PayScale = 0.0
		}

		// r1_referral_credit_$
		R1ReferralCredit, ok := item["r1_referral_credit_$"].(string)
		if !ok || R1ReferralCredit == "" {
			log.FuncErrorTrace(0, "Failed to get r1_referral_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R1ReferralCredit = ""
		}

		// r1_referral_credit_perc
		R1ReferralCreditPerc, ok := item["r1_referral_credit_perc"].(string)
		if !ok || R1ReferralCreditPerc == "" {
			log.FuncErrorTrace(0, "Failed to get r1_referral_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R1ReferralCreditPerc = ""
		}

		// r1_addr_resp
		R1AddrResp, ok := item["r1_addr_resp"].(string)
		if !ok || R1AddrResp == "" {
			log.FuncErrorTrace(0, "Failed to get r1_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R1AddrResp = ""
		}

		// r2_pay_scale
		R2PayScale, ok := item["r2_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r2_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R2PayScale = 0.0
		}

		// r2_referral_credit_$
		R2ReferralCredit, ok := item["r2_referral_credit_$"].(string)
		if !ok || R2ReferralCredit == "" {
			log.FuncErrorTrace(0, "Failed to get r2_referral_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R2ReferralCredit = ""
		}

		// r2_referral_credit_perc
		R2ReferralCreditPerc, ok := item["r2_referral_credit_perc"].(string)
		if !ok || R2ReferralCreditPerc == "" {
			log.FuncErrorTrace(0, "Failed to get r2_referral_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R2ReferralCreditPerc = ""
		}

		// r2_addr_resp
		R2AddrResp, ok := item["r2_addr_resp"].(string)
		if !ok || R2AddrResp == "" {
			log.FuncErrorTrace(0, "Failed to get r2_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R2AddrResp = ""
		}

		// start_date
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// end_date
		EndDate, ok := item["end_date"].(*string)
		if !ok || EndDate == nil {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = nil
		}

		ReferralData := models.GetReferralData{
			RecordId:             RecordId,
			UniqueID:             UniqueID,
			NewCustomer:          NewCustomer,
			ReferrerSerial:       ReferrerSerial,
			ReferrerName:         ReferrerName,
			Amount:               Amount,
			RepDollDivbyPer:      RepDollDivbyPer,
			Notes:                Notes,
			Type:                 Type,
			Rep1Name:             Rep1Name,
			Rep2Name:             Rep2Name,
			SysSize:              SysSize,
			RepCount:             RepCount,
			State:                State,
			PerRepAddrShare:      PerRepAddrShare,
			PerRepOvrdShare:      PerRepOvrdShare,
			R1PayScale:           R1PayScale,
			R1ReferralCredit:     R1ReferralCredit,
			R1ReferralCreditPerc: R1ReferralCreditPerc,
			R1AddrResp:           R1AddrResp,
			R2PayScale:           R2PayScale,
			R2ReferralCredit:     R2ReferralCredit,
			R2ReferralCreditPerc: R2ReferralCreditPerc,
			R2AddrResp:           R2AddrResp,
			StartDate:            StartDate,
			EndDate:              EndDate,
		}

		ReferralDataList.ReferralDataList = append(ReferralDataList.ReferralDataList, ReferralData)
	}

	filter, whereEleList = PrepareReferralDataFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get referral data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))

	// Send the response
	log.FuncInfoTrace(0, "Number of referral data list fetched : %v list %+v", len(ReferralDataList.ReferralDataList), ReferralDataList)
	appserver.FormAndSendHttpResp(resp, "Referral Data", http.StatusOK, ReferralDataList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareReferralDataFilters
* DESCRIPTION:     handler for prepare filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func PrepareReferralDataFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareReferralDataFilters")
	defer func() { log.ExitFn(0, "PrepareReferralDataFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "new_customer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.new_customer) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "referrer_serial":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.referrer_serial) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "referrer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.referrer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_doll_divby_per":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_doll_divby_per %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.notes) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.type) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_1_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud1.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_2_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud2.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("ad.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_count":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_count %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_rep_addr_share":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_rep_addr_share %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_rep_ovrd_share":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_rep_ovrd_share %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_pay_scale %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_referral_credit_$":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r1_referral_credit_$) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_referral_credit_perc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r1_referral_credit_perc) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r1_addr_resp) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r2_pay_scale %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_referral_credit_$":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r2_referral_credit_$) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_referral_credit_perc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r2_referral_credit_perc) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.r2_addr_resp) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("ad.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("ad.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ad.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ad.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ad.id, ad.unique_id, ad.new_customer, ad.start_date, ad.end_date, ad.referrer_serial, ad.referrer_name, ad.amount, ad.rep_doll_divby_per, ad.notes, ad.type, ad.sys_size, ad.rep_count, ad.per_rep_addr_share, ad.per_rep_ovrd_share, ad.r1_pay_scale, ad.r1_referral_credit_$,ad.r1_referral_credit_perc, ad.r1_addr_resp, ad.r2_pay_scale, ad.r2_referral_credit_$, ad.r2_referral_credit_perc, ad.r2_addr_resp, ud1.name, ud2.name, st.name")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ad.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
