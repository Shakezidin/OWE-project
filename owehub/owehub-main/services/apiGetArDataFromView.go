/**************************************************************************
 * File       	   : apiGetArDataFromView.go
 * DESCRIPTION     : This file contains functions for get ApptSetters data handler
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		GetARDataFromView
 * DESCRIPTION:     handler for get ApptSetters data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func GetARDataFromView(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.GetArDataReq
		data    []map[string]interface{}
		// whereEleList []interface{}
		query string
		// queryForAlldata string
		// filter string
		RecordCount int64
	)

	log.EnterFn(0, "GetARDataFromView")
	defer func() { log.ExitFn(0, "GetARDataFromView", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get ar data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get ar data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get ar data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get ar data Request body", http.StatusBadRequest, nil)
		return
	}

	if dataReq.ReportType == "" || dataReq.SalePartner == "" {
		err = fmt.Errorf("Empty Input Fields in API is Not Allowed")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "Empty Input Fields in API is Not Allowed", http.StatusBadRequest, nil)
		return
	}

	// Map to hold statuses
	statuses := map[string]bool{
		"Shaky":   dataReq.Shaky,
		"Cancel":  dataReq.Cancel,
		"Sold":    dataReq.Sold,
		"Permits": dataReq.Permits,
		"NTP":     dataReq.NTP,
		"Install": dataReq.Install,
		"PTO":     dataReq.PTO,
	}

	// Generate the query
	query = generateQuery(dataReq.ReportType, dataReq.SalePartner, dataReq.SortBy, statuses, dataReq, false)

	// data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ar data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get ar data from DB", http.StatusBadRequest, nil)
		return
	}

	arDataList := models.GetArDataList{}

	for _, item := range data {
		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", UniqueId, item)
			continue
		}

		// Partner
		Partner, ok := item["partner"].(string)
		if !ok || Partner == "" {
			log.FuncErrorTrace(0, "Failed to get partner for Record ID %v. Item: %+v\n", UniqueId, item)
			Partner = ""
		}

		// Installer
		Installer, ok := item["instl"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get Installer for Record ID %v. Item: %+v\n", UniqueId, item)
			Installer = ""
		}

		// InstallerName
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type name for Record ID %v. Item: %+v\n", UniqueId, item)
			Type = ""
		}

		// SaleTypeName
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			log.FuncErrorTrace(0, "Failed to get sale type name for Record ID %v. Item: %+v\n", UniqueId, item)
			HomeOwner = ""
		}

		// StreetAddress
		StreetAddress, ok := item["street_address"].(string)
		if !ok || StreetAddress == "" {
			log.FuncErrorTrace(0, "Failed to get street address for Record ID %v. Item: %+v\n", UniqueId, item)
			StreetAddress = ""
		}

		// City
		City, ok := item["city"].(string)
		if !ok || City == "" {
			log.FuncErrorTrace(0, "Failed to get city for Record ID %v. Item: %+v\n", UniqueId, item)
			City = ""
		}

		// St
		St, ok := item["st"].(string)
		if !ok || St == "" {
			log.FuncErrorTrace(0, "Failed to get st for Record ID %v. Item: %+v\n", UniqueId, item)
			St = ""
		}

		// Zip
		Zip, ok := item["zip"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get zip for Record ID %v. Item: %+v\n", UniqueId, item)
			Zip = 0
		}

		// PermitMax
		Sys_size, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys_size for Record ID %v. Item: %+v\n", UniqueId, item)
			Sys_size = 0.0
		}

		// Wc
		Wc, ok := item["wc"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get wc for Record ID %v. Item: %+v\n", UniqueId, item)
			Wc = time.Time{}
		}

		// InstSys
		InstSys, ok := item["inst_sys"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get inst_sys for Record ID %v. Item: %+v\n", UniqueId, item)
			InstSys = time.Time{}
		}

		// Status
		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			log.FuncErrorTrace(0, "Failed to get status for Record ID %v. Item: %+v\n", UniqueId, item)
			Status = ""
		}

		// Status
		StatusDate, ok := item["status_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get status date for Record ID %v. Item: %+v\n", UniqueId, item)
			StatusDate = time.Time{}
		}

		// ContractCalc
		ContractCalc, ok := item["contract_calc"].(float64)
		if !ok || ContractCalc == 0.0 {
			log.FuncErrorTrace(0, "Failed to get contract calc for Record ID %v. Item: %+v\n", UniqueId, item)
			ContractCalc = 0.0
		}

		// OweAr
		OweAr, ok := item["owe_ar"].(float64)
		if !ok || OweAr == 0.0 {
			log.FuncErrorTrace(0, "Failed to get owe ar for Record ID %v. Item: %+v\n", UniqueId, item)
			OweAr = 0.0
		}

		// TotalPaid
		TotalPaid, ok := item["total_paid"].(float64)
		if !ok || TotalPaid == 0.0 {
			log.FuncErrorTrace(0, "Failed to get tatal paid for Record ID %v. Item: %+v\n", UniqueId, item)
			TotalPaid = 0.0
		}

		// CurrentDue
		CurrentDue, ok := item["current_due"].(float64)
		if !ok || CurrentDue == 0.0 {
			log.FuncErrorTrace(0, "Failed to get current due for Record ID %v. Item: %+v\n", UniqueId, item)
			CurrentDue = 0.0
		}

		// Balance
		Balance, ok := item["balance"].(float64)
		if !ok || Balance == 0.0 {
			log.FuncErrorTrace(0, "Failed to get balance for Record ID %v. Item: %+v\n", UniqueId, item)
			Balance = 0.0
		}

		WcStr := Wc.Format("2006-01-02")
		InstSysStr := InstSys.Format("2006-01-02")
		StatusDateStr := StatusDate.Format("2006-01-02")

		arData := models.GetArdata{
			UniqueId:      UniqueId,
			Partner:       Partner,
			Installer:     Installer,
			Type:          Type,
			HomeOwner:     HomeOwner,
			StreetAddress: StreetAddress,
			City:          City,
			ST:            St,
			Zip:           float64(Zip),
			SysSize:       Sys_size,
			WC:            WcStr,
			InstSys:       InstSysStr,
			Status:        Status,
			StatusDate:    StatusDateStr,
			ContractCalc:  ContractCalc,
			OweAr:         OweAr,
			TotalPaid:     TotalPaid,
			CurrentDue:    CurrentDue,
			Balance:       Balance,
		}
		arDataList.ArDataList = append(arDataList.ArDataList, arData)
	}

	query = ""
	query = generateQuery(dataReq.ReportType, dataReq.SalePartner, dataReq.SortBy, statuses, dataReq, true)

	datacount, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get appt setters data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get appt setters data from DB", http.StatusBadRequest, nil)
		return
	}

	count, ok := datacount[0]["count"].(int64)
	if ok {
		RecordCount = count
	} else {
		log.FuncErrorTrace(0, "Error: The 'count' value is not of type float64")
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of ar data List fetched : %v", len(arDataList.ArDataList))
	FormAndSendHttpResp(resp, "Ar  Data", http.StatusOK, arDataList, RecordCount)
}

// Function to generate the base query
func getBaseQuery(dataCount bool) string {
	if !dataCount {
		return `SELECT * FROM ar_data`
	} else {
		return `SELECT COUNT(*) as count FROM ar_data`
	}
}

// Function to generate the WHERE clause based on parameters
func getWhereClause(reportType, salePartner string, statuses map[string]bool) string {
	var conditions []string

	switch {
	case reportType == "ALL" && salePartner == "ALL":
		conditions = append(conditions, "balance != 0")
		conditions = append(conditions, generateStatusCondition(statuses))
	case reportType == "ALL" && salePartner != "ALL":
		conditions = append(conditions, "balance != 0")
		conditions = append(conditions, generateStatusCondition(statuses))
		conditions = append(conditions, "partner = '-ALL-'")
	case reportType == "current due" && salePartner == "ALL":
		conditions = append(conditions, "current_due > 0", "balance < 0")
		conditions = append(conditions, generateStatusCondition(statuses))
	case reportType == "current due" && salePartner != "ALL":
		conditions = append(conditions, "current_due > 0", "balance < 0")
		conditions = append(conditions, generateStatusCondition(statuses))
		conditions = append(conditions, "partner = '-ALL-'")
	case reportType == "overpaid" && salePartner == "ALL":
		conditions = append(conditions, "current_due < 0", "balance >= 0")
	case reportType == "overpaid" && salePartner != "ALL":
		conditions = append(conditions, "current_due < 0", "balance >= 0")
		conditions = append(conditions, "partner = 'ALL'")
	}

	if len(conditions) > 0 {
		return " WHERE " + strings.Join(conditions, " AND ")
	}
	return ""
}

func generateStatusCondition(statuses map[string]bool) string {
	var statusConditions []string

	for status, include := range statuses {
		if include {
			statusConditions = append(statusConditions, fmt.Sprintf("'%s'", status))
		}
	}

	if len(statusConditions) > 0 {
		return fmt.Sprintf("status IN (%s)", strings.Join(statusConditions, ", "))
	}
	return ""
}

func getOrderByClause(sortBy string) string {
	if sortBy != "" {
		return fmt.Sprintf(" ORDER BY %s ASC", sortBy)
	}
	return ""
}

func generateQuery(reportType, salePartner, sortBy string, statuses map[string]bool, datareq models.GetArDataReq, forDataCount bool) string {
	var query string
	if !forDataCount {
		query += getBaseQuery(false)
		query += getWhereClause(reportType, salePartner, statuses)
		query += PrepareardataFilters(datareq, true)
		query += getOrderByClause(sortBy)
		query += PrepareardataFilters(datareq, false)
	} else {
		query += getBaseQuery(true)
	}
	return query
}

func PrepareardataFilters(dataFilter models.GetArDataReq, check bool) (filters string) {
	log.EnterFn(0, "PrepareApptSettersFilters")
	defer func() { log.ExitFn(0, "PrepareApptSettersFilters", nil) }()

	var filtersBuilder strings.Builder

	if check {
		for i, filter := range dataFilter.Filters {
			column := filter.Column

			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}

			switch column {
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf(" LOWER(unique_id) %s LOWER(%s) ", operator, value))
			}
		}
		filters = filtersBuilder.String()
		return filters
	}

	if dataFilter.PageNumber > 0 && dataFilter.PageSize > 0 {
		offset := (dataFilter.PageNumber - 1) * dataFilter.PageSize
		filtersBuilder.WriteString(fmt.Sprintf(" OFFSET %d LIMIT %d", offset, dataFilter.PageSize))
	}

	filters = filtersBuilder.String()
	return filters
}
