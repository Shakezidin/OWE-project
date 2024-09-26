/**************************************************************************
 * File       	   : apiGetLeadsHistory.go
 * DESCRIPTION     : This file contains functions for get LeadsHistory data handler
 * DATE            : 21-Sept-2024
 **************************************************************************/

package services

import (
    "OWEApp/shared/db"
    log "OWEApp/shared/logger"
    models "OWEApp/shared/models"
 
    // "OWEApp/shared/types"
    // "sort"
    // "strings"
    //"time"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

/******************************************************************************
 * FUNCTION:		HandleGetLeadsHistory
 * DESCRIPTION:     handler for get LeadsHistoy data request
 * INPUT:			resp, req
 * RETURNS:    		void 🎖️🎖️🎖️
 ******************************************************************************/
func HandleGetLeadsHistory(resp http.ResponseWriter, req *http.Request) {
    var (
        err          error
        whereEleList []interface{}
        //whereClauses      []string✅
        //queryParameters  []interface{}
        leadsHistoryQuery string
        dataReq           models.GetLeadsHistoryRequest
        leadsId           int //❌
        data              []map[string]interface{}
        // startDate          string❌
        // endDate            string❌
        // page               int❌
        // limit              int❌
        // wonLostFilter      string❌
        // sortBy             string❌
        RecordCount int
        //paramIndex        int✅
        // pageOffset        int✅
    )

    log.EnterFn(0, "HandleGetLeadsHistory")
    defer func() { log.ExitFn(0, "HandleGetLeadsHistory", err) }()

    if req.Body == nil {
        err = fmt.Errorf("HTTP Request body is null in get Leads data request")
        log.FuncErrorTrace(0, "%v", err)
        FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
        return
    }

    reqBody, err := ioutil.ReadAll(req.Body)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Leads data request err: %v", err)
        FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
        return
    }

    err = json.Unmarshal(reqBody, &dataReq)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to unmarshal get Leads History request body err: %v", err)
        FormAndSendHttpResp(resp, "Failed to unmarshal get Leads History request body", http.StatusBadRequest, nil)
        return
    }

    // Fetch leads_id from the request
    LS := dataReq.LeadsStatus
    if LS < 5 || LS > 6 {
        log.FuncErrorTrace(0, "Not a correct Lead status")
        FormAndSendHttpResp(resp, "Correct Leads status is required", http.StatusBadRequest, nil)
        return
    }


    // Calculate for pagination
    pageSize := dataReq.PageSize
    pageNumber := dataReq.PageNumber
    if pageSize <= 0 {
        pageSize = 10 // setting default page size if <0
    }
    if pageNumber <= 0 {
        pageNumber = 1          // setting default pagenumber 
    }
    offset := (pageNumber - 1) * pageSize

    // Construct the query with pagination


    // FOR SHOWING ALL DATA 🔴🔴🔴
    // if dataReq.LeadsStatus == -1 {
    //     leadsHistoryQuery = `
    //         SELECT
    //             li.first_name, li.last_name, li.email_id, li.phone_number, li.status_id, 
    //             ls.status_name, li.updated_at 
    //         FROM
    //             "public".leads_info li
    //         JOIN
    //             "public".leads_status ls ON li.status_id = ls.status_id
    //         WHERE
    //             li.status_id IN (5, 6)  
    //             AND li.updated_at >= $1  -- Start date 
    //             AND li.updated_at <= $2  -- End date 
    //         ORDER BY
    //             ls.status_name ASC, 
    //             li.updated_at DESC
    //         LIMIT $3  
    //         OFFSET $4  
    //     `
    // } else {}

    
    leadsHistoryQuery = `
        SELECT
            li.first_name, li.last_name, li.email_id, li.phone_number, li.status_id, 
            ls.status_name, li.updated_at 
        FROM
            "public".leads_info li
        JOIN
            "public".leads_status ls ON li.status_id = ls.status_id
        WHERE
            li.status_id = $3  
            AND li.updated_at >= $1  -- Start date 
            AND li.updated_at <= $2  -- End date 
        ORDER BY
            ls.status_name ASC, 
            li.updated_at DESC
        LIMIT $4  -- for page size
        OFFSET $5  -- Offset for pagination
        `

    // Append the necessary parameters
    whereEleList = append(whereEleList,
        dataReq.StartDate,     
        dataReq.EndDate,       
        dataReq.LeadsStatus,   
        pageSize,              
        offset,              
    )


    // Execute the query
    data, err = db.ReteriveFromDB(db.OweHubDbIndex, leadsHistoryQuery, whereEleList)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to get lead history from DB for lead_id %v err: %v", leadsId, err)
        FormAndSendHttpResp(resp, "Failed to fetch lead history", http.StatusInternalServerError, nil)
        return
    } //🔴🔴🔴remove leads_id

    // Prepare the response
    LeadsHistoryResponse := models.GetLeadsHistoryList{}

    for _, item := range data {
        LeadsHistory := models.GetLeadsHistoryResponse{
            FirstName:   item["first_name"].(string),
            LastName:    item["last_name"].(string),
            EmailId:     item["email_id"].(string),
            PhoneNumber: item["phone_number"].(string),
            // StatusID:    item["status_id"].(int),
            // StatusName:  item["status_name"].(string),
            // UpdatedAt:   item["updated_at"].(time.Time),
        }

        LeadsHistoryResponse.LeadsHistoryList = append(LeadsHistoryResponse.LeadsHistoryList, LeadsHistory)
    }

    // Return the response
    RecordCount = len(LeadsHistoryResponse.LeadsHistoryList)
    FormAndSendHttpResp(resp, "Leads History Data", http.StatusOK, LeadsHistoryResponse, int64(RecordCount))

}


/*
    
*/