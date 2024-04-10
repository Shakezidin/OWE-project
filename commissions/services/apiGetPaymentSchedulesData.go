/**************************************************************************
 * File       	   : apiGetPaymentSchedulesData.go
 * DESCRIPTION     : This file contains functions for get payment schedule data handler
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
 * FUNCTION:		HandleGetPaymentSchedulesDataRequest
 * DESCRIPTION:     handler for get payment schedules data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPaymentSchedulesDataRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		dataReq      models.DataRequestBody
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)

	log.EnterFn(0, "HandleGetCommissionsDataRequest")
	defer func() { log.ExitFn(0, "HandleGetCommissionsDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Commissions data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get payment schedules data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get payment schedules data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get payment schedules data Request body", http.StatusBadRequest, nil)
		return
	}

	tableName := db.TableName_payment_schedule
	query = `SELECT ps.id as record_id, ud.name as partner, pt1.partner_name AS partner_name, pt2.partner_name AS installer_name, 
	st.name AS state, sl.type_name AS sale_type, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay, ps.start_date, ps.end_date
	FROM payment_schedule ps 
	JOIN states st ON st.state_id = ps.state_id 
	JOIN partners pt1 ON pt1.partner_id = ps.partner_id 
	JOIN partners pt2 ON pt2.partner_id = ps.installer_id 
	JOIN sale_type sl ON sl.id = ps.sale_type_id 
	JOIN user_details ud ON ud.user_id = ps.rep_id`

	filter, whereEleList = PreparePaymentScheduleFilters(tableName, dataReq)
	if filter != "" {
		query += filter
	}

	data, err = db.ReteriveFromDB(query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get payment schedules data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get payment schedules data from DB", http.StatusBadRequest, nil)
		return
	}

	paymentScheduleList := models.GetPaymentScheduleList{}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Partner
		Partner, ok := item["partner"].(string)
		if !ok || Partner == "" {
			log.FuncErrorTrace(0, "Failed to get Partner for Record ID %v. Item: %+v\n", RecordId, item)
			Partner = ""
		}

		// PartnerName
		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get Partner Name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// Installer
		Installer, ok := item["installer_name"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get Installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get State for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// Sale
		Sale, ok := item["sale_type"].(string)
		if !ok || Sale == "" {
			log.FuncErrorTrace(0, "Failed to get Sale for Record ID %v. Item: %+v\n", RecordId, item)
			Sale = ""
		}

		// Rl
		Rl, ok := item["rl"].(string)
		if !ok || Rl == "" {
			log.FuncErrorTrace(0, "Failed to get Rl for Record ID %v. Item: %+v\n", RecordId, item)
			Rl = ""
		}

		// Draw
		Draw, ok := item["draw"].(string)
		if !ok || Draw == "" {
			log.FuncErrorTrace(0, "Failed to get Draw for Record ID %v. Item: %+v\n", RecordId, item)
			Draw = ""
		}

		// DrawMax
		DrawMax, ok := item["draw_max"].(string)
		if !ok || DrawMax == "" {
			log.FuncErrorTrace(0, "Failed to get DrawMax for Record ID %v. Item: %+v\n", RecordId, item)
			DrawMax = ""
		}

		// RepDraw
		RepDraw, ok := item["rep_draw"].(string)
		if !ok || RepDraw == "" {
			log.FuncErrorTrace(0, "Failed to get RepDraw for Record ID %v. Item: %+v\n", RecordId, item)
			RepDraw = ""
		}

		// RepDrawMax
		RepDrawMax, ok := item["rep_draw_max"].(string)
		if !ok || RepDrawMax == "" {
			log.FuncErrorTrace(0, "Failed to get RepDrawMax for Record ID %v. Item: %+v\n", RecordId, item)
			RepDrawMax = ""
		}

		// RepPay
		RepPay, ok := item["rep_pay"].(string)
		if !ok || RepPay == "" {
			log.FuncErrorTrace(0, "Failed to get RepPay for Record ID %v. Item: %+v\n", RecordId, item)
			RepPay = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get StartDate for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get EndDate for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		paySchData := models.GetPaymentScheduleData{
			RecordId:      RecordId,
			Partner:       Partner,
			PartnerName:   PartnerName,
			InstallerName: Installer,
			State:         State,
			SaleType:      Sale,
			Rl:            Rl,
			Draw:          Draw,
			DrawMax:       DrawMax,
			RepDraw:       RepDraw,
			RepDrawMax:    RepDrawMax,
			RepPay:        RepPay,
			StartDate:     StartDate,
			EndDate:       EndDate,
		}

		paymentScheduleList.PaymentScheduleList = append(paymentScheduleList.PaymentScheduleList, paySchData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of payment schedules List fetched : %v list %+v", len(paymentScheduleList.PaymentScheduleList), paymentScheduleList)
	FormAndSendHttpResp(resp, "Payment Schedules Data", http.StatusOK, paymentScheduleList)
}

/******************************************************************************
 * FUNCTION:		PreparePaymentScheduleFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PreparePaymentScheduleFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePaymentScheduleFilters")
	defer func() { log.ExitFn(0, "PreparePaymentScheduleFilters", nil) }()
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
			case "partner":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(ud.name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt1.partner_name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(pt2.partner_name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(st.name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
				whereEleList = append(whereEleList, strings.ToLower(filter.Data.(string)))
			case "sale_type":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(sl.type_name) %s LOWER($%d)", filter.Operation, len(whereEleList)+1))
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
