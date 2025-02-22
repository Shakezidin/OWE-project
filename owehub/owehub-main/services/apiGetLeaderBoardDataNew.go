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
	Data []map[string]interface{}
	Type string // Add a Type field to identify the data
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
		RecordCount      int64
		dealerIn         string
		HighlightName    string
		HighLightDlrName string
		totalNtp         float64
		totalSale        float64
		totalInstall     float64
		totalCancel      float64
		totalBattery     float64
		dealerCodes      map[string]string
		combinedResults  []models.CombinedResult
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
			LeaderBoardList.TopLeaderBoardList = []models.CombinedResult{}
			LeaderBoardList.LeaderBoardList = []models.CombinedResult{}

			log.FuncErrorTrace(0, "no dealer name selected")
			appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
			return
		}
		if dataReq.Role == string(types.RoleDealerOwner) && dataReq.GroupBy == "dealer" {
			HighLightDlrName, _, err = fetchDealerDetails(dataReq.Email, dataReq.Role)
			if err != nil {
				log.FuncErrorTrace(0, "Error fetching dealer details: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer details", http.StatusBadRequest, nil)
				return
			}

			dealerCodes, err = GetDealerCodes(dataReq.DealerName)
			if err != nil {
				log.FuncErrorTrace(0, "Error retrieving dealer codes: %v", err)
				appserver.FormAndSendHttpResp(resp, "Failed to fetch dealer codes", http.StatusBadRequest, nil)
				return
			}
		}
	} else {
		var dealerName string
		dealerName, HighlightName, err = fetchDealerDetails(dataReq.Email, dataReq.Role)
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

	groupBy := dataReq.GroupBy
	if shouldIncludeDealerInGroupBy(dataReq.GroupBy) {
		groupBy = fmt.Sprintf("%s,dealer", dataReq.GroupBy)
	}

	dateRange, _ := CreateDateRange(dataReq.StartDate, dataReq.EndDate)
	resultChan := make(chan ResultChan, LeaderBoardDataCount)
	hasError := false
	go fetchLeaderBoardData(models.LeaderBoardSaleCancelData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)
	go fetchLeaderBoardData(models.LeaderBoardInstallBatteryData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)
	go fetchLeaderBoardData(models.LeaderBoardNTPData, dateRange, dealerIn, groupBy, dataReq.Type, resultChan)

	// Collect results from goroutines
	var saleCancelData, installBatteryData, ntpData []map[string]interface{}
	for i := 0; i < 3; i++ {
		result := <-resultChan
		if result.Err != nil {
			hasError = true
			fmt.Println("Error:", result.Err)
			continue
		}

		switch result.Type {
		case "sale":
			saleCancelData = result.Data
		case "install":
			installBatteryData = result.Data
		case "ntp":
			ntpData = result.Data
		}
	}

	if hasError {
		fmt.Println("One or more errors occurred while fetching data.")
		return
	}
	// Combine the results
	combinedResults, totalSale, totalNtp, totalCancel, totalBattery, totalInstall = combineResults(saleCancelData, installBatteryData, ntpData, dataReq.Role, HighLightDlrName, HighlightName, dataReq.GroupBy, dealerCodes)

	sort.Slice(combinedResults, func(i, j int) bool {
		switch dataReq.SortBy {
		case "ntp":
			return combinedResults[i].Ntp > combinedResults[j].Ntp
		case "cancel":
			return combinedResults[i].Cancel > combinedResults[j].Cancel
		case "install":
			return combinedResults[i].Install > combinedResults[j].Install
		case "battery":
			return combinedResults[i].Battery > combinedResults[j].Battery
		default:
			return combinedResults[i].Sale > combinedResults[j].Sale
		}
	})

	var currSaleRep models.CombinedResult
	var add bool
	filteredResults := make([]models.CombinedResult, 0, len(combinedResults)) // Create a new slice

	if len(combinedResults) > 0 {
		for i, val := range combinedResults {
			if val.HighLight {
				currSaleRep = val
				currSaleRep.Rank = i + 1
				add = true
				continue // Skip adding this entry to filteredResults
			}
			val.Rank = i + 1
			filteredResults = append(filteredResults, val)
		}

		LeaderBoardList.TopLeaderBoardList = Paginate(filteredResults, 1, 3)
		LeaderBoardList.LeaderBoardList = Paginate(filteredResults, dataReq.PageNumber, dataReq.PageSize)
	} else {
		LeaderBoardList.TopLeaderBoardList = []models.CombinedResult{}
		LeaderBoardList.LeaderBoardList = []models.CombinedResult{}
		appserver.FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
		return
	}

	if add {
		LeaderBoardList.LeaderBoardList = append(LeaderBoardList.LeaderBoardList, currSaleRep)
	}
	LeaderBoardList.TotalCancel = totalCancel
	LeaderBoardList.TotalInstall = totalInstall
	LeaderBoardList.TotalNtp = totalNtp
	LeaderBoardList.TotalNtp = 0
	LeaderBoardList.TotalSale = totalSale
	LeaderBoardList.TotalBattery = totalBattery

	RecordCount = int64(len(combinedResults))
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

func fetchDealerDetails(email string, role string) (dealerName, highlightName string, err error) {
	query := fmt.Sprintf(`
		 SELECT sp.sales_partner_name AS dealer_name, name 
		 FROM user_details ud
		 LEFT JOIN sales_partner_dbhub_schema sp ON ud.partner_id = sp.partner_id
		 WHERE ud.email_id = '%v';
	 `, email)

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer name from DB for %v err: %v", data, err)
		return "", "", fmt.Errorf("failed to fetch dealer name")
	}

	if len(data) == 0 {
		log.FuncErrorTrace(0, "No dealer name found for %v", email)
		return "", "", fmt.Errorf("dealer name not found")
	}

	dealerName, ok := data[0]["dealer_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to convert dealer_name to string for data: %v", data[0])
		return "", "", fmt.Errorf("failed to process dealer name")
	}

	if role == string(types.RoleSalesRep) || role == string(types.RoleApptSetter) {
		highlightName, ok = data[0]["name"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to convert name to string for data: %v", data[0])
			return "", "", fmt.Errorf("failed to process sales rep name")
		}
	}

	return dealerName, highlightName, nil
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

