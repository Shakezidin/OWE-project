/**************************************************************************
 * File       	   : apiGetPaymentSchedulesData.go
 * DESCRIPTION     : This file contains functions for get payment schedule data handler
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
 * FUNCTION:		HandleGetPaymentSchedulesDataRequest
 * DESCRIPTION:     handler for get payment schedules data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPaymentSchedulesDataRequest(resp http.ResponseWriter, req *http.Request) {
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

	log.EnterFn(0, "HandleGetPaymentSchedulesDataRequest")
	defer func() { log.ExitFn(0, "HandleGetPaymentSchedulesDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get payment shedule data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get payment schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get payment schedule data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get payment schedule data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_payment_schedule
	query = `SELECT ps.id as record_id, vd.dealer_name as dealer, pt1.partner_name AS partner_name, pt2.partner_name AS installer_name, 
	st.name AS state, sl.type_name AS sale_type, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay, ps.commission_model, ps.start_date, ps.end_date
	FROM payment_schedule ps 
	JOIN states st ON st.state_id = ps.state_id 
	JOIN partners pt1 ON pt1.partner_id = ps.partner_id 
	JOIN partners pt2 ON pt2.partner_id = ps.installer_id 
	JOIN sale_type sl ON sl.id = ps.sale_type_id 
	JOIN v_dealer vd ON vd.id = ps.dealer_id`

	filter, whereEleList = PreparePaymentScheduleFilters(tableName, dataReq, false)
	if filter != "" {
		queryWithFiler = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get payment schedule data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get payment schedule data from DB", http.StatusBadRequest, nil)
		return
	}

	paymentScheduleList := models.GetPaymentScheduleList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Dealer
		Dealer, ok := item["dealer"].(string)
		if !ok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get dealer for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
		}

		// PartnerName
		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// Installer
		Installer, ok := item["installer_name"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// Sale
		Sale, ok := item["sale_type"].(string)
		if !ok || Sale == "" {
			log.FuncErrorTrace(0, "Failed to get sale for Record ID %v. Item: %+v\n", RecordId, item)
			Sale = ""
		}

		// Rl
		Rl, ok := item["rl"].(float64)
		if !ok || Rl == 0.0 {
			log.FuncErrorTrace(0, "Failed to get Rl for Record ID %v. Item: %+v\n", RecordId, item)
			Rl = 0.0
		}

		// Draw
		Draw, ok := item["draw"].(float64)
		if !ok || Draw == 0.0 {
			log.FuncErrorTrace(0, "Failed to get draw for Record ID %v. Item: %+v\n", RecordId, item)
			Draw = 0.0
		}

		// DrawMax
		DrawMax, ok := item["draw_max"].(float64)
		if !ok || DrawMax == 0.0 {
			log.FuncErrorTrace(0, "Failed to get draw max for Record ID %v. Item: %+v\n", RecordId, item)
			DrawMax = 0.0
		}

		// RepDraw
		RepDraw, ok := item["rep_draw"].(float64)
		if !ok || RepDraw == 0.0 {
			log.FuncErrorTrace(0, "Failed to get rep draw for Record ID %v. Item: %+v\n", RecordId, item)
			RepDraw = 0.0
		}

		// RepDrawMax
		RepDrawMax, ok := item["rep_draw_max"].(float64)
		if !ok || RepDrawMax == 0.0 {
			log.FuncErrorTrace(0, "Failed to get rep_draw_max for Record ID %v. Item: %+v\n", RecordId, item)
			RepDrawMax = 0.0
		}

		// RepPay
		RepPay, ok := item["rep_pay"].(string)
		if !ok || RepPay == "" {
			log.FuncErrorTrace(0, "Failed to get rep pay for Record ID %v. Item: %+v\n", RecordId, item)
			RepPay = ""
		}

		// CommissionModel
		CommissionModel, ok := item["commission_model"].(string)
		if !ok || CommissionModel == "" {
			log.FuncErrorTrace(0, "Failed to get CommissionModel for Record ID %v. Item: %+v\n", RecordId, item)
			CommissionModel = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		paySchData := models.GetPaymentScheduleData{
			RecordId:        RecordId,
			Dealer:          Dealer,
			PartnerName:     PartnerName,
			InstallerName:   Installer,
			State:           State,
			SaleType:        Sale,
			Rl:              Rl,
			Draw:            Draw,
			DrawMax:         DrawMax,
			RepDraw:         RepDraw,
			RepDrawMax:      RepDrawMax,
			RepPay:          RepPay,
			CommissionModel: CommissionModel,
			StartDate:       StartDate,
			EndDate:         EndDate,
		}

		paymentScheduleList.PaymentScheduleList = append(paymentScheduleList.PaymentScheduleList, paySchData)
	}

	filter, whereEleList = PreparePaymentScheduleFilters(tableName, dataReq, true)
	if filter != "" {
		queryForAlldata = query + filter
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, queryForAlldata, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get payment shedule data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get payment shedule data from DB", http.StatusBadRequest, nil)
		return
	}
	RecordCount = int64(len(data))
	// Send the response
	log.FuncInfoTrace(0, "Number of payment schedule List fetched : %v list %+v", len(paymentScheduleList.PaymentScheduleList), paymentScheduleList)
	appserver.FormAndSendHttpResp(resp, "Payment Schedule Data", http.StatusOK, paymentScheduleList, RecordCount)
}

/******************************************************************************
 * FUNCTION:		PreparePaymentScheduleFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PreparePaymentScheduleFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePaymentScheduleFilters")
	defer func() { log.ExitFn(0, "PreparePaymentScheduleFilters", nil) }()

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
			case "dealer":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(vd.dealer_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt1.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt2.partner_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "sale_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sl.type_name) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rl":
				filtersBuilder.WriteString(fmt.Sprintf("ps.rl %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "draw":
				filtersBuilder.WriteString(fmt.Sprintf("ps.draw %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "draw_max":
				filtersBuilder.WriteString(fmt.Sprintf("ps.draw_max %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_draw":
				filtersBuilder.WriteString(fmt.Sprintf("ps.rep_draw %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_draw_max":
				filtersBuilder.WriteString(fmt.Sprintf("ps.rep_draw_max %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "rep_pay":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ps.rep_pay) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "commission_model":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ps.commission_model) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("ps.start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("ps.end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)

			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ps.%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
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
		filtersBuilder.WriteString("ps.is_archived = TRUE")
	} else {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
		}
		filtersBuilder.WriteString("ps.is_archived = FALSE")
	}

	if forDataCount == true {
		filtersBuilder.WriteString(" GROUP BY ps.id, vd.dealer_name, pt1.partner_name, pt2.partner_name, st.name, sl.type_name, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay, ps.commission_model, ps.start_date, ps.end_date")
	} else {
		// Add pagination logic
		if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
			offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
			filtersBuilder.WriteString(fmt.Sprintf(" ORDER BY ps.id OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
