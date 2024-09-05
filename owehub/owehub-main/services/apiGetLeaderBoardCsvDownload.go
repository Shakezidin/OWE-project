/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"encoding/json"
	"io/ioutil"
	"strings"
	"time"

	"fmt"
	"net/http"
)

func HandleGetLeaderBoardCsvDownloadRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		dataReq               models.GetCsvDownload
		data                  []map[string]interface{}
		whereEleList          []interface{}
		queryWithFiler        string
		filter                string
		RecordCount           int64
		query                 string
		dealerIn              string
		dealerOwnerFetchQuery string
	)

	log.EnterFn(0, "HandleGetCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCsvDownloadRequest", err) }()

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

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Role != string(types.RoleAdmin) && dataReq.Role != string(types.RoleFinAdmin) && !(dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer") {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT vd.dealer_name AS dealer_name, name FROM user_details ud
			LEFT JOIN v_dealer vd ON ud.dealer_id = vd.id
			where ud.email_id = '%v';
		`, dataReq.Email)

		data, err = db.ReteriveFromDB(db.OweHubDbIndex, dealerOwnerFetchQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			FormAndSendHttpResp(resp, "Failed to fetch dealer name", http.StatusBadRequest, data)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			FormAndSendHttpResp(resp, "Failed to fetch dealer name %v", http.StatusBadRequest, data)
			return
		}

		dealerName, ok := data[0]["dealer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
			FormAndSendHttpResp(resp, "Failed to process dealer name", http.StatusBadRequest, nil)
			return
		}

		dataReq.DealerName = append(dataReq.DealerName, dealerName)
	}

	query = "SELECT unique_id,home_owner,customer_email,customer_phone_number,address,state,contract_total,system_size, contract_date,ntp_date, pv_install_completed_date, pto_date, canceled_date, primary_sales_rep, secondary_sales_rep FROM consolidated_data_view"

	if len(dataReq.DealerName) == 0 {
		errorResp := []string{}
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "csv Data", http.StatusOK, errorResp, RecordCount)
		return
	}
	dealerIn = "dealer IN("
	for i, data := range dataReq.DealerName {
		if i > 0 {
			dealerIn += ","
		}
		escapedDealerName := strings.ReplaceAll(data, "'", "''")
		dealerIn += fmt.Sprintf("'%s'", escapedDealerName)
	}
	dealerIn += ")"
	filter, whereEleList = PrepareLeaderCsvDateFilters(dataReq, dealerIn)

	if filter != "" {
		queryWithFiler = query + filter
	} else {
		log.FuncErrorTrace(0, "No user exist with mail: %v", dataReq.Email)
		FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, queryWithFiler, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	RecordCount = int64(len(data))
	// data = Paginate(data, int64(dataReq.PageNumber), int64(dataReq.PageSize))

	// log.FuncInfoTrace(0, "Number of data List fetched : %v list %+v", len(data), data)
	FormAndSendHttpResp(resp, "csv Data", http.StatusOK, data, RecordCount)
}

func PrepareLeaderCsvDateFilters(dataFilter models.GetCsvDownload, dealerIn string) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

	var filtersBuilder strings.Builder
	whereAdded := false
	if dataFilter.StartDate != "" && dataFilter.EndDate != "" {
		startDate, _ := time.Parse("02-01-2006", dataFilter.StartDate)
		endDate, _ := time.Parse("02-01-2006", dataFilter.EndDate)

		endDate = endDate.Add(24*time.Hour - time.Second)

		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)

		filtersBuilder.WriteString(" WHERE")
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS')", len(whereEleList)-1, len(whereEleList)))
		whereAdded = true
	}

	if len(dealerIn) > 13 {
		if whereAdded {
			filtersBuilder.WriteString(" AND ")
		} else {
			filtersBuilder.WriteString(" WHERE ")
			whereAdded = true
		}
		filtersBuilder.WriteString(dealerIn)
	}

	if whereAdded {
		filtersBuilder.WriteString(" AND ")
	} else {
		filtersBuilder.WriteString(" WHERE ")
		whereAdded = true
	}
	filtersBuilder.WriteString("project_status != 'DUPLICATE' ")

	filters = filtersBuilder.String()
	return filters, whereEleList
}
