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
	query = `SELECT ud.name as partner, pt1.partner_name AS partner_name, pt2.partner_name AS installer_name, 
	st.name AS state, sl.type_name AS sale_type, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay
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
		Partner := item["partner"].(string)
		PartnerName := item["partner_name"].(string)
		Installer := item["installer_name"].(string)
		State := item["state"].(string)
		Sale := item["sale_type"].(string)
		Rl := item["rl"].(string)
		Draw, _ := item["draw"].(string)
		DrawMax, _ := item["draw_max"].(string)
		RepDraw := item["rep_draw"].(string)
		RepPay := item["rep_pay"].(string)

		paySchData := models.GetPaymentScheduleData{
			Partner:       Partner,
			PartnerName:   PartnerName,
			InstallerName: Installer,
			State:         State,
			SaleType:      Sale,
			Rl:            Rl,
			Draw:          Draw,
			DrawMax:       DrawMax,
			RepDraw:       RepDraw,
			RepPay:        RepPay,
		}

		paymentScheduleList.PaymentScheduleList = append(paymentScheduleList.PaymentScheduleList, paySchData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of payment schedules List fetched : %v teamlist %+v", len(paymentScheduleList.PaymentScheduleList), paymentScheduleList)
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
				filtersBuilder.WriteString(fmt.Sprintf("ud.name %s $%d", filter.Operation, len(whereEleList)+1))
			case "partner_name":
				filtersBuilder.WriteString(fmt.Sprintf("pt1.partner_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "installer_name":
				filtersBuilder.WriteString(fmt.Sprintf("pt2.partner_name %s $%d", filter.Operation, len(whereEleList)+1))
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf("st.name %s $%d", filter.Operation, len(whereEleList)+1))
			case "sale_type":
				filtersBuilder.WriteString(fmt.Sprintf("sl.type_name %s $%d", filter.Operation, len(whereEleList)+1))
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
