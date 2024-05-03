/**************************************************************************
 * File       	   : apiGetAutoAdderData.go
 * DESCRIPTION     : This file contains functions for get AutoAdder data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
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
 * FUNCTION:		HandleGetAutoAdderDataRequest
 * DESCRIPTION:     handler for get AutoAdder data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetAutoAdderDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetAutoAdderDataRequest")
	defer func() { log.ExitFn(0, "HandleGetAutoAdderDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get AutoAdder data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get AutoAdder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get AutoAdder data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get AutoAdder data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_auto_adder
	query = `
		 SELECT ad.id as record_id, ad.unique_id, ad.type_aa_mktg, ad.gc, ad.exact_amount, ad.per_kw_amount, ad.rep_doll_divby_per, ad.description_rep_visible,
		 ad.notes_not_rep_visible, ad.type, ud1.name as rep_1_name, ud2.name as rep_2_name, ad.sys_size, st.name, ad.rep_count, ad.per_rep_addr_share, ad.per_rep_ovrd_share,
		 ad.r1_pay_scale, ad.rep_1_def_resp, ad.r1_addr_resp, ad.r2_pay_scale, ad.rep_2_def_resp, ad.r2_addr_resp, ad.contract_amount, ad.project_base_cost, ad.crt_addr,
		 ad.r1_loan_fee, ad.r1_rebate, ad.r1_referral, ad.r1_r_plus_r, ad.total_comm, ad.start_date, ad.end_date
		 FROM auto_adder ad
		 JOIN states st ON st.state_id = ad.state_id
		 JOIN user_details ud1 ON ud1.user_id = ad.rep_1
		 JOIN user_details ud2 ON ud2.user_id = ad.rep_2`

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AutoAdder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get AutoAdder data from DB", http.StatusBadRequest, nil)
		return
	}

	AutoAdderList := models.GetAutoAdderList{}

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

		// type_aa_mktg
		Type_aa_mktg, ok := item["type_aa_mktg"].(string)
		if !ok || Type_aa_mktg == "" {
			log.FuncErrorTrace(0, "Failed to get type_aa_mktg for Record ID %v. Item: %+v\n", RecordId, item)
			Type_aa_mktg = ""
		}

		// gc
		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			log.FuncErrorTrace(0, "Failed to get gc for Record ID %v. Item: %+v\n", RecordId, item)
			Gc = ""
		}

		// exact_amount
		Exact_amount, ok := item["exact_amount"].(string)
		if !ok || Exact_amount == "" {
			log.FuncErrorTrace(0, "Failed to get exact_amount for Record ID %v. Item: %+v\n", RecordId, item)
			Exact_amount = ""
		}

		// per_kw_amount
		Per_kw_amount, ok := item["per_kw_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_kw_amount for Record ID %v. Item: %+v\n", RecordId, item)
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
			log.FuncErrorTrace(0, "Failed to get description_rep_visible value for Record ID %v. Item: %+v\n", RecordId, item)
			Description_rep_visible = ""
		}

		// notes_not_rep_visible
		Notes_not_rep_visible, ok := item["notes_not_rep_visible"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get notes_not_rep_visible for Record ID %v. Item: %+v\n", RecordId, item)
			Notes_not_rep_visible = ""
		}

		// type
		Type, ok := item["type"].(string)
		if ok || Type == "" {
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
			log.FuncErrorTrace(0, "Failed to get sys_size for Record ID %v. Item: %+v\n", RecordId, item)
			Sys_size = 0.0
		}

		// name
		StateName, ok := item["name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		// rep_count
		Rep_count, ok := item["rep_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_count for Record ID %v. Item: %+v\n", RecordId, item)
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

		// contract_amount
		Contract_amount, ok := item["contract_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get contract_amount for Record ID %v. Item: %+v\n", RecordId, item)
			Contract_amount = 0.0
		}

		// project_base_cost
		Project_base_cost, ok := item["project_base_cost"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get project_base_cost for Record ID %v. Item: %+v\n", RecordId, item)
			Project_base_cost = 0.0
		}

		// crt_addr
		Crt_addr, ok := item["crt_addr"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get crt_addr for Record ID %v. Item: %+v\n", RecordId, item)
			Crt_addr = 0.0
		}

		// r1_loan_fee
		R1_loan_fee, ok := item["r1_loan_fee"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_loan_fee for Record ID %v. Item: %+v\n", RecordId, item)
			R1_loan_fee = 0.0
		}

		// r1_rebate
		R1_rebate, ok := item["r1_rebate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_rebate for Record ID %v. Item: %+v\n", RecordId, item)
			R1_rebate = 0.0
		}

		// r1_referral
		R1_referral, ok := item["r1_referral"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_referral for Record ID %v. Item: %+v\n", RecordId, item)
			R1_referral = 0.0
		}

		// r1_r_plus_r
		R1_r_plus_r, ok := item["r1_r_plus_r"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_r_plus_r for Record ID %v. Item: %+v\n", RecordId, item)
			R1_r_plus_r = 0.0
		}

		// total_comm
		Total_comm, ok := item["total_comm"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get total_comm for Record ID %v. Item: %+v\n", RecordId, item)
			Total_comm = 0.0
		}

		// start_date
		Start_date, ok := item["start_date"].(string)
		if !ok || Start_date == "" {
			log.FuncErrorTrace(0, "Failed to get start_date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		AutoAdderData := models.GetAutoAdderData{
			RecordId:              RecordId,
			UniqueID:              Unique_id,
			TypeAAMktg:            Type_aa_mktg,
			GC:                    Gc,
			ExactAmount:           Exact_amount,
			PerKWAmount:           Per_kw_amount,
			RepDollDivbyPer:       Rep_doll_divby_per,
			DescriptionRepVisible: Description_rep_visible,
			NotesNotRepVisible:    Notes_not_rep_visible,
			Type:                  Type,
			Rep1:                  Rep_1_name,
			Rep2:                  Rep_2_name,
			SysSize:               Sys_size,
			State:                 StateName,
			RepCount:              Rep_count,
			PerRepAddrShare:       Per_rep_addr_share,
			PerRepOvrdShare:       Per_rep_ovrd_share,
			R1PayScale:            R1_pay_scale,
			Rep1DefResp:           Rep_1_def_resp,
			R1AddrResp:            R1_addr_resp,
			R2PayScale:            R2_pay_scale,
			Rep2DefResp:           Rep_2_def_resp,
			R2AddrResp:            R2_addr_resp,
			ContractAmount:        Contract_amount,
			ProjectBaseCost:       Project_base_cost,
			CrtAddr:               Crt_addr,
			R1LoanFee:             R1_loan_fee,
			R1Rebate:              R1_rebate,
			R1Referral:            R1_referral,
			R1RPlusR:              R1_r_plus_r,
			TotalComm:             Total_comm,
			StartDate:             Start_date,
			EndDate:               EndDate,
		}

		AutoAdderList.AutoAdderList = append(AutoAdderList.AutoAdderList, AutoAdderData)
	}

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get auto adder data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of AutoAdder List fetched : %v list %+v", len(AutoAdderList.AutoAdderList), AutoAdderList)
	FormAndSendHttpResp(resp, "AutoAdder Data", http.StatusOK, AutoAdderList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PrepareAutoAdderFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareAutoAdderFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAutoAdderFilters")
	defer func() { log.ExitFn(0, "PrepareAutoAdderFilters", nil) }()

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
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type_aa_mktg":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.type_aa_mktg) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "gc":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.gc) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.exact_amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "per_kw_amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.per_kw_amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_doll_divby_per":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_doll_divby_per %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "description_rep_visible":
				filtersBuilder.WriteString(fmt.Sprintf("ad.description_rep_visible %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes_not_rep_visible":
				filtersBuilder.WriteString(fmt.Sprintf("ad.notes_not_rep_visible %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("ad.type %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_1_name":
				filtersBuilder.WriteString(fmt.Sprintf("ud1.name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_2_name":
				filtersBuilder.WriteString(fmt.Sprintf("ud1.name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("ad.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_count":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_count %s $%d", operator, len(whereEleList)+1))
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
			case "rep_1_def_resp":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_1_def_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_addr_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_pay_scale":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r2_pay_scale %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_2_def_resp":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_2_def_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_addr_resp":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r2_addr_resp %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "contract_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.contract_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "project_base_cost":
				filtersBuilder.WriteString(fmt.Sprintf("ad.project_base_cost %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "crt_addr":
				filtersBuilder.WriteString(fmt.Sprintf("ad.crt_addr %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_loan_fee":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_loan_fee %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_rebate":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_rebate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_referral":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_referral %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_r_plus_r":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_r_plus_r %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "total_comm":
				filtersBuilder.WriteString(fmt.Sprintf("ad.total_comm %s $%d", operator, len(whereEleList)+1))
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
	// if dataFilter.Archived {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("ad.is_archived = TRUE")
	// } else {
	// 	if whereAdded {
	// 		filtersBuilder.WriteString(" AND ")
	// 	} else {
	// 		filtersBuilder.WriteString(" WHERE ")
	// 	}
	// 	filtersBuilder.WriteString("ad.is_archived = FALSE")
	// }

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ad.id, ad.unique_id, ad.type_aa_mktg, ad.gc, ad.exact_amount, ad.per_kw_amount, ad.rep_doll_divby_per, ad.description_rep_visible, ad.notes_not_rep_visible, ad.type, ud1.name, ud2.name, ad.sys_size, st.name, ad.rep_count, ad.per_rep_addr_share, ad.per_rep_ovrd_share, ad.r1_pay_scale, ad.rep_1_def_resp, ad.r1_addr_resp, ad.r2_pay_scale, ad.rep_2_def_resp, ad.r2_addr_resp, ad.contract_amount, ad.project_base_cost, ad.crt_addr, ad.r1_loan_fee, ad.r1_rebate, ad.r1_referral, ad.r1_r_plus_r, ad.total_comm, ad.start_date, ad.end_date")
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
