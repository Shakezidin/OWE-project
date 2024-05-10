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
		err          error
		dataReq      models.GetArDataReq
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		// queryForAlldata string
		// filter string
		// RecordCount     int64
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

	query = ` SELECT  *
	FROM ar_data
	WHERE 
		CASE 
			WHEN $1 = '-ALL-' AND $2 = '-ALL-' THEN 
				(SELECT 1 FROM ar_data AS ad 
				WHERE ad.balance != 0 AND 
				ad.status IN ('Shaky', 'Cancel', 'Sold', 'Permits', 'NTP', 'Install', 'PTO')
				LIMIT 1)
		
			WHEN $1 = '-ALL-' AND $2 != '-ALL-' THEN 
				(SELECT 1 FROM ar_data AS ad 
				WHERE ad.balance != 0 AND 
				ad.status IN ('Shaky', 'Cancel', 'Permits', 'NTP', 'Install', 'PTO') AND ad.partner = '-ALL-'
				LIMIT 1)
		
			WHEN $1 = 'current due' AND $2 = '-ALL-' THEN 
				(SELECT 1 FROM ar_data AS ad 
				WHERE ad.current_due > 0 AND ad.balance < 0 AND 
				ad.status IN ('Shaky', 'Cancel', 'Permits', 'NTP', 'Install', 'PTO') 
				LIMIT 1)
		
			WHEN $1 = 'current due' AND $2 != '-ALL-' THEN 
				(SELECT 1 FROM ar_data AS ad 
				WHERE ad.current_due > 0 AND ad.balance < 0 AND 
				ad.status IN ('Shaky', 'Cancel', 'Permits', 'NTP', 'Install', 'PTO') AND ad.partner = '-ALL-'
				LIMIT 1)
		
			WHEN $1 = 'overpaid' AND $2 = '-ALL-' THEN 
				(SELECT 1 FROM ar_data AS ad 
				WHERE ad.current_due < 0 AND ad.balance >= 0
				LIMIT 1)
		
			WHEN $1 = 'overpaid' AND $2 != '-ALL-' THEN
				(SELECT 1
				FROM ar_data AS ad
				WHERE ad.current_due < 0 AND ad.balance >= 0 AND ad.partner = '-ALL-' 
				LIMIT 1)
		END IS NOT NULL
	ORDER BY 
		partner ASC`

	whereEleList = append(whereEleList, dataReq.ReportType)
	whereEleList = append(whereEleList, dataReq.SalePartner)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
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
		Wc, ok := item["wc"].(string)
		if !ok || Wc == "" {
			log.FuncErrorTrace(0, "Failed to get wc for Record ID %v. Item: %+v\n", UniqueId, item)
			Wc = ""
		}

		// InstSys
		InstSys, ok := item["inst_sys"].(string)
		if !ok || InstSys == "" {
			log.FuncErrorTrace(0, "Failed to get inst_sys for Record ID %v. Item: %+v\n", UniqueId, item)
			InstSys = ""
		}

		// Status
		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			log.FuncErrorTrace(0, "Failed to get status for Record ID %v. Item: %+v\n", UniqueId, item)
			Status = ""
		}

		// Status
		StatusDate, ok := item["status_date"].(string)
		if !ok || StatusDate == "" {
			log.FuncErrorTrace(0, "Failed to get status date for Record ID %v. Item: %+v\n", UniqueId, item)
			StatusDate = ""
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
			WC:            Wc,
			InstSys:       InstSys,
			Status:        Status,
			StatusDate:    StatusDate,
			ContractCalc:  ContractCalc,
			OweAr:         OweAr,
			TotalPaid:     TotalPaid,
			CurrentDue:    CurrentDue,
			Balance:       Balance,
		}
		arDataList.ArDataList = append(arDataList.ArDataList, arData)
	}
	// Send the response
	log.FuncInfoTrace(0, "Number of ar data List fetched : %v list %+v", len(arDataList.ArDataList), arDataList)
	FormAndSendHttpResp(resp, "Ar  Data", http.StatusOK, arDataList)

	fmt.Println(data)
}
