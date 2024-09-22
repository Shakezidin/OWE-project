/**************************************************************************
 * File       	   : apiLoanFeeAdder.go
 * DESCRIPTION     : This file contains functions for get laonfeeadder handler
 * DATE            : 24-Apr-2024
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
 * FUNCTION:		HandleGetLoanFeeAdderDataRequest
 * DESCRIPTION:     handler for get LoanFeeAdder request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLoanFeeAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetLoanFeeAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLoanFeeAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get loan fee adder request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get loan fee adder request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get loan fee adder Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_loan_fee_adder
	query = `
		  SELECT lfa.id as record_id, lfa.unique_id, lfa.type_mktg, vd.dealer_name, pt.partner_name AS installer_name, st.name AS state_name, lfa.contract_dol_dol, tr.tier_name AS dealer_tier_name,
		  lfa.owe_cost, lfa.addr_amount, lfa.per_kw_amount, lfa.rep_doll_divby_per, lfa.description_rep_visible, lfa.notes_not_rep_visible, lfa.type, ud1.name as rep_1_name, ud2.name as rep_2_name, lfa.sys_size,
		  lfa.rep_count, lfa.per_rep_addr_share, lfa.per_rep_ovrd_share, lfa.r1_pay_scale, lfa.rep_1_def_resp, lfa.r1_addr_resp, lfa.r2_pay_scale, lfa.rep_2_def_resp, lfa.r2_addr_resp, 
		  lfa.start_date, lfa.end_date
		  FROM loan_fee_adder lfa
		  JOIN states st ON st.state_id = lfa.state_id
		  JOIN user_details ud1 ON ud1.user_id = lfa.rep_1
		  JOIN user_details ud2 ON ud2.user_id = lfa.rep_2
		  JOIN v_dealer vd ON vd.id = lfa.dealer_id
		  JOIN partners pt ON pt.partner_id = lfa.installer_id
		  JOIN tier tr ON tr.id = lfa.dealer_tier`

	filter, whereEleList = PrepareLoanFeeAdderFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee adder from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan fee adder from DB", http.StatusBadRequest, nil)
		return
	}

	LoanFeeAdderList := models.GetLoanFeeAdderList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// type_mktg
		Type_mktg, ok := item["type_mktg"].(string)
		if !ok || Type_mktg == "" {
			log.FuncErrorTrace(0, "Failed to get type_mktg for Record ID %v. Item: %+v\n", RecordId, item)
			Type_mktg = ""
		}

		// dealer_name
		Dealer_name, ok := item["dealer_name"].(string)
		if !ok || Dealer_name == "" {
			log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer_name = ""
		}

		// installer_name
		Installer_name, ok := item["installer_name"].(string)
		if !ok || Installer_name == "" {
			log.FuncErrorTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			Installer_name = ""
		}

		// state_name
		State_name, ok := item["state_name"].(string)
		if !ok || State_name == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			State_name = ""
		}

		// contract_dol_dol
		Contract_dol_dol, ok := item["contract_dol_dol"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get contract_dol_dol for Record ID %v. Item: %+v\n", RecordId, item)
			Contract_dol_dol = 0.0
		}

		// dealer_tier_name
		Dealer_tier_name, ok := item["dealer_tier_name"].(string)
		if !ok || Dealer_tier_name == "" {
			log.FuncErrorTrace(0, "Failed to get dealer tier name value for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer_tier_name = ""
		}

		// owe_cost
		Owe_cost, ok := item["owe_cost"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			Owe_cost = 0.0
		}

		// addr_amount
		Addr_amount, ok := item["type"].(float64)
		if ok {
			log.FuncErrorTrace(0, "Failed to get addr amount for Record ID %v. Item: %+v\n", RecordId, item)
			Addr_amount = 0.0
		}

		// per_kw_amount
		Per_kw_amount, ok := item["per_kw_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get Per kw amount for Record ID %v. Item: %+v\n", RecordId, item)
			Per_kw_amount = 0.0
		}

		// rep_doll_divby_per
		Rep_doll_divby_per, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_doll_divby_per = 0.0
		}

		// description_rep_visible
		Description_rep_visible, ok := item["description_rep_visible"].(string)
		if !ok || Description_rep_visible == "" {
			log.FuncErrorTrace(0, "Failed to get description rep visible for Record ID %v. Item: %+v\n", RecordId, item)
			Description_rep_visible = ""
		}

		// notes_not_rep_visible
		Notes_not_rep_visible, ok := item["notes_not_rep_visible"].(string)
		if !ok || Notes_not_rep_visible == "" {
			log.FuncErrorTrace(0, "Failed to get notes_not_rep_visible for Record ID %v. Item: %+v\n", RecordId, item)
			Notes_not_rep_visible = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// rep_1_name
		Rep_1_name, ok := item["rep_1_name"].(string)
		if !ok || Rep_1_name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_1_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_1_name = ""
		}

		// rep_2_name
		Rep_2_name, ok := item["rep_2_name"].(string)
		if !ok || Rep_2_name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_2_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_2_name = ""
		}

		// sys_size
		Sys_size, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys zize for Record ID %v. Item: %+v\n", RecordId, item)
			Sys_size = 0.0
		}

		// rep_count
		Rep_count, ok := item["rep_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep count for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_count = 0.0
		}

		// per_rep_addr_share
		Per_rep_addr_share, ok := item["per_rep_addr_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_addr_share for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_addr_share = 0.0
		}

		// per_rep_ovrd_share
		Per_rep_ovrd_share, ok := item["per_rep_ovrd_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_ovrd_share for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_ovrd_share = 0.0
		}

		// r1_pay_scale
		R1_pay_scale, ok := item["r1_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R1_pay_scale = 0.0
		}

		// rep_1_def_resp
		Rep_1_def_resp, ok := item["rep_1_def_resp"].(string)
		if !ok || Rep_1_def_resp == "" {
			log.FuncErrorTrace(0, "Failed to get rep_1_def_resp for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_1_def_resp = ""
		}

		// r1_addr_resp
		R1_addr_resp, ok := item["r1_addr_resp"].(string)
		if !ok || R1_addr_resp == "" {
			log.FuncErrorTrace(0, "Failed to get r1_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R1_addr_resp = ""
		}

		// r2_pay_scale
		R2_pay_scale, ok := item["r2_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r2_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R2_pay_scale = 0.0
		}

		// rep_2_def_resp
		Rep_2_def_resp, ok := item["rep_2_def_resp"].(string)
		if !ok || Rep_2_def_resp == "" {
			log.FuncErrorTrace(0, "Failed to get rep_2_def_resp for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_2_def_resp = ""
		}

		// r2_addr_resp
		R2_addr_resp, ok := item["r2_addr_resp"].(string)
		if !ok || R2_addr_resp == "" {
			log.FuncErrorTrace(0, "Failed to get r2_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R2_addr_resp = ""
		}

		// start_date
		Start_date, ok := item["start_date"].(string)
		if !ok || Start_date == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		LoanFeeAdderData := models.GetLoanFeeAdder{
			RecordId:              RecordId,
			UniqueID:              Unique_id,
			TypeMktg:              Type_mktg,
			Dealer:                Dealer_name,
			Installer:             Installer_name,
			State:                 State_name,
			Contract:              Contract_dol_dol,
			DealerTier:            Dealer_tier_name,
			OweCost:               Owe_cost,
			AddrAmount:            Addr_amount,
			PerKwAmount:           Per_kw_amount,
			RepDollDivbyPer:       Rep_doll_divby_per,
			DescriptionRepVisible: Description_rep_visible,
			NotesNotRepVisible:    Notes_not_rep_visible,
			Type:                  Type,
			Rep1Name:              Rep_1_name,
			Rep2Name:              Rep_2_name,
			SysSize:               Sys_size,
			RepCount:              Rep_count,
			PerRepAddrShare:       Per_rep_addr_share,
			PerRepOvrdShare:       Per_rep_ovrd_share,
			R1PayScale:            R1_pay_scale,
			Rep1DefResp:           Rep_1_def_resp,
			R1AddrResp:            R1_addr_resp,
			R2PayScale:            R2_pay_scale,
			Rep2DefResp:           Rep_2_def_resp,
			R2AddrResp:            R2_addr_resp,
			StartDate:             Start_date,
			EndDate:               EndDate,
		}

		LoanFeeAdderList.LoanFeeAdderList = append(LoanFeeAdderList.LoanFeeAdderList, LoanFeeAdderData)
	}

	filter, whereEleList = PrepareLoanFeeAdderFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee adder from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get loan fee adder from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of loan fee adder List fetched : %v list %+v", len(LoanFeeAdderList.LoanFeeAdderList), LoanFeeAdderList)
	appserver.FormAndSendHttpResp(resp, "Loan Fee Adder", http.StatusOK, LoanFeeAdderList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAutoAdderFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareLoanFeeAdderFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareLoanFeeAdderFilters")
	defer func() { log.ExitFn(0, "PrepareLoanFeeAdderFilters", nil) }()

	var filtersBuilder strings.Builder
	// whereAdded := false // Flag to track if WHERE clause has been added

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		// whereAdded = true // Set flag to true as WHERE clause is added

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lfa.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type_mktg":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lfa.type_mktg) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "contract_dol_dol":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.contract_dol_dol %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_tier_name":
				filtersBuilder.WriteString(fmt.Sprintf("tr.tier_name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "owe_cost":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.owe_cost %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "addr_amount":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.addr_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amount":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.per_kw_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_doll_divby_per":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.rep_doll_divby_per %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description_rep_visible":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.description_rep_visible %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes_not_rep_visible":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.notes_not_rep_visible %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.type %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_1_name":
				filtersBuilder.WriteString(fmt.Sprintf("ud1.name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_2_name":
				filtersBuilder.WriteString(fmt.Sprintf("ud2.name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_count":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.rep_count %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_rep_addr_share":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.per_rep_addr_share %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_rep_ovrd_share":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.per_rep_ovrd_share %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.r1_pay_scale %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_1_def_resp":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.rep_1_def_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.r1_addr_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.r2_pay_scale %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_2_def_resp":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.rep_2_def_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.r2_addr_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("lfa.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(lfa.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	// // Handle the Archived field
	// if dataFilter.Archived {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("lfa.is_archived = TRUE")
	// } else {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("lfa.is_archived = FALSE")
	// }

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY lfa.id, lfa.unique_id, lfa.type_mktg, ud3.name, pt.partner_name, st.name, lfa.contract_dol_dol, tr.tier_name, lfa.owe_cost, lfa.addr_amount, lfa.per_kw_amount, lfa.rep_doll_divby_per, lfa.description_rep_visible, lfa.notes_not_rep_visible, lfa.type, ud1.name, ud2.name, lfa.sys_size, lfa.rep_count, lfa.per_rep_addr_share, lfa.per_rep_ovrd_share, lfa.r1_pay_scale, lfa.rep_1_def_resp, lfa.r1_addr_resp, lfa.r2_pay_scale, lfa.rep_2_def_resp, lfa.r2_addr_resp, lfa.start_date, lfa.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