func fetchLeaderBoardData(queryFunc func(dateRange, dealers, groupBy, chosen string) (string, string), dateRange, dealers, groupBy, chosen string, resultChan chan<- ResultChan) {
	query, types := queryFunc(dateRange, dealers, groupBy, chosen)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	resultChan <- ResultChan{Data: data, Err: err, Type: types}
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
		 SELECT sp.sales_partner_name AS dealer_name, pd.partner_code 
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
			if dealerCode, ok := item["partner_code"].(string); ok {
				dealerCodes[dealerName] = dealerCode
			}
		}
	}
	return dealerCodes, nil
}

func shouldIncludeDealerInGroupBy(groupBy string) bool {
	return groupBy == "primary_sales_rep" || groupBy == "team" || groupBy == "setter"
}

func combineResults(saleCancelData, installBatteryData, ntpData []map[string]interface{}, role, HighLightDlrName, HighlightName, groupBy string, dealerCoded map[string]string) (combinedResults []models.CombinedResult, totalSale, totalNtp, totalCancel, totalBattery, totalInstall float64) {
	combinedMap := make(map[string]models.CombinedResult)
	var saleemptyKey, ntpemptyKey, InstallEmptykey bool

	// Helper functions remain the same
	getString := func(m map[string]interface{}, key string) string {
		if val, ok := m[key].(string); ok {
			return val
		}
		return ""
	}

	buildKey := func(row map[string]interface{}) string {
		name, nameOk := row["name"].(string)
		dealer, dealerOk := row["dealer"].(string)

		if nameOk && dealerOk {
			key := name + "_" + dealer
			return key
		} else if nameOk {
			return name
		} else if dealerOk {
			return dealer
		}
		return ""
	}

	getNumber := func(m map[string]interface{}, key string) float64 {
		val, ok := m[key]
		if !ok {
			return 0
		}
		switch v := val.(type) {
		case float64:
			return v
		case int64:
			return float64(v)
		case int:
			return float64(v)
		default:
			return 0
		}
	}

	// Process sale and cancel data first
	for _, row := range saleCancelData {
		key := buildKey(row)
		if key == "" {
			if !saleemptyKey {
				saleemptyKey = true
			} else {
				continue
			}
		}

		sale := getNumber(row, "sale")
		cancel := getNumber(row, "cancel")

		result := models.CombinedResult{
			Name:   getString(row, "name"),
			Dealer: getString(row, "dealer"),
			Sale:   sale,
			Cancel: cancel,
		}
		combinedMap[key] = result

		totalSale += sale
		totalCancel += cancel
	}

	// Process install and battery data
	for _, row := range installBatteryData {
		key := buildKey(row)
		if key == "" {
			if !InstallEmptykey {
				InstallEmptykey = true
			} else {
				continue
			}
		}

		result := combinedMap[key] // Get existing or zero value
		install := getNumber(row, "install")
		battery := getNumber(row, "battery")

		result.Name = getString(row, "name") // Ensure name is set even if it's a new entry
		result.Dealer = getString(row, "dealer")
		result.Install = install
		result.Battery = battery

		combinedMap[key] = result // Store back in map

		totalInstall += install
		totalBattery += battery
	}

	// Process NTP data
	for _, row := range ntpData {
		key := buildKey(row)
		if key == "" {
			if !ntpemptyKey {
				ntpemptyKey = true
			} else {
				continue
			}
		}

		result := combinedMap[key] // Get existing or zero value
		ntp := getNumber(row, "ntp")

		result.Name = getString(row, "name") // Ensure name is set even if it's a new entry
		result.Dealer = getString(row, "dealer")
		result.Ntp = ntp

		combinedMap[key] = result // Store back in map

		totalNtp += ntp
	}

	partnerIndex := 1 // Initialize partner counter
	// Convert map to slice and handle highlighting
	for _, result := range combinedMap {

		if role == string(types.RoleDealerOwner) && groupBy == "dealer" {
			if result.Name != HighLightDlrName {
				if value, exists := dealerCoded[result.Name]; exists && value != "" {
					result.Name = value
				} else {
					result.Name = fmt.Sprintf("partner_%d", partnerIndex)
					partnerIndex++ // Increment for the next missing dealer
				}
			}
		}

		if HighLightDlrName == result.Dealer &&
			HighlightName == result.Name &&
			(role == string(types.RoleSalesRep) || role == string(types.RoleApptSetter)) &&
			groupBy == "primary_sales_rep" {
			result.HighLight = true
		}

		if result.Battery == 0 && result.Cancel == 0 && result.Install == 0 && result.Ntp == 0 && result.Sale == 0 {
			continue
		}

		combinedResults = append(combinedResults, result)
	}

	return combinedResults, totalSale, totalNtp, totalCancel, totalBattery, totalInstall
}
