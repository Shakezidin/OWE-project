/**************************************************************************
 * File       	   : apiGetPerfomanceProjectStatus.go
 * DESCRIPTION     : This file contains functions for get InstallCost data handler
 * DATE            : 07-May-2024
 **************************************************************************/

package services

import (
	appserver "OWEApp/shared/appserver"
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
		RecordCount           int64
		query                 string
		dealerOwnerFetchQuery string
	)

	log.EnterFn(0, "HandleGetCsvDownloadRequest")
	defer func() { log.ExitFn(0, "HandleGetCsvDownloadRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get PerfomanceProjectStatus data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get PerfomanceProjectStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get PerfomanceProjectStatus data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get PerfomanceProjectStatus data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		appserver.FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
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
	}

	if dataReq.Role == string(types.RoleAccountManager) || dataReq.Role == string(types.RoleAccountExecutive) {
		dealerNames, err := FetchLeaderBoardDealerForAmAe(dataReq, dataReq.Role)
		if err != nil {
			appserver.FormAndSendHttpResp(resp, fmt.Sprintf("%s", err), http.StatusBadRequest, nil)
			return
		}

		if len(dealerNames) == 0 {
			appserver.FormAndSendHttpResp(resp, "No dealer list present for this user", http.StatusOK, []string{}, RecordCount)
			return
		}
		dataReq.DealerName = dealerNames
	}

	// Dynamic dealer names and date range from frontend request
	dealerIn := []string{}
	for _, data := range dataReq.DealerName {
		escapedDealerName := strings.ReplaceAll(data, "'", "''") // Escape single quotes
		dealerIn = append(dealerIn, escapedDealerName)
	}

	// Format the start and end dates
	startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)
	endDate = endDate.Add(24*time.Hour - time.Second) // Ensure the end date includes the entire day

	// Prepare the parameters for the query
	whereEleList := []interface{}{
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	}

	// Construct the dealer names string for the IN clause
	dealerInQuery := "'" + strings.Join(dealerIn, "','") + "'"

	// Prepare the final query string with the dynamically constructed dealer list
	query = `
	SELECT 
    unique_id AS cancel_unique_id,
    cancel_date,
	NULL::text AS customers_unique_id,
    NULL::timestamp AS sale_date,
    NULL::timestamp AS ntp_complete_date,  -- Cast to text
    NULL::text AS ntp_unique_id,
    NULL::timestamp AS pv_completion_date,  -- Cast to text
    NULL::text AS pv_unique_id
FROM 
    customers_customers_schema
WHERE 
    dealer IN (` + dealerInQuery + `)  -- Use ANY to match any dealer in the array
    AND project_status != 'DUPLICATE'
    AND cancel_date BETWEEN TO_TIMESTAMP($1, 'DD-MM-YYYY HH24:MI:SS') 
                        AND TO_TIMESTAMP($2, 'DD-MM-YYYY HH24:MI:SS')

UNION ALL

SELECT 
	NULL::text AS cancel_unique_id,
	NULL::timestamp AS cancel_date,
    unique_id AS customers_unique_id,
    sale_date,
    NULL::timestamp AS ntp_complete_date,  
    NULL::text AS ntp_unique_id,
    NULL::timestamp AS pv_completion_date,  
    NULL::text AS pv_unique_id
FROM 
    customers_customers_schema
WHERE 
    dealer IN (` + dealerInQuery + `)  -- Use ANY to match any dealer in the array
    AND project_status != 'DUPLICATE'
    AND sale_date BETWEEN TO_TIMESTAMP($1, 'DD-MM-YYYY HH24:MI:SS') 
                        AND TO_TIMESTAMP($2, 'DD-MM-YYYY HH24:MI:SS')

UNION ALL

SELECT 
	NULL::text AS cancel_unique_id,
	NULL::timestamp AS cancel_date,
    NULL::text AS customers_unique_id,
    NULL::timestamp AS sale_date,
    ntp_complete_date AS ntp_complete_date,  
    unique_id::text AS ntp_unique_id, 
    NULL::timestamp AS pv_completion_date,
    NULL::text AS pv_unique_id
FROM 
    ntp_ntp_schema
WHERE 
    dealer IN (` + dealerInQuery + `)  -- Use ANY to match any dealer in the array
    AND project_status != 'DUPLICATE'
    AND ntp_complete_date BETWEEN TO_TIMESTAMP($1, 'DD-MM-YYYY HH24:MI:SS') 
                               AND TO_TIMESTAMP($2, 'DD-MM-YYYY HH24:MI:SS')

UNION ALL

SELECT 
	NULL::text AS cancel_unique_id,
	NULL::timestamp AS cancel_date,
    NULL::text AS customers_unique_id,
    NULL::timestamp AS sale_date,
    NULL::timestamp AS ntp_complete_date,
    NULL::text AS ntp_unique_id,
    pv_completion_date AS pv_completion_date,  
    customer_unique_id::text AS pv_unique_id  
FROM 
    pv_install_install_subcontracting_schema
WHERE 
    dealer IN (` + dealerInQuery + `)  -- Use ANY to match any dealer in the array
    AND project_status != 'DUPLICATE'
    AND pv_completion_date BETWEEN TO_TIMESTAMP($1, 'DD-MM-YYYY HH24:MI:SS') 
                               AND TO_TIMESTAMP($2, 'DD-MM-YYYY HH24:MI:SS');
`

	// Execute the query to get the required unique_id and dates
	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get data", http.StatusBadRequest, nil)
		return
	}

	uniqueIDs := make(map[string][]map[string]interface{}) // Store key-value pairs for each unique_id

	for _, item := range data {
		if customerUniqueID, ok := item["customers_unique_id"].(string); ok && customerUniqueID != "" {
			// Initialize an empty slice for the customerUniqueID if it doesn't exist
			if _, exists := uniqueIDs[customerUniqueID]; !exists {
				uniqueIDs[customerUniqueID] = []map[string]interface{}{}
			}

			// Add sale_date to the map for the customerUniqueID
			if saleDate, ok := item["sale_date"].(time.Time); ok {
				uniqueIDs[customerUniqueID] = append(uniqueIDs[customerUniqueID], map[string]interface{}{"sale_date": saleDate})
			}
		}

		if ntpUniqueID, ok := item["ntp_unique_id"].(string); ok && ntpUniqueID != "" {
			// Initialize an empty slice for the ntpUniqueID if it doesn't exist
			if _, exists := uniqueIDs[ntpUniqueID]; !exists {
				uniqueIDs[ntpUniqueID] = []map[string]interface{}{}
			}

			// Add ntp_complete_date to the map for the ntpUniqueID
			if ntpCompleteDate, ok := item["ntp_complete_date"].(time.Time); ok {
				uniqueIDs[ntpUniqueID] = append(uniqueIDs[ntpUniqueID], map[string]interface{}{"ntp_complete_date": ntpCompleteDate})
			}
		}

		if pvUniqueID, ok := item["pv_unique_id"].(string); ok && pvUniqueID != "" {
			// Initialize an empty slice for the pvUniqueID if it doesn't exist
			if _, exists := uniqueIDs[pvUniqueID]; !exists {
				uniqueIDs[pvUniqueID] = []map[string]interface{}{}
			}

			// Add pv_completion_date to the map for the pvUniqueID
			if pvCompletionDate, ok := item["pv_completion_date"].(time.Time); ok {
				uniqueIDs[pvUniqueID] = append(uniqueIDs[pvUniqueID], map[string]interface{}{"pv_completion_date": pvCompletionDate})
			}
		}

		if cancelUniqueID, ok := item["cancel_unique_id"].(string); ok && cancelUniqueID != "" {
			// Initialize an empty slice for the pvUniqueID if it doesn't exist
			if _, exists := uniqueIDs[cancelUniqueID]; !exists {
				uniqueIDs[cancelUniqueID] = []map[string]interface{}{}
			}

			// Add pv_completion_date to the map for the pvUniqueID
			if cancelDate, ok := item["cancel_date"].(time.Time); ok {
				uniqueIDs[cancelUniqueID] = append(uniqueIDs[cancelUniqueID], map[string]interface{}{"cancel_date": cancelDate})
			}
		}

	}

	// Prepare a query to fetch detailed customer data based on the unique_ids
	queryWithUniqueIDs := `
SELECT DISTINCT cs.unique_id, cs.customer_name AS home_owner, cs.email_address,
       cs.phone_number, cs.address, cs.state,
       scs.contracted_system_size_parent, 
       ps.pto_granted AS pto_date, cs.primary_sales_rep, 
       cs.secondary_sales_rep, cs.total_system_cost AS contract_total
FROM customers_customers_schema cs 
LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id 
LEFT JOIN pv_install_install_subcontracting_schema pis ON pis.customer_unique_id = cs.unique_id 
LEFT JOIN sales_metrics_schema ss ON ss.unique_id = cs.unique_id 
LEFT JOIN system_customers_schema scs ON scs.customer_id = cs.unique_id
LEFT JOIN pto_ic_schema ps ON ps.customer_unique_id = cs.unique_id
WHERE cs.unique_id IN (`

	// Add all unique_ids to the query dynamically
	first := true
	for uniqueID := range uniqueIDs {
		if !first {
			queryWithUniqueIDs += ","
		}
		queryWithUniqueIDs += fmt.Sprintf("'%s'", uniqueID)
		first = false
	}
	queryWithUniqueIDs += ")"

	// Execute the second query to get detailed data for the unique_ids
	detailedData, err := db.ReteriveFromDB(db.RowDataDBIndex, queryWithUniqueIDs, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get detailed customer data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get detailed customer data", http.StatusBadRequest, nil)
		return
	}

	// Loop through the detailedData fetched from the second query
	for _, item := range detailedData {
		if uniqueID, ok := item["unique_id"].(string); ok && uniqueID != "" {
			// Check if the unique_id exists in the uniqueIDs map
			if queryResults, found := uniqueIDs[uniqueID]; found {
				// Loop through the slice of maps for each unique_id
				for _, queryResult := range queryResults {
					// Check and assign sale_date if it exists in the map
					if saleDate, ok := queryResult["sale_date"].(time.Time); ok {
						item["sale_date"] = saleDate
					}

					// Check and assign cancel_date if it exists in the map
					if cancelDate, ok := queryResult["cancel_date"].(time.Time); ok {
						item["cancelled_date"] = cancelDate
					}

					// Check and assign ntp_complete_date if it exists in the map
					if ntpCompleteDate, ok := queryResult["ntp_complete_date"].(time.Time); ok {
						item["ntp_complete_date"] = ntpCompleteDate
					}

					// Check and assign pv_completion_date if it exists in the map
					if pvCompletionDate, ok := queryResult["pv_completion_date"].(time.Time); ok {
						item["pv_completion_date"] = pvCompletionDate
					}
				}
			} else {
				log.FuncErrorTrace(0, "No data found for unique_id: %s", uniqueID)
			}
		} else {
			log.FuncErrorTrace(0, "Invalid or missing unique_id in detailedData")
		}
	}

	// Send the data as a response
	RecordCount = int64(len(detailedData))
	appserver.FormAndSendHttpResp(resp, "Detailed customer data", http.StatusOK, detailedData, RecordCount)
}

