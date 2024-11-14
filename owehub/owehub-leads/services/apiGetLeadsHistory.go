/**************************************************************************
 * File       	   : apiGetLeadsHistory.go
 * DESCRIPTION     : This file contains functions for get LeadsHistory data handler
 * DATE            : 21-Sept-2024
 **************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"time"

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
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeadsHistory(resp http.ResponseWriter, req *http.Request) {
	var (
		err                    error
		whereClause            string
		whereEleList           []interface{}
		leadsHistoryQuery      string
		leadsHistoryCountQuery string
		dataReq                models.GetLeadsHistoryRequest
		data                   []map[string]interface{}
		recordCount            int64
	)

	log.EnterFn(0, "HandleGetLeadsHistory")
	defer func() { log.ExitFn(0, "HandleGetLeadsHistory", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get Leads data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get Leads data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get Leads History request body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get Leads History request body", http.StatusBadRequest, nil)
		return
	}

	// Fetch leads_id from the request
	LS := dataReq.LeadsStatus
	if LS != 5 && LS != 6 && LS != -1 {
		log.FuncErrorTrace(0, "Not a correct Lead status")
		appserver.FormAndSendHttpResp(resp, "Correct Leads status is required", http.StatusBadRequest, nil)
		return
	}

	// validating start date
	_, err = time.Parse("02-01-2006", dataReq.StartDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to convert Start date :%+v to time.Time err: %+v", dataReq.StartDate, err)
		appserver.FormAndSendHttpResp(resp, "Invalid date format, Expected format : DD-MM-YYYY", http.StatusInternalServerError, nil)
		return
	}

	// validating end date
	_, err = time.Parse("02-01-2006", dataReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to convert end date :%+v to time.Time err: %+v", dataReq.EndDate, err)
		appserver.FormAndSendHttpResp(resp, "Invalid date format, Expected format : DD-MM-YYYY", http.StatusInternalServerError, nil)
		return
	}

	// Calculate for pagination
	pageSize := dataReq.PageSize
	pageNumber := dataReq.PageNumber
	if pageSize <= 0 {
		pageSize = 10
	}
	if pageNumber <= 0 {
		pageNumber = 1
	}
	offset := (pageNumber - 1) * pageSize

	// if leads status is -1, show all won or lost
	if dataReq.LeadsStatus == -1 {
		whereClause = `
			WHERE (li.lead_lost_date IS NOT NULL 
				OR li.qc_audit IS TRUE )
			`
	}

	if dataReq.LeadsStatus == 5 {
		whereClause = "WHERE (li.qc_audit IS TRUE)"
	}

	if dataReq.LeadsStatus == 6 {
		whereClause = "WHERE li.lead_lost_date IS NOT NULL"
	}

	// Add date range and archive conditions to the whereClause
	whereClause = fmt.Sprintf(`
    	%s
		AND li.updated_at >= TO_TIMESTAMP($2, 'DD-MM-YYYY')
		AND li.updated_at < TO_TIMESTAMP($3, 'DD-MM-YYYY') + INTERVAL '1 day'
		AND li.is_archived = $4
		`, whereClause)

	// Construct the final query with pagination and ORDER BY
	leadsHistoryQuery = fmt.Sprintf(`
    SELECT
        li.leads_id, li.first_name, li.last_name, li.email_id, li.phone_number, li.status_id,
        ls.status_name, li.updated_at, li.appointment_disposition_note, li.street_address,
        li.appointment_scheduled_date, li.appointment_accepted_date, li.zipcode,
        li.appointment_declined_date, li.appointment_date, li.lead_won_date, li.lead_lost_date, li.proposal_created_date
		FROM
        get_leads_info_hierarchy($1) li
	INNER JOIN leads_status ls ON ls.status_id = li.status_id
    %s
    ORDER BY li.updated_at DESC
`, whereClause)

	authenticatedUserEmail := req.Context().Value("emailid").(string)
	whereEleList = append(whereEleList,
		authenticatedUserEmail,
		dataReq.StartDate,
		dataReq.EndDate,
		dataReq.IsArchived,
	)

	// Add pagination conditionally if valid
	if dataReq.PageSize > 0 && dataReq.PageNumber > 0 {
		leadsHistoryQuery += " LIMIT $5 OFFSET $6"
		whereEleList = append(whereEleList, pageSize, offset)
	}

	// Execute the query
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, leadsHistoryQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead history from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch lead history", http.StatusInternalServerError, nil)
		return
	}

	// Prepare the response
	LeadsHistoryResponse := models.GetLeadsHistoryList{
		LeadsHistoryList: []models.GetLeadsHistoryResponse{},
	}

	for _, item := range data {
		timeline := getLeadHistoryTimeline(item)

		var (
			dealDateStr *time.Time
			dealStatus  string
		)

		streetAddress, ok := item["street_address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get street address for Lead: %+v\n", item)
			streetAddress = ""
		}

		zipcode, ok := item["zipcode"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get zipcode for Lead: %+v\n", item)
			zipcode = ""
		}

		// deal won if lead_won_date is not null
		leadWonDate, ok := item["lead_won_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead won date from leads info Item: %+v\n", item)
		} else {
			dealDateStr = &leadWonDate
			dealStatus = "Deal Won"
		}

		leadLostDate, ok := item["lead_lost_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get lead lost date from leads info Item: %+v\n", item)
		} else {
			dealDateStr = &leadLostDate
			dealStatus = "Deal Loss"
		}
		LeadsHistory := models.GetLeadsHistoryResponse{
			DealDate:      dealDateStr,
			DealStatus:    dealStatus,
			Zipcode:       zipcode,
			FirstName:     item["first_name"].(string),
			LastName:      item["last_name"].(string),
			EmailId:       item["email_id"].(string),
			PhoneNumber:   item["phone_number"].(string),
			LeadsID:       item["leads_id"].(int64),
			StatusID:      item["status_id"].(int64),
			StreetAddress: streetAddress,
			Timeline:      timeline,
		}

		LeadsHistoryResponse.LeadsHistoryList = append(LeadsHistoryResponse.LeadsHistoryList, LeadsHistory)
	}

	// Count total records from db
	leadsHistoryCountQuery = fmt.Sprintf(`
        SELECT COUNT(*) FROM get_leads_info_hierarchy($1) li
        %s
        `, whereClause)

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, leadsHistoryCountQuery, whereEleList[0:4])
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead history count from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch lead history count", http.StatusInternalServerError, nil)
		return
	}

	recordCount = data[0]["count"].(int64)

	appserver.FormAndSendHttpResp(resp, "Leads History Data", http.StatusOK, LeadsHistoryResponse, recordCount)

}

/******************************************************************************
 * FUNCTION:		getLeadHistoryTimeline
 * DESCRIPTION:     get leads history timeline
 * INPUT:			resultItem
 * RETURNS:    		timeline
 ******************************************************************************/
