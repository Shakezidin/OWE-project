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

const (
	LeaderBoardDataCount = 3
)

type ResultChan struct {
	Data interface{}
	Err  error
}

/******************************************************************************
 * FUNCTION:		HandleGetLeaderBoardDataRequest
 * DESCRIPTION:     handler for get LeaderBoard data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeaderBoardRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		dataReq          models.GetLeaderBoardRequest
		data             []map[string]interface{}
		RecordCount      int64
		dealerIn         string
		dlrName          string
		HighlightName    string
		HighLightDlrName string
		totalNtp         float64
		totalSale        float64
		totalInstall     float64
		totalCancel      float64
		totalBattery     float64
		ownerDealerName  string
		groupBy          string
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
		dataReq.Role == string(types.RoleProjectManager) ||
		(dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer") {

		if len(dataReq.DealerName) == 0 {
			LeaderBoardList.TopLeaderBoardList = []models.GetLeaderBoard{}
			LeaderBoardList.LeaderBoardList = []models.GetLeaderBoard{}

			log.FuncErrorTrace(0, "no dealer name selected")
			appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
			return
		}
	} else {
		var dealerName string
		dealerName, HighlightName, ownerDealerName, err = fetchDealerDetails(dataReq.Email, dataReq.Role, dataReq.GroupBy)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusBadRequest, nil)
			return
		}

		dataReq.DealerName = append(dataReq.DealerName, dealerName)
		if dataReq.Role == string(types.RoleSalesRep) || dataReq.Role == string(types.RoleApptSetter) {
			HighLightDlrName = dealerName
		}
	}

	dealerIn = GenerateDealerInClause(dataReq.DealerName)

	//temporory
	if dataReq.GroupBy == "team" {
		dataReq.GroupBy = "split_part(srs.team_region_untd, '/'::text, 1)"
	} else if dataReq.GroupBy == "region" {
		dataReq.GroupBy = "split_part(srs.team_region_untd, '/'::text, 2)"
	}

	if (len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0) && dataReq.GroupBy != "state" && dataReq.GroupBy != "split_part(srs.team_region_untd, '/'::text, 2)" {
		groupBy = fmt.Sprintf(" %v, cs.dealer as dealer, ", dataReq.GroupBy)
	} else {
		groupBy = dataReq.GroupBy
	}

	dateRange, _ := CreateDateRange(dataReq.StartDate, dataReq.EndDate)
	resultChan := make(chan ResultChan, LeaderBoardDataCount)
	hasError := false
	go fetchLeaderBoardData(models.LeaderBoardSaleCancelData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)
	go fetchLeaderBoardData(models.LeaderBoardInstallBatteryData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)
	go fetchLeaderBoardData(models.LeaderBoardNTPData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)

	var finalResult map[string]interface{} = make(map[string]interface{})

	for i := 0; i < LeaderBoardDataCount; i++ {
		result := <-resultChan
		if result.Err != nil {
			hasError = true
			fmt.Println("Error:", result.Err)
			continue
		}

		switch data := result.Data.(type) {
		case []map[string]interface{}:
			for _, record := range data {
				key := record["name"].(string)
				if _, exists := finalResult[key]; !exists {
					finalResult[key] = record
				} else {
					existing, ok := finalResult[key].(map[string]interface{})
					if !ok {
						existing = make(map[string]interface{})
					}

					for k, v := range record {
						if k != "name" && k != "dealer" {
							if val, ok := v.(int64); ok {
								if existingVal, exists := existing[k].(int64); exists {
									existing[k] = existingVal + val
								} else {
									existing[k] = val
								}
							}
						}
					}

					finalResult[key] = existing

				}
			}
		}
	}

	// Dealer Code Mapping
	if dataReq.GroupBy == "dealer" && dataReq.Role != string(types.RoleAdmin) {
		dealerNames := make([]string, 0, len(finalResult))
		for _, item := range finalResult {
			// Type assert item to a map
			if dealerMap, ok := item.(map[string]interface{}); ok {
				if dealer, ok := dealerMap["dealer"].(string); ok {
					dealerNames = append(dealerNames, dealer)
				}
			}
		}

		dealerCodes, err := GetDealerCodes(dealerNames)
		if err != nil {
			log.FuncErrorTrace(0, "Error retrieving dealer codes: %v", err)
			appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer codes", http.StatusBadRequest, nil)
			return
		}

		for key, item := range finalResult {
			// Type assertion to access map keys
			if record, ok := item.(map[string]interface{}); ok {
				if dealerName, ok := record["dealer"].(string); ok {
					if dataReq.Role == string(types.RoleDealerOwner) && ownerDealerName == dealerName {
						record["name"] = dealerName
					} else if dealerCode, ok := dealerCodes[dealerName]; ok {
						record["name"] = dealerCode
					}
				}
				// Update the finalResult with modified record
				finalResult[key] = record
			}
		}

	}

	if hasError {
		fmt.Println("Some errors occurred while fetching leaderboard data.")
	} else {
		fmt.Println("Final Result:", finalResult)
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
			Battery := toInt64(item["battery"])
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
			totalBattery += Battery
			LeaderBoard := models.GetLeaderBoard{
				Dealer:    dlrName,
				Name:      Name,
				Sale:      Sale,
				Ntp:       Ntp,
				Cancel:    Cancel,
				Install:   Install,
				Battery:   Battery,
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
		case "battery":
			return LeaderBoardList.LeaderBoardList[i].Battery > LeaderBoardList.LeaderBoardList[j].Battery
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
	LeaderBoardList.TotalBattery = totalBattery

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

func fetchDealerDetails(email string, role string, groupBy string) (dealerName, highlightName, ownerDealerName string, err error) {
	query := fmt.Sprintf(`
        SELECT sp.sales_partner_name AS dealer_name, name 
        FROM user_details ud
        LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
        WHERE ud.email_id = '%v';
    `, email)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
		return "", "", "", fmt.Errorf("failed to fetch dealer name")
	}

	if len(data) == 0 {
		log.FuncErrorTrace(0, "No dealer name found for %v", email)
		return "", "", "", fmt.Errorf("dealer name not found")
	}

	dealerName, ok := data[0]["dealer_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
		return "", "", "", fmt.Errorf("failed to process dealer name")
	}

	if role == string(types.RoleSalesRep) || role == string(types.RoleApptSetter) {
		highlightName, ok = data[0]["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert name to string for data: %v", data[0])
			return "", "", "", fmt.Errorf("failed to process sales rep name")
		}
	}

	if role == string(types.RoleDealerOwner) && groupBy == "dealer" {
		ownerDealerName = dealerName
	}

	return dealerName, highlightName, ownerDealerName, nil
}

// GenerateDealerInClause constructs the SQL IN clause for dealer names.
func GenerateDealerInClause(dealerNames []string) string {
	if len(dealerNames) == 0 {
		return "dealer IN ('')" // Handles empty dealer names safely
	}

	var builder strings.Builder
	builder.WriteString("dealer IN (")

	for i, name := range dealerNames {
		if i > 0 {
			builder.WriteString(",")
		}
		escapedName := strings.ReplaceAll(name, "'", "''") // Escape single quotes
		builder.WriteString(fmt.Sprintf("'%s'", escapedName))
	}

	builder.WriteString(")")
	return builder.String()
}

func fetchLeaderBoardData(queryFunc func(dateRange, dealers, groupBy, chosen string) string, dateRange, dealers, groupBy, chosen string, resultChan chan<- ResultChan) {
	query := queryFunc(dateRange, dealers, groupBy, chosen)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	resultChan <- ResultChan{Data: data, Err: err}
}

// CreateDateRange generates a SQL-compatible date range condition
func CreateDateRange(startDate, endDate string) (string, error) {
	layout := "02-01-2006 15:04:05" // Date format: DD-MM-YYYY HH:MM:SS

	// Parse start date
	start, err := time.Parse(layout, startDate+" 00:00:00")
	if err != nil {
		return "", fmt.Errorf("invalid start date: %v", err)
	}

	// Parse end date
	end, err := time.Parse(layout, endDate+" 23:59:59")
	if err != nil {
		return "", fmt.Errorf("invalid end date: %v", err)
	}

	// Format date range for SQL
	dateRange := fmt.Sprintf(
		"BETWEEN TO_TIMESTAMP('%s', 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP('%s', 'DD-MM-YYYY HH24:MI:SS')",
		start.Format("02-01-2006 15:04:05"),
		end.Format("02-01-2006 15:04:05"),
	)

	return dateRange, nil
}

// 1️⃣ Function to integrate dealer codes
func GetDealerCodes(dealerNames []string) (map[string]string, error) {
	if len(dealerNames) == 0 {
		return nil, nil
	}

	placeholders := make([]string, len(dealerNames))
	args := make([]interface{}, len(dealerNames))
	for i, dealerName := range dealerNames {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args[i] = dealerName
	}

	dealerQuery := fmt.Sprintf(`
		SELECT sp.sales_partner_name AS dealer_name, pd.dealer_code 
		FROM sales_partner_dbhub_schema sp
		LEFT JOIN partner_details pd ON sp.partner_id = pd.partner_id
		WHERE sp.sales_partner_name IN (%s)
	`, strings.Join(placeholders, ","))

	dealerData, err := db.ReteriveFromDB(db.OweHubDbIndex, dealerQuery, args)
	if err != nil {
		return nil, fmt.Errorf("failed to get dealer codes from DB: %w", err)
	}

	dealerCodes := make(map[string]string)
	for _, item := range dealerData {
		if dealerName, ok := item["dealer_name"].(string); ok {
			if dealerCode, ok := item["dealer_code"].(string); ok {
				dealerCodes[dealerName] = dealerCode
			}
		}
	}
	return dealerCodes, nil
}

type LeaderBoardData struct {
	Name    string
	Dealer  string
	Sale    int
	Cancel  int
	NTP     int
	Install int
	Battery int
}

func AggregateLeaderBoardData(results []ChanResult) map[string]*LeaderBoardData {
	leaderBoardMap := make(map[string]*LeaderBoardData)

	for _, result := range results {
		if result.Err != nil {
			fmt.Println("Error:", result.Err)
			continue
		}

		for _, row := range result.Data {
			name := row["name"].(string)
			dealer := row["dealer"].(string)
			key := name + "_" + dealer

			if _, exists := leaderBoardMap[key]; !exists {
				leaderBoardMap[key] = &LeaderBoardData{
					Name:   name,
					Dealer: dealer,
				}
			}

			// Aggregate data based on available fields
			if sale, ok := row["sale"].(int); ok {
				leaderBoardMap[key].Sale += sale
			}
			if cancel, ok := row["cancel"].(int); ok {
				leaderBoardMap[key].Cancel += cancel
			}
			if ntp, ok := row["ntp"].(int); ok {
				leaderBoardMap[key].NTP += ntp
			}
			if install, ok := row["install"].(int); ok {
				leaderBoardMap[key].Install += install
			}
			if battery, ok := row["battery"].(int); ok {
				leaderBoardMap[key].Battery += battery
			}
		}
	}

	return leaderBoardMap
}
