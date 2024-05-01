/**************************************************************************
 * File       	   : apiGetDebateData.go
 * DESCRIPTION     : This file contains functions for get debate data handler
 * DATE            : 24-Apr-2024
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
 * FUNCTION:		HandleGetRebateDataRequest
 * DESCRIPTION:     handler for get Debate data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetRebateDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetRebateDataRequest")
	defer func() { log.ExitFn(0, "HandleGetRebateDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Debate data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get debate data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get debate data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get debate data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_auto_adder
	query = `
			SELECT rd.id as record_id, rd.unique_id, rd.customer_verf, rd.type_rd_mktg, rd.item, rd.amount, rd.rep_doll_divby_per, rd.notes, rd.type, 
			ud1.name as rep_1_name, ud2.name as rep_2_name, rd.sys_size, rd.rep_count, st.name, rd.per_rep_addr_share, rd.per_rep_ovrd_share,
			rd.r1_pay_scale, rd.rep_1_def_resp, rd.r1_addr_resp, rd.r2_pay_scale, rd.per_rep_def_ovrd, rd."r1_rebate_credit_$", rd.r1_rebate_credit_perc, 
			rd."r2_rebate_credit_$", rd.r2_rebate_credit_perc,  rd.start_date, rd.end_date
			FROM rebate_data rd
			JOIN states st ON st.state_id = rd.state_id
			JOIN user_details ud1 ON ud1.user_id = rd.rep_1
			JOIN user_details ud2 ON ud2.user_id = rd.rep_2`

	filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AutoAdder data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get AutoAdder data from DB", http.StatusBadRequest, nil)
		return
	}

	RebateDataList := models.GetRebateDataList{}

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

		// customer_verf
		Customer_verf, ok := item["customer_verf"].(string)
		if !ok || Customer_verf == "" {
			log.FuncErrorTrace(0, "Failed to get customer_verf for Record ID %v. Item: %+v\n", RecordId, item)
			Customer_verf = ""
		}

		// type_rd_mktg
		Type_rd_mktg, ok := item["type_rd_mktg"].(string)
		if !ok || Type_rd_mktg == "" {
			log.FuncErrorTrace(0, "Failed to get Type_rd_mktg for Record ID %v. Item: %+v\n", RecordId, item)
			Type_rd_mktg = ""
		}

		// item
		Item, ok := item["item"].(string)
		if !ok || Item == "" {
			log.FuncErrorTrace(0, "Failed to get item for Record ID %v. Item: %+v\n", RecordId, item)
			Item = ""
		}

		// amount
		Amount, ok := item["amount"].(string)
		if !ok || Amount == "" {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = ""
		}

		// rep_doll_divby_per
		Rep_doll_divby_per, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_doll_divby_per = 0.0
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get Notes value for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get notes_not_rep_visible for Record ID %v. Item: %+v\n", RecordId, item)
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

		// rep_count
		Rep_count, ok := item["rep_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_count for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_count = 0.0
		}

		// name
		StateName, ok := item["name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
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

		// per_rep_def_ovrd
		Per_rep_def_ovrd, ok := item["per_rep_def_ovrd"].(string)
		if !ok || Per_rep_def_ovrd == "" {
			log.FuncErrorTrace(0, "Failed to get per_rep_def_ovrd for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_def_ovrd = ""
		}

		// r1_rebate_credit_$
		R1_rebate_credit, ok := item["r1_rebate_credit_$"].(string)
		if !ok || R1_rebate_credit == "" {
			log.FuncErrorTrace(0, "Failed to get r1_rebate_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R1_rebate_credit = ""
		}

		// r1_rebate_credit_perc
		R1_rebate_credit_perc, ok := item["r1_rebate_credit_perc"].(string)
		if !ok || R1_rebate_credit_perc == "" {
			log.FuncErrorTrace(0, "Failed to get r1_rebate_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R1_rebate_credit_perc = ""
		}

		// project_base_cost
		R2_rebate_credit, ok := item["r2_rebate_credit_$"].(string)
		if !ok || R2_rebate_credit == "" {
			log.FuncErrorTrace(0, "Failed to get R2_rebate_credit for Record ID %v. Item: %+v\n", RecordId, item)
			R2_rebate_credit = ""
		}

		// crt_addr
		R2_rebate_credit_perc, ok := item["r2_rebate_credit_perc"].(string)
		if !ok || R2_rebate_credit_perc == "" {
			log.FuncErrorTrace(0, "Failed to get R2_rebate_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R2_rebate_credit_perc = ""
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

		RebateData := models.GetRebateData{
			RecordId:           RecordId,
			UniqueId:           Unique_id,
			CustomerVerf:       Customer_verf,
			TypeRdMktg:         Type_rd_mktg,
			Item:               Item,
			Amount:             Amount,
			RepDollDivbyPer:    Rep_doll_divby_per,
			Notes:              Notes,
			Type:               Type,
			Rep_1_Name:         Rep_1_name,
			Rep_2_Name:         Rep_2_name,
			SysSize:            Sys_size,
			RepCount:           Rep_count,
			State:              StateName,
			PerRepAddrShare:    Per_rep_addr_share,
			PerRepOvrdShare:    Per_rep_ovrd_share,
			R1PayScale:         R1_pay_scale,
			Rep1DefResp:        Rep_1_def_resp,
			R1AddrResp:         R1_addr_resp,
			R2PayScale:         R2_pay_scale,
			PerRepDefOvrd:      Per_rep_def_ovrd,
			R1RebateCredit:     R1_rebate_credit,
			R1RebateCreditPerc: R1_rebate_credit_perc,
			R2RebateCredit:     R2_rebate_credit,
			R2RebateCreditPerc: R2_rebate_credit_perc,
			StartDate:          Start_date,
			EndDate:            EndDate,
		}

		RebateDataList.RebateDataList = append(RebateDataList.RebateDataList, RebateData)
	}

	// Send the response
	log.FuncInfoTrace(0, "Number of AutoAdder List fetched : %v list %+v", len(RebateDataList.RebateDataList), RebateDataList)
	FormAndSendHttpResp(resp, "AutoAdder Data", http.StatusOK, RebateDataList)
}

/******************************************************************************
 * FUNCTION:		PrepareRebateDataFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareDebateDataFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareAutoAdderFilters")
	defer func() { log.ExitFn(0, "PrepareAutoAdderFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")

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
			case "customer_verf":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.customer_verf) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type_rd_mktg":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.type_rd_mktg) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "exact_amount":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.exact_amount) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "item":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ad.item) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_doll_divby_per":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_doll_divby_per %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "notes":
				filtersBuilder.WriteString(fmt.Sprintf("ad.notes %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "type":
				filtersBuilder.WriteString(fmt.Sprintf("ad.type %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep1_name":
				filtersBuilder.WriteString(fmt.Sprintf("rep_1_name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep2_name":
				filtersBuilder.WriteString(fmt.Sprintf("rep_2_name %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sys_size":
				filtersBuilder.WriteString(fmt.Sprintf("ad.sys_size %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_count":
				filtersBuilder.WriteString(fmt.Sprintf("ad.rep_count %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.name %s $%d", operator, len(whereEleList)+1))
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
			case "per_rep_def_ovrd":
				filtersBuilder.WriteString(fmt.Sprintf("ad.per_rep_def_ovrd %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_rebate_credit":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_rebate_credit %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "contract_amount":
				filtersBuilder.WriteString(fmt.Sprintf("ad.contract_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r1_rebate_credit_perc":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r1_rebate_credit_perc %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_rebate_credit":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r2_rebate_credit %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "r2_rebate_credit_perc":
				filtersBuilder.WriteString(fmt.Sprintf("ad.r2_rebate_credit_perc %s $%d", operator, len(whereEleList)+1))
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

	// Add pagination logic
	if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
