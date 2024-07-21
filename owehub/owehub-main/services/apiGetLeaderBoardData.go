/**************************************************************************
 * File       	   : apiGetLeaderBoardData.go
 * DESCRIPTION     : This file contains functions for get LeaderBoard data handler
 * DATE            : 24-Jun-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
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
	)

	log.EnterFn(0, "HandleGetLeaderBoardDataRequest")
	defer func() { log.ExitFn(0, "HandleGetLeaderBoardDataRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get LeaderBoard data request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get LeaderBoard data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get LeaderBoard data request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get LeaderBoard data Request body", http.StatusBadRequest, nil)
		return
	}

	dataReq.Email = req.Context().Value("emailid").(string)
	if dataReq.Email == "" {
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	dataReq.Role = req.Context().Value("rolename").(string)
	if dataReq.Role == "" {
		FormAndSendHttpResp(resp, "No user exist in DB", http.StatusBadRequest, nil)
		return
	}

	if dataReq.Role != "Admin" {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT vd.dealer_name AS dealer_name FROM user_details ud
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

		log.FuncErrorTrace(0, "dealer name = = = = %v", dealerName)

		dataReq.DealerName = append(dataReq.DealerName, dealerName)
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

	if len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0 {
		leaderBoardQuery = fmt.Sprintf(" SELECT %v as name, dealer as dealer, ", dataReq.GroupBy)
	} else {
		leaderBoardQuery = fmt.Sprintf(" SELECT %v as name, ", dataReq.GroupBy)
	}

	filter, whereEleList = PrepareLeaderDateFilters(dataReq, adminCheck, dealerIn)
	leaderBoardQuery = leaderBoardQuery + filter

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, leaderBoardQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	LeaderBoardList := models.GetLeaderBoardList{}
	if len(data) > 0 {
		for _, item := range data {
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

			LeaderBoard := models.GetLeaderBoard{
				Dealer:  dlrName,
				Name:    Name,
				Sale:    Sale,
				Ntp:     Ntp,
				Cancel:  Cancel,
				Install: Install,
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

	for i := range LeaderBoardList.LeaderBoardList {
		LeaderBoardList.LeaderBoardList[i].Rank = i + 1
	}

	LeaderBoardList.LeaderBoardList = Paginate(LeaderBoardList.LeaderBoardList, dataReq.PageNumber, dataReq.PageSize)

	RecordCount = int64(len(data))
	log.FuncInfoTrace(0, "Number of LeaderBoard List fetched : %v list %+v", len(LeaderBoardList.LeaderBoardList), LeaderBoardList)
	FormAndSendHttpResp(resp, "LeaderBoard Data", http.StatusOK, LeaderBoardList, RecordCount)
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
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

	var filtersBuilder strings.Builder

	startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	switch dataReq.Type {
	case "count":
		filtersBuilder.WriteString(fmt.Sprintf(" COUNT(CASE WHEN contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size END) AS sale, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" COUNT(CASE WHEN ntp_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size END) AS ntp, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" COUNT(CASE WHEN cancelled_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size END) AS cancel, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" COUNT(CASE WHEN pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size END) AS install", len(whereEleList)-1, len(whereEleList)))
	case "kw":
		filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size ELSE 0 END) AS sale, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN ntp_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size ELSE 0 END) AS ntp, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN cancelled_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size ELSE 0 END) AS cancel, ", len(whereEleList)-1, len(whereEleList)))
		filtersBuilder.WriteString(fmt.Sprintf(" SUM(CASE WHEN pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') THEN system_size ELSE 0 END) AS install", len(whereEleList)-1, len(whereEleList)))
	}

	filtersBuilder.WriteString(" FROM consolidated_data_view ")
	if len(dealerIn) > 13 {
		filtersBuilder.WriteString(" WHERE ")
		filtersBuilder.WriteString(dealerIn)
	}

	if len(dataReq.DealerName) > 1 || len(dataReq.DealerName) == 0 {
		if dataReq.GroupBy != "dealer" {
			filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v , dealer ", dataReq.GroupBy))
		} else {
			filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v ", dataReq.GroupBy))
		}
	} else {
		filtersBuilder.WriteString(fmt.Sprintf(" GROUP BY %v ", dataReq.GroupBy))
	}

	filters = filtersBuilder.String()
	return filters, whereEleList
}
