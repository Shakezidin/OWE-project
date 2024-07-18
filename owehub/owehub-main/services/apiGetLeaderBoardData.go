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

	log.FuncInfoTrace(0, "CHECKPOINT 3")

	log.FuncInfoTrace(0, "USER ROLE -> %v USER EMAIL -> %v", dataReq.Role, dataReq.Email)
	if dataReq.Role == "Dealer Owner" {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT ud2.name AS dealer_owner FROM user_details ud1
			JOIN user_details ud2 ON ud1.dealer_owner = ud2.user_id
			where ud1.email_id = %v;
		`, dataReq.Email)
	} else {
		dealerOwnerFetchQuery = fmt.Sprintf(`
			SELECT name AS dealer_owner FROM user_details
			where email_id = %v;
		`, dataReq.Email)
	}

	if dataReq.Role == "Admin" {
		adminCheck = true
	} else {
		adminCheck = false
		data, err = db.ReteriveFromDB(db.OweHubDbIndex, dealerOwnerFetchQuery, nil)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get user details from DB for %v err: %v", data, err)
			FormAndSendHttpResp(resp, "Failed to fetch dealer name", http.StatusBadRequest, data)
			return
		}
		if len(data) == 0 {
			log.FuncErrorTrace(0, "Failed to get user details from DB for %v err: %v", data, err)
			FormAndSendHttpResp(resp, "Failed to fetch dealer name %v", http.StatusBadRequest, data)
			return
		}

		dataReq.DealerName, _ = data[0]["dealer_owner"].(string)
		log.FuncInfoTrace(0, "DEALER NAME -> %v", dataReq.DealerName)
	}

	leaderBoardQuery = `
	SELECT dealer, primary_sales_rep, COUNT(system_size) AS count, SUM(system_size) AS kw FROM consolidated_data_view 
	`
	filter, whereEleList = PrepareLeaderDateFilters(dataReq, adminCheck)
	leaderBoardQuery = leaderBoardQuery + filter

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, leaderBoardQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get leader board details from DB for %v err: %v", data, err)
		FormAndSendHttpResp(resp, "Failed to fetch leader board details", http.StatusBadRequest, data)
		return
	}

	LeaderBoardList := models.GetLeaderBoardList{}
	for _, item := range data {
		Dealer, _ := item["dealer"].(string)
		Name, _ := item["primary_sales_rep"].(string)
		Count, _ := item["count"].(int64)
		Kw, _ := item["kw"].(float64)

		LeaderBoard := models.GetLeaderBoard{
			Dealer: Dealer,
			Name:   Name,
			Count:  Count,
			Kw:     Kw,
		}
		LeaderBoardList.LeaderBoardList = append(LeaderBoardList.LeaderBoardList, LeaderBoard)
	}

	sort.Slice(LeaderBoardList.LeaderBoardList, func(i, j int) bool {
		if dataReq.SortBy == "kw" {
			return int64(LeaderBoardList.LeaderBoardList[i].Kw) > int64(LeaderBoardList.LeaderBoardList[j].Kw)
		}
		return LeaderBoardList.LeaderBoardList[i].Count > LeaderBoardList.LeaderBoardList[j].Count
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

func PrepareLeaderDateFilters(dataReq models.GetLeaderBoardRequest, adminCheck bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareDateFilters")
	defer func() { log.ExitFn(0, "PrepareDateFilters", nil) }()

	var filtersBuilder strings.Builder
	filtersBuilder.WriteString(" WHERE ")

	if !adminCheck {
		filtersBuilder.WriteString(fmt.Sprintf(" dealer = $%d AND ", len(whereEleList)+1))
		whereEleList = append(whereEleList, dataReq.DealerName)
	}
	filtersBuilder.WriteString(" primary_sales_rep != '' AND dealer != '' AND ")

	startDate, _ := time.Parse("02-01-2006", dataReq.StartDate)
	endDate, _ := time.Parse("02-01-2006", dataReq.EndDate)

	endDate = endDate.Add(24*time.Hour - time.Second)

	whereEleList = append(whereEleList,
		startDate.Format("02-01-2006 00:00:00"),
		endDate.Format("02-01-2006 15:04:05"),
	)

	switch dataReq.LeaderType {
	case "sale":
		filtersBuilder.WriteString(fmt.Sprintf(" contract_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "ntp":
		filtersBuilder.WriteString(fmt.Sprintf(" ntp_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "cancel":
		filtersBuilder.WriteString(fmt.Sprintf(" cancelled_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	case "install":
		filtersBuilder.WriteString(fmt.Sprintf(" pv_install_completed_date BETWEEN TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') AND TO_TIMESTAMP($%d, 'DD-MM-YYYY HH24:MI:SS') ", len(whereEleList)-1, len(whereEleList)))
	}

	filtersBuilder.WriteString(" GROUP BY dealer, primary_sales_rep ")

	filters = filtersBuilder.String()
	return filters, whereEleList
}