func FetchLeaderBoardDealerForAmAe(dataReq models.GetCsvDownload, userRole interface{}) ([]string, error) {
	log.EnterFn(0, "FetchLeaderBoardDealerForAmAe")
	defer func() { log.ExitFn(0, "FetchLeaderBoardDealerForAmAe", nil) }()

	var items []string

	accountName, err := fetchAmAeName(dataReq.Email)
	if err != nil {
		log.FuncErrorTrace(0, "Unable to fetch name for Account Manager/Account Executive; err: %v", err)
		return nil, fmt.Errorf("unable to fetch name for account manager / account executive; err: %v", err)
	}

	var roleBase string
	role, _ := userRole.(string)
	if role == "Account Manager" {
		roleBase = "account_manager"
	} else {
		roleBase = "account_executive"
	}

	log.FuncInfoTrace(0, "Logged user %v is %v", accountName, roleBase)

	query := fmt.Sprintf("SELECT sales_partner_name AS data FROM sales_partner_dbhub_schema WHERE LOWER(%s) = LOWER('%s')", roleBase, accountName)
	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
		return nil, fmt.Errorf("failed to get partner_name from sales_partner_dbhub_schema; err: %v", err)
	}

	for _, item := range data {
		name, ok := item["data"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to parse 'data' item: %+v", item)
			continue
		}
		items = append(items, name)
	}

	return items, nil
}
