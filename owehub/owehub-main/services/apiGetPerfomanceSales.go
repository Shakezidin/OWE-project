/**************************************************************************
 * File       	   : apiGetPerfomanceSales.go
 * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
 * DATE            : 03-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetPerfomanceSalesRequest
* DESCRIPTION:     handler for get PerfomanceSales request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetPerfomanceSalesRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.GetPerfomanceReq
		data             []map[string]interface{}
		whereEleList     []interface{}
		query            string
		filter           string
		rgnSalesMgrCheck bool
		SaleRepList      []interface{}
	)

	log.EnterFn(0, "HandleGetPerfomanceSalesRequest")
	defer func() { log.ExitFn(0, "HandleGetPerfomanceSalesRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	// this will give zero value and will be modified once the rep pay calculations are don

	// query = `
	// SELECT SUM(system_size) AS sales_kw, COUNT(system_size) AS sales  FROM consolidated_data_view`

	query = `
	SELECT
    COUNT(intOpsMetSchema.site_survey_scheduled_date) AS site_survey_scheduled_count,
    COUNT(intOpsMetSchema.site_survey_completed_date) AS site_survey_completed_count,
    COUNT(intOpsMetSchema.cad_ready) AS cad_ready_count,
    COUNT(intOpsMetSchema.cad_complete_date) AS cad_complete_count,
	COUNT(intOpsMetSchema.permit_submitted_date) AS permit_submitted_date,
    COUNT(intOpsMetSchema.pv_install_created_date) AS pv_install_created_count,
    COUNT(intOpsMetSchema.ic_submitted_date) AS ic_submitted_count,
    COUNT(intOpsMetSchema.permit_approved_date) AS permit_approved_count,
    COUNT(intOpsMetSchema.ic_approved_date) AS ic_approved_count,
    COUNT(fieldOpsSchema.roofing_created_date) AS roofing_created_count,
    COUNT(fieldOpsSchema.roofing_completed_date) AS roofing_completed_count,
    COUNT(fieldOpsSchema.battery_scheduled_date) AS battery_scheduled_count,
    COUNT(fieldOpsSchema.battery_complete_date) AS battery_complete_count,
    COUNT(intOpsMetSchema.pv_install_completed_date) AS pv_install_completed_count,
    COUNT(fieldOpsSchema.mpu_created_date) AS mpu_created_count,
    COUNT(fieldOpsSchema.derate_created_date) AS derate_created_count,
    COUNT(secondFieldOpsSchema.trenching_ws_open) AS trenching_ws_open_count,
    COUNT(fieldOpsSchema.derate_completed_date) AS derate_completed_count,
    COUNT(fieldOpsSchema.mpu_complete_date) AS mpu_complete_count,
    COUNT(secondFieldOpsSchema.trenching_completed) AS trenching_completed_count,
    COUNT(fieldOpsSchema.fin_created_date) AS fin_created_count,
    COUNT(fieldOpsSchema.fin_pass_date) AS fin_pass_count,
    COUNT(intOpsMetSchema.pto_submitted_date) AS pto_submitted_count,
    COUNT(intOpsMetSchema.pto_date) AS pto_date_count
	FROM
    internal_ops_metrics_schema AS intOpsMetSchema
LEFT JOIN sales_metrics_schema AS salMetSchema 
    ON intOpsMetSchema.unique_id = salMetSchema.unique_id
LEFT JOIN field_ops_metrics_schema AS fieldOpsSchema 
    ON intOpsMetSchema.unique_id = fieldOpsSchema.unique_id
LEFT JOIN second_field_ops_metrics_schema AS secondFieldOpsSchema 
    ON intOpsMetSchema.unique_id = secondFieldOpsSchema.unique_id
`

	tableName := db.ViewName_ConsolidatedDataView
	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	allSaleRepQuery := models.SalesRepRetrieveQueryFunc()
	otherRoleQuery := models.AdminDlrSaleRepRetrieveQueryFunc()

	whereEleList = append(whereEleList, dataReq.Email)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, otherRoleQuery, whereEleList)

	// This checks if the user is admin, sale rep or dealer
	if len(data) > 0 {
		role := data[0]["role_name"]
		name := data[0]["name"]
		dealerName := data[0]["dealer_name"]
		rgnSalesMgrCheck = false
		dataReq.DealerName = dealerName

		switch role {
		case "Admin":
			filter, whereEleList = PreparePerfomanceAdminDlrFilters(tableName, dataReq, true)
			// break
		case "Dealer Owner":
			filter, whereEleList = PreparePerfomanceAdminDlrFilters(tableName, dataReq, false)
			// break
		case "Sale Representative":
			SaleRepList = append(SaleRepList, name)
			filter, whereEleList = PrepareSaleRepPerfFilters(tableName, dataReq, SaleRepList)
			// break
		// this is for regional manager and sales manager
		default:
			rgnSalesMgrCheck = true
		}
	}

	if rgnSalesMgrCheck {
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, allSaleRepQuery, whereEleList)

		// This is thrown if no sale rep are available and for other user roles
		if len(data) == 0 {
			log.FuncErrorTrace(0, "No sale representative available %v", err)
			FormAndSendHttpResp(resp, "Failed to get perfomance sales , err: %v", http.StatusBadRequest, data)
			return
		}

		// this loops through sales rep under regional or sales manager
		for _, item := range data {
			SaleRepName, Ok := item["name"]
			if !Ok || SaleRepName == "" {
				log.FuncErrorTrace(0, "Failed to get name. Item: %+v\n", item)
				continue
			}
			SaleRepList = append(SaleRepList, SaleRepName)
		}

		dealerName := data[0]["dealer_name"]
		dataReq.DealerName = dealerName
		filter, whereEleList = PrepareSaleRepPerfFilters(tableName, dataReq, SaleRepList)
	}

	if filter != "" {
		query = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get perfomance sales from DB for with err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get perfomance sales , err: %v", http.StatusBadRequest, err)
		return
	}

	log.FuncInfoTrace(0, "total perfomance report list %+v", len(data))
	FormAndSendHttpResp(resp, "perfomance report", http.StatusOK, data)
}

/******************************************************************************
* FUNCTION:		PreparePerfomanceAdminDlrFilters
* DESCRIPTION:     handler for secondary filter for admin and dealer
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PreparePerfomanceAdminDlrFilters(columnName string, dataFilter models.GetPerfomanceReq, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PreparePerfomanceAdminDlrFilters")
	defer func() { log.ExitFn(0, "PreparePerfomanceAdminDlrFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if StartDate and EndDate are provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)
		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		// Start building the WHERE clause with the date range filter
		filtersBuilder.WriteString(fmt.Sprintf(" WHERE salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')",
			len(whereEleList)-1, len(whereEleList)))
	} else {
		// Start building the WHERE clause without the date range filter
		filtersBuilder.WriteString(" WHERE 1=1")
	}

	// Add the remaining filters
	filtersBuilder.WriteString(`
		AND intOpsMetSchema.unique_id IS NOT NULL
		AND intOpsMetSchema.unique_id <> ''
		AND intOpsMetSchema.system_size IS NOT NULL
		AND intOpsMetSchema.system_size > 0
		AND salMetSchema.project_status NOT IN ('CANCEL', 'PTO''d')`)

	// Add dealer filter if adminCheck is false
	if !adminCheck {
		filtersBuilder.WriteString(fmt.Sprintf(" AND dealer = $%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataFilter.DealerName)
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}

/*
*****************************************************************************
  - FUNCTION:		PrepareSaleRepPerfFilters
  - DESCRIPTION:    handler for secondary filter for regional, sales manager and
    sale rep
  - INPUT:			resp, req
  - RETURNS:    		void

*****************************************************************************
*/
func PrepareSaleRepPerfFilters(tableName string, dataFilter models.GetPerfomanceReq, saleRepList []interface{}) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareStatusFilters")
	defer func() { log.ExitFn(0, "PrepareStatusFilters", nil) }()

	var filtersBuilder strings.Builder

	// Check if StartDate and EndDate are provided
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)
		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		// Add the date range condition to the WHERE clause
		filtersBuilder.WriteString(fmt.Sprintf(" WHERE salMetSchema.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')",
			len(whereEleList)-1, len(whereEleList)))
	} else {
		// Start the WHERE clause without the date range filter
		filtersBuilder.WriteString(" WHERE 1=1")
	}

	// Add conditions for unique_id, system_size, and project_status
	filtersBuilder.WriteString(`
		AND intOpsMetSchema.unique_id IS NOT NULL
		AND intOpsMetSchema.unique_id <> ''
		AND intOpsMetSchema.system_size IS NOT NULL
		AND intOpsMetSchema.system_size > 0
		AND salMetSchema.project_status NOT IN ('CANCEL', 'PTO''d')`)

	// Add the primary_sales_rep IN condition
	filtersBuilder.WriteString(" AND primary_sales_rep IN (")
	for i, saleRep := range saleRepList {
		filtersBuilder.WriteString(fmt.Sprintf("$%d", len(whereEleList)+1))
		whereEleList = append(whereEleList, saleRep)

		if i < len(saleRepList)-1 {
			filtersBuilder.WriteString(", ")
		}
	}
	filtersBuilder.WriteString(")")

	// Add the dealer condition
	filtersBuilder.WriteString(fmt.Sprintf(" AND dealer = $%d", len(whereEleList)+1))
	whereEleList = append(whereEleList, dataFilter.DealerName)

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}

// /******************************************************************************
// * FUNCTION:		PrepareDateFilters
// * DESCRIPTION:     handler for prepare primary filter
// * INPUT:			resp, req
// * RETURNS:    		void
// ******************************************************************************/

// func PrepareDateFilters(columnName string, intervalCount string, whereListLength int) (filters string) {
// 	log.EnterFn(0, "PrepareDateFilters")
// 	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

// 	var filtersBuilder strings.Builder
// 	filtersBuilder.WriteString(" WHERE ")

// 	// sm is
// 	switch columnName {
// 	case "contract_date":
// 		filtersBuilder.WriteString(fmt.Sprintf(" sm.contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", whereListLength-1, whereListLength))
// 	case "ntp_date":
// 		filtersBuilder.WriteString(fmt.Sprintf(" sm.ntp_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", whereListLength-1, whereListLength))
// 	case "cancelled_date":
// 		filtersBuilder.WriteString(fmt.Sprintf(" sm.cancelled_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", whereListLength-1, whereListLength))
// 	case "pv_install_completed_date":
// 		filtersBuilder.WriteString(fmt.Sprintf(" intOpsMetSchema.pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", whereListLength-1, whereListLength))
// 	}
// 	filters = filtersBuilder.String()
// 	return filters
// }