func getLeadHistoryTimeline(resultItem map[string]interface{}) (timeline []models.GetLeadsTimelineItem) {

	if appointmentScheduledDate, ok := resultItem["appointment_scheduled_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelScheduled),
			Date:  &appointmentScheduledDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment scheduled date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelScheduled),
			Date:  nil,
		})
	}

	if appointmentAcceptedDate, ok := resultItem["appointment_accepted_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelAccepted),
			Date:  &appointmentAcceptedDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment accepted date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelAccepted),
			Date:  nil,
		})
	}

	if appointmentDate, ok := resultItem["appointment_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelAppointment),
			Date:  &appointmentDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelAppointment),
			Date:  nil,
		})
	}

	if leadWonDate, ok := resultItem["lead_won_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelWon),
			Date:  &leadWonDate,
		})

		// if won, also append proposal created date
		if proposalCreatedDate, ok := resultItem["proposal_created_date"].(time.Time); ok {
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: string(leadsService.LeadTimelineLabelProposalCreated),
				Date:  &proposalCreatedDate,
			})
		} else {
			log.FuncErrorTrace(0, "Failed to get proposal created date for Lead: %+v\n", resultItem)
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: string(leadsService.LeadTimelineLabelProposalCreated),
				Date:  nil,
			})
		}
	}

	if dealLostDate, ok := resultItem["lead_lost_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: string(leadsService.LeadTimelineLabelLost),
			Date:  &dealLostDate,
		})

		// if lost, also append reason (dispoition note)
		if reason, ok := resultItem["appointment_disposition_note"].(string); ok {
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: reason,
				Date:  &dealLostDate,
			})
		} else {
			log.FuncErrorTrace(0, "Failed to get appointment disposition note for Lead: %+v\n", resultItem)
		}
	}

	return timeline
}
