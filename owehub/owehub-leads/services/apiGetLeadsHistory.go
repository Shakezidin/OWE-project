/**************************************************************************
 * File       	   : apiGetLeadsHistory.go
 * DESCRIPTION     : This file contains functions for get LeadsHistory data handler
 * DATE            : 21-Sept-2024
 **************************************************************************/

package services

import (
	"OWEApp/owehub-leads/common"
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
		err               error
		whereClause       string
		whereEleList      []interface{}
		leadsHistoryQuery string
		dataReq           models.GetLeadsHistoryRequest
		data              []map[string]interface{}
		RecordCount       int
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
	if LS != 5 && LS != 6 && LS != -1 {
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
		pageNumber = 1 // setting default pagenumber
	}
	offset := (pageNumber - 1) * pageSize

	// Construct the query with pagination

	// FOR SHOWING ALL DATA 🔴🔴🔴
	if dataReq.LeadsStatus == -1 {
		whereClause = "WHERE li.status_id IN (5, 6)"
	} else {
		whereClause = fmt.Sprintf("WHERE li.status_id = %d", dataReq.LeadsStatus)
	}

	leadsHistoryQuery = fmt.Sprintf(`
        SELECT
            li.leads_id, li.first_name, li.last_name, li.email_id, li.phone_number, li.status_id,
            ls.status_name, li.updated_at, li.appointment_disposition_note, li.street_address,
            li.appointment_scheduled_date, li.appointment_accepted_date, 
            li.appointment_declined_date, li.appointment_date, li.lead_won_date, li.lead_lost_date, li.proposal_created_date
        FROM
            get_leads_info_hierarchy($1) li
        JOIN
            leads_status ls ON li.status_id = ls.status_id
         %s -- filter for status id
            AND li.updated_at >= TO_TIMESTAMP($2, 'DD-MM-YYYY')                       -- Start date 
            AND li.updated_at < TO_TIMESTAMP($3, 'DD-MM-YYYY')  + INTERVAL '1 day'    -- End date
        ORDER BY
             li.updated_at DESC
        LIMIT $4  -- for page size
        OFFSET $5  -- Offset for pagination
         `,
		whereClause,
	)

	authenticatedUserEmail := req.Context().Value("emailid").(string)
	whereEleList = append(whereEleList, authenticatedUserEmail, dataReq.StartDate, dataReq.EndDate, pageSize, offset)

	// Execute the query
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, leadsHistoryQuery, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead history from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to fetch lead history", http.StatusInternalServerError, nil)
		return
	}

	// Prepare the response
	LeadsHistoryResponse := models.GetLeadsHistoryList{
		LeadsHistoryList: []models.GetLeadsHistoryResponse{},
	}

	for _, item := range data {
		timeline := getLeadHistoryTimeline(item)

		streetAddress, ok := item["street_address"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get street address for Lead: %+v\n", item)
			streetAddress = ""
		}
		LeadsHistory := models.GetLeadsHistoryResponse{
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

	// Return the response
	RecordCount = len(LeadsHistoryResponse.LeadsHistoryList)
	FormAndSendHttpResp(resp, "Leads History Data", http.StatusOK, LeadsHistoryResponse, int64(RecordCount))

}

/******************************************************************************
 * FUNCTION:		getLeadHistoryTimeline
 * DESCRIPTION:     get leads history timeline
 * INPUT:			resultItem
 * RETURNS:    		timeline
 ******************************************************************************/
func getLeadHistoryTimeline(resultItem map[string]interface{}) (timeline []models.GetLeadsTimelineItem) {

	// retrieve appoitment_scheduled_date, appointment_accepted_date, appointment_date first as they are mandatory
	// in either case of lead being won or lost, we will have a timeline with these three at least
	// further dates depend on won or lost status
	if appointmentScheduledDate, ok := resultItem["appointment_scheduled_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelScheduled,
			Date:  &appointmentScheduledDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment scheduled date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelScheduled,
			Date:  nil,
		})
	}

	if appointmentAcceptedDate, ok := resultItem["appointment_accepted_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelAccepted,
			Date:  &appointmentAcceptedDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment accepted date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelAccepted,
			Date:  nil,
		})
	}

	if appointmentDate, ok := resultItem["appointment_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelAppointment,
			Date:  &appointmentDate,
		})
	} else {
		log.FuncErrorTrace(0, "Failed to get appointment date for Lead: %+v\n", resultItem)
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelAppointment,
			Date:  nil,
		})
	}

	if leadWonDate, ok := resultItem["lead_won_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelWon,
			Date:  &leadWonDate,
		})

		// if won, also append proposal created date
		if proposalCreatedDate, ok := resultItem["proposal_created_date"].(time.Time); ok {
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: common.LeadTimelineLabelProposalCreated,
				Date:  &proposalCreatedDate,
			})
		} else {
			log.FuncErrorTrace(0, "Failed to get proposal created date for Lead: %+v\n", resultItem)
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: common.LeadTimelineLabelProposalCreated,
				Date:  nil,
			})
		}
	}

	if dealLostDate, ok := resultItem["lead_lost_date"].(time.Time); ok {
		timeline = append(timeline, models.GetLeadsTimelineItem{
			Label: common.LeadTimelineLabelLost,
			Date:  &dealLostDate,
		})

		// if lost, also append reason (dispoition note)
		if reason, ok := resultItem["appointment_disposition_note"].(string); ok {
			timeline = append(timeline, models.GetLeadsTimelineItem{
				Label: common.LeadTimelineLabel(reason),
				Date:  &dealLostDate,
			})
		} else {
			log.FuncErrorTrace(0, "Failed to get appointment disposition note for Lead: %+v\n", resultItem)
		}
	}

	return timeline
}
