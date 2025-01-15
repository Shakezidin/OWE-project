/**************************************************************************
 * File       	   : apiGetLeaderBoardData.go
 * DESCRIPTION     : This file contains functions for get LeaderBoard data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"sort"
	"strings"
	"time"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		HandleGetLeaderBoardDataRequest
* DESCRIPTION:     handler for get LeaderBoard data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func HandleGetLeaderBoardRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                   error
		dataReq               models.GetLeaderBoardRequest
		dealerOwnerFetchQuery string
		leaderBoardQuery      string
		data                  []map[string]interface{}
		whereEleList          []interface{}
		filter                string
		RecordCount           int64
		adminCheck            bool
		dealerIn              string
		dlrName               string
		HighlightName         string
		HighLightDlrName      string
		dealerCodes           map[string]string
		totalNtp              float64
		totalSale             float64
		totalInstall          float64
		totalCancel           float64
		ownerdealerName       string
	)

	log.EnterFn(0, "HandleGetLeaderBoardDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLeaderBoardDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get LeaderBoard data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get LeaderBoard data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get LeaderBoard data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get LeaderBoard data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	LeaderBoardList := models.GetLeaderBoardList{}

	if dataReq.Role == string(types.RoleAdmin) || dataReq.Role == string(types.RoleFinAdmin) ||
		dataReq.Role == string(types.RoleAccountExecutive) || dataReq.Role == string(types.RoleAccountManager) ||
		(dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer") {
		if len(dataReq.DealerName) == 0 {
			LeaderBoardList.TopLeaderBoardList = []models.GetLeaderBoard{}
			LeaderBoardList.LeaderBoardList = []models.GetLeaderBoard{}

			log.FuncErrorTrace(0, "no dealer name selected")
			appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
			return
		}
	}

	if dataReq.Role != string(types.RoleAdmin) && dataReq.Role != string(types.RoleFinAdmin) &&
		dataReq.Role != string(types.RoleAccountExecutive) && dataReq.Role != string(types.RoleAccountManager) &&
		!(dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer") {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT sp.sales_partner_name AS dealer_name, name FROM user_details ud
			LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
			where ud.email_id = '%v';
		`, dataReq.Email)

		data, err = db.ReteriveFromDB(db.OweHubDbIndex, dealerOwnerFetchQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name", http.StatusBadRequest, data)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name %v", http.StatusBadRequest, data)
			return
		}

		dealerName, ok := data[0]["dealer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
			appserver.FormAndSendHttpResp(resp, "Failed to process dealer name", http.StatusBadRequest, nil)
			return
		}

		dataReq.DealerName = append(dataReq.DealerName, dealerName)
		if dataReq.Role == string(types.RoleSalesRep) || dataReq.Role == string(types.RoleApptSetter) {
			HighlightName, ok = data[0]["name"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to convert name to string for data: %v", data[0])
				appserver.FormAndSendHttpResp(resp, "Failed to process sales rep name", http.StatusBadRequest, nil)
				return
			}
			HighLightDlrName = dealerName
		}
	}

	if dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer" {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT sp.sales_partner_name AS dealer_name, name FROM user_details ud
			LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
			where ud.email_id = '%v';
		`, dataReq.Email)

		data, err = db.ReteriveFromDB(db.OweHubDbIndex, dealerOwnerFetchQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name", http.StatusBadRequest, data)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer name %v", http.StatusBadRequest, data)
			return
		}

		dealerName1, ok := data[0]["dealer_name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
			appserver.FormAndSendHttpResp(resp, "Failed to process dealer name", http.StatusBadRequest, nil)
			return
		}

		ownerdealerName = dealerName1
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

	//temporory
	if dataReq.GroupBy == "team" {
		dataReq.GroupBy = "split_part(ss.team_region_untd, '/'::text, 1)"
	} else if dataReq.GroupBy == "region" {
		dataReq.GroupBy = "split_part(ss.team_region_untd, '/'::text, 2)"
	} else {
		dataReq.GroupBy = fmt.Sprintf("cs.%v", dataReq.GroupBy)
	}

	if (len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0) && dataReq.GroupBy != "cs.state" && dataReq.GroupBy != "split_part(ss.team_region_untd, '/'::text, 2)" {
		leaderBoardQuery = fmt.Sprintf(" SELECT %v as name, cs.dealer as dealer, ", dataReq.GroupBy)
	} else {
		leaderBoardQuery = fmt.Sprintf(" SELECT %v as name, ", dataReq.GroupBy)
	}

	filter, whereEleList = PrepareLeaderDateFilters(dataReq, adminCheck, dealerIn)
	leaderBoardQuery = leaderBoardQuery + filter

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, leaderBoardQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	if dataReq.GroupBy == "dealer" && dataReq.Role != string(types.RoleAdmin) {
		// Step 1: Extract unique dealer names and prepare query placeholders
		dealerNames := make([]string, 0, len(data))
		for _, item := range data {
			if dealer, ok := item["dealer"].(string); ok {
				dealerNames = append(dealerNames, dealer)
			}
		}

		if len(dealerNames) > 0 {
			placeholders := make([]string, len(dealerNames))
			for i := range placeholders {
				placeholders[i] = fmt.Sprintf("$%d", i+1)
			}

			dealerQuery := fmt.Sprintf(
				"SELECT sp.sales_partner_name as dealer_name, pd.dealer_code FROM sales_partner_dbhub_schema sp"+
					" LEFT JOIN partner_details pd ON sp.partner_id = pd.partner_id "+
					"WHERE sp.sales_partner_name IN (%s)",
				strings.Join(placeholders, ","),
			)

			args := make([]interface{}, len(dealerNames))
			for i, dealerName := range dealerNames {
				args[i] = dealerName
			}

			// Execute the dealer query and retrieve data
			dealerData, err := db.ReteriveFromDB(db.OweHubDbIndex, dealerQuery, args)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to get dealer codes from DB err: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer codes", http.StatusBadRequest, nil)
				return
			}

			// Step 2: Create a map of dealer names to dealer codes
			dealerCodes = make(map[string]string, len(dealerData))
			for _, item := range dealerData {
				if dealerName, ok := item["dealer_name"].(string); ok {
					if dealerCode, ok := item["dealer_code"].(string); ok {
						dealerCodes[dealerName] = dealerCode
					}
				}
			}

			for i := range data {
				if dealerName, ok := data[i]["dealer"].(string); ok {
					if dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer" && ownerdealerName == dealerName {
						data[i]["name"] = dealerName
					} else if dealerCode, ok := dealerCodes[dealerName]; ok {
						data[i]["name"] = dealerCode
					}
				}
			}
		}
	}

	if len(data) > 0 {
		for _, item := range data {
			var hightlight bool
			Name, _ := item["name"].(string)

			// Helper function to convert interface{} to int64
			toInt64 := func(v interface{}) float64 {
				switch value := v.(type) {
				case float64:
					return value
				case int64:
					return float64(value)
				default:
					return 0
				}
			}

			Sale := toInt64(item["sale"])
			Ntp := toInt64(item["ntp"])
			Cancel := toInt64(item["cancel"])
			Install := toInt64(item["install"])
			if len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0 {
				dlrName, _ = item["dealer"].(string)
			} else {
				dlrName = dataReq.DealerName[0]
			}

			if HighLightDlrName == dlrName && HighlightName == Name && (dataReq.Role == string(types.RoleSalesRep) || dataReq.Role == string(types.RoleApptSetter)) {
				hightlight = true
			}
			totalSale += Sale
			totalNtp += Ntp
			totalInstall += Install
			totalCancel += Cancel
			LeaderBoard := models.GetLeaderBoard{
				Dealer:    dlrName,
				Name:      Name,
				Sale:      Sale,
				Ntp:       Ntp,
				Cancel:    Cancel,
				Install:   Install,
				HighLight: hightlight,
			}

			LeaderBoardList.LeaderBoardList = append(LeaderBoardList.LeaderBoardList, LeaderBoard)
		}
	}

	sort.Slice(LeaderBoardList.LeaderBoardList, func(i, j int) bool {
		switch dataReq.SortBy {
		case "ntp":
			return LeaderBoardList.LeaderBoardList[i].Ntp > LeaderBoardList.LeaderBoardList[j].Ntp
		case "cancel":
			return LeaderBoardList.LeaderBoardList[i].Cancel > LeaderBoardList.LeaderBoardList[j].Cancel
		case "install":
			return LeaderBoardList.LeaderBoardList[i].Install > LeaderBoardList.LeaderBoardList[j].Install
		default:
			return LeaderBoardList.LeaderBoardList[i].Sale > LeaderBoardList.LeaderBoardList[j].Sale
		}
	})

	var currSaleRep models.GetLeaderBoard
	var add bool
	for i, val := range LeaderBoardList.LeaderBoardList {
		if val.HighLight { // check name equeals
			currSaleRep = val
			currSaleRep.Rank = i + 1
			add = true
		}
		LeaderBoardList.LeaderBoardList[i].Rank = i + 1
	}

	LeaderBoardList.TopLeaderBoardList = Paginate(LeaderBoardList.LeaderBoardList, 1, 3)

	LeaderBoardList.LeaderBoardList = Paginate(LeaderBoardList.LeaderBoardList, dataReq.PageNumber, dataReq.PageSize)

	if (dataReq.Role == string(types.RoleSalesRep) || dataReq.Role == string(types.RoleApptSetter)) && (dataReq.GroupBy == "primary_sales_rep" || dataReq.GroupBy == "secondary_sales_rep") && add {
		LeaderBoardList.LeaderBoardList = append(LeaderBoardList.LeaderBoardList, currSaleRep)
	}
	LeaderBoardList.TotalCancel = totalCancel
	LeaderBoardList.TotalInstall = totalInstall
	LeaderBoardList.TotalNtp = totalNtp
	LeaderBoardList.TotalSale = totalSale

	RecordCount = int64(len(data))
	// log.FuncInfoTrace(0, "Number of LeaderBoard List fetched : %v list %+v", len(LeaderBoardList.LeaderBoardList), LeaderBoardList)
	appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
}

/******************************************************************************
* FUNCTION:		PrepareLeaderDateFilters
* DESCRIPTION:     handler for prepare primary filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/
func Paginate[T any](data []T, pageNumber int64, pageSize int64) []T {
	start := (pageNumber - 1) * pageSize
	if start >= int64(len(data)) {
		return []T{}
	}

	end := start + pageSize
	if end > int64(len(data)) {
		end = int64(len(data))
	}

	return data[start:end]
}

/******************************************************************************
* FUNCTION:		PrepareLeaderDateFilters
* DESCRIPTION:     handler for prepare primary filter
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func PrepareLeaderDateFilters(dataReq models.GetLeaderBoardRequest, adminCheck bool, dealerIn string) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareLeaderDateFilters")
	defer func() { log.ExitFn(0, "PrepareLeaderDateFilters", nil) }()

	var filtersBuilder strings.Builder
	var whereAdded bool

	startDate, err := time.Parse("02-01-2006", dataReq.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting startdate")
	}
	endDate, err := time.Parse("02-01-2006", dataReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "error while formatting enddate")
	}

	endDate = endDate.Add(24*time.Hour - time.Second)

	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		whereEleList = append(whereEleList,
			startDate.Format("02-01-2006 00:00:00"),
			endDate.Format("02-01-2006 15:04:05"),
		)
	}
	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		switch dataReq.Type {
		case "count":
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND cs.%v AND cs.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN cs.unique_id ELSE NULL END) AS sale, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND ns.%v AND ns.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN cs.unique_id ELSE NULL END) AS ntp, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN cs.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND cs.%v AND cs.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN cs.unique_id ELSE NULL END) AS cancel, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND pis.%v AND pis.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN cs.unique_id ELSE NULL END) AS install", len(whereEleList)-1, len(whereEleList), dealerIn))
		case "kw":
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND cs.%v AND cs.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN scs.contracted_system_size_parent ELSE 0 END) AS sale, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND ns.%v AND ns.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN scs.contracted_system_size_parent ELSE 0 END) AS ntp, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN cs.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND cs.%v AND cs.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN scs.contracted_system_size_parent ELSE 0 END) AS cancel, ", len(whereEleList)-1, len(whereEleList), dealerIn))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND pis.%v AND pis.project_status != 'DUPLICATE' AND LOWER(ns.app_status) NOT ILIKE LOWER('%%DUPLICATE%%') THEN scs.contracted_system_size_parent ELSE 0 END) AS install", len(whereEleList)-1, len(whereEleList), dealerIn))
		}
	} else {
		switch dataReq.Type {
		case "count":
			// Total count without date filters
			filtersBuilder.WriteString(" COUNT(cs.sale_date) AS sale, ")
			filtersBuilder.WriteString(" COUNT(ns.ntp_complete_date) AS ntp, ")
			filtersBuilder.WriteString(" COUNT(cs.cancel_date) AS cancel, ")
			filtersBuilder.WriteString(" COUNT(pis.pv_completion_date) AS install")
		case "kw":
			// Total sum without date filters
			filtersBuilder.WriteString(" SUM(scs.contracted_system_size_parent) AS sale, ")
			filtersBuilder.WriteString(" SUM(scs.contracted_system_size_parent) AS ntp, ")
			filtersBuilder.WriteString(" SUM(scs.contracted_system_size_parent) AS cancel, ")
			filtersBuilder.WriteString(" SUM(scs.contracted_system_size_parent) AS install")
		}
	}

	filtersBuilder.WriteString(` FROM customers_customers_schema cs 
								LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id 
								LEFT JOIN pv_install_install_subcontracting_schema pis ON pis.customer_unique_id = cs.unique_id 
								LEFT JOIN sales_metrics_schema ss ON ss.unique_id = cs.unique_id 
								LEFT JOIN system_customers_schema scs ON scs.customer_id = cs.unique_id`)
	// if len(dealerIn) > 16 {
	// 	filtersBuilder.WriteString(" WHERE ")
	// 	filtersBuilder.WriteString(dealerIn)
	// 	whereAdded = true
	// }

	if !whereAdded {
		filtersBuilder.WriteString(" WHERE ")
		filtersBuilder.WriteString(" cs.unique_id != '' ")
		whereAdded = true
	} else {
		filtersBuilder.WriteString(" AND ")
		filtersBuilder.WriteString(" cs.unique_id != '' ")
	}

	if !whereAdded {
		filtersBuilder.WriteString(" WHERE (")
		filtersBuilder.WriteString(fmt.Sprintf(" cs.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR ns.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR cs.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR pis.%v)", dealerIn))
		whereAdded = true
	} else {
		filtersBuilder.WriteString(" AND (")
		filtersBuilder.WriteString(fmt.Sprintf(" cs.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR ns.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR cs.%v", dealerIn))
		filtersBuilder.WriteString(fmt.Sprintf(" OR pis.%v)", dealerIn))
	}

	if (len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0) && dataReq.GroupBy != "cs.state" && dataReq.GroupBy != "split_part(ss.team_region_untd, '/'::text, 2)" {
		if dataReq.GroupBy != "dealer" {
			filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v, cs.dealer HAVING", dataReq.GroupBy))
		} else {
			filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v HAVING", dataReq.GroupBy))
		}
	} else {
		filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v HAVING", dataReq.GroupBy))
	}

	if dataReq.StartDate != "" && dataReq.EndDate != "" {
		switch dataReq.Type {
		case "count":
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN cs.unique_id ELSE NULL END) > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN cs.unique_id ELSE NULL END) > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN cs.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN cs.unique_id ELSE NULL END) > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" COUNT(DISTINCT CASE WHEN pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN cs.unique_id ELSE NULL END)  > 0", len(whereEleList)-1, len(whereEleList)))
		case "kw":
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN cs.sale_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN scs.contracted_system_size_parent ELSE 0 END)  > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN ns.ntp_complete_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN scs.contracted_system_size_parent ELSE 0 END) > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN cs.cancel_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN scs.contracted_system_size_parent ELSE 0 END) > 0 OR ", len(whereEleList)-1, len(whereEleList)))
			filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN pis.pv_completion_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN scs.contracted_system_size_parent ELSE 0 END) > 0", len(whereEleList)-1, len(whereEleList)))
		}
	} else {
		switch dataReq.Type {
		case "count":
			// Total count without date filters
			filtersBuilder.WriteString(" COUNT(cs.sale_date) > 0 OR ")
			filtersBuilder.WriteString(" COUNT(ns.ntp_complete_date) > 0 OR ")
			filtersBuilder.WriteString(" COUNT(cs.cancel_date) > 0 OR ")
			filtersBuilder.WriteString(" COUNT(pis.pv_completion_date) > 0")
		case "kw":
			// Total sum without date filters
			filtersBuilder.WriteString(" SUM(scs.contracted_system_size_parent) > 0")
		}
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}
