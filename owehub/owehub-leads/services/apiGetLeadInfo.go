/**************************************************************************
 * File       	   : apiGetLeadsHistory.go // 🔴🔴
 * DESCRIPTION     : This file contains functions for get LeadsHistory data handler
 * DATE            : 21-Sept-2024
 **************************************************************************/

package services

import (
	//"OWEApp/owehub-leads/common"
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
 * FUNCTION:		HandleGetLeadInfo// 🔴🔴
 * DESCRIPTION:     handler for get LeadsHistoy data request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetLeadInfo(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		whereClause  string
		whereEleList []interface{}
		dataReq      models.GetLeadInfoRequest
		data          []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetLeadInfo")
	defer func() { log.ExitFn(0, "HandleGetLeadInfo", err) }()

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
		log.FuncErrorTrace(0, "Failed to unmarshal get Leads info request body err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal get Leads info request body", http.StatusBadRequest, nil)
		return
	}

	// Construct the query to fetch lead data by lead_id
	whereClause = "WHERE li.leads_id = $1"
	query := `
        SELECT
            li.leads_id, li.first_name, li.last_name, li.email_id, li.phone_number, li.street_address, li.status_id,
            li.created_at, li.appointment_date, li.appointment_scheduled_date, li.appointment_accepted_date, li.appointment_declined_date
        FROM
            leads_info li
        ` + whereClause

	whereEleList = append(whereEleList, dataReq.LeadsID)

	// Execute the query
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get lead info from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to fetch lead info", http.StatusInternalServerError, nil)
		return
	}


	
		// Access the first result (assuming one lead will be returned for the given ID)
		leadData := data[0]

		// Type assertion with proper handling of types
		leadResponse := models.GetLeadInfoRes{
			LeadsID:        leadData["leads_id"].(int64),           // LeadsID is asserted as int64
			FirstName:      leadData["first_name"].(string),        // FirstName as string
			LastName:       leadData["last_name"].(string),         // LastName as string
			EmailId:        leadData["email_id"].(string),          // EmailId as string
			PhoneNumber:    leadData["phone_number"].(string),      // PhoneNumber as string
			StreetAddress:  leadData["street_address"].(string),    // StreetAddress as string
			StatusID:       leadData["status_id"].(int64),          // StatusID as int64
		}


		switch leadResponse.StatusID {
			case 0: // PENDING
				if createdAt, ok := leadData["created_at"].(time.Time); ok {
					leadResponse.CreatedAt = &createdAt
				}
			case 1: // SENT
				if createdAt, ok := leadData["created_at"].(time.Time); ok {
					leadResponse.CreatedAt = &createdAt
				}
				if appointmentDate, ok := leadData["appointment_date"].(time.Time); ok {
					leadResponse.AppointmentDate = &appointmentDate
				}
				if appointmentScheduledDate, ok := leadData["appointment_scheduled_date"].(time.Time); ok {
					leadResponse.AppointmentScheduledDate = &appointmentScheduledDate
				}
			case 2: // ACCEPTED
				if createdAt, ok := leadData["created_at"].(time.Time); ok {
					leadResponse.CreatedAt = &createdAt
				}
				if appointmentDate, ok := leadData["appointment_date"].(time.Time); ok {
					leadResponse.AppointmentDate = &appointmentDate
				}
				if appointmentScheduledDate, ok := leadData["appointment_scheduled_date"].(time.Time); ok {
					leadResponse.AppointmentScheduledDate = &appointmentScheduledDate
				}
				if appointmentAcceptedDate, ok := leadData["appointment_accepted_date"].(time.Time); ok {
					leadResponse.AppointmentAcceptedDate = &appointmentAcceptedDate
				}
			case 3: // DECLINED
				if createdAt, ok := leadData["created_at"].(time.Time); ok {
					leadResponse.CreatedAt = &createdAt
				}
				if appointmentDate, ok := leadData["appointment_date"].(time.Time); ok {
					leadResponse.AppointmentDate = &appointmentDate
				}
				if appointmentScheduledDate, ok := leadData["appointment_scheduled_date"].(time.Time); ok {
					leadResponse.AppointmentScheduledDate = &appointmentScheduledDate
				}
				if appointmentDeclinedDate, ok := leadData["appointment_declined_date"].(time.Time); ok {
					leadResponse.AppointmentDeclinedDate = &appointmentDeclinedDate
				}
			}
			

	// Send the response
	FormAndSendHttpResp(resp, "Lead Info Data", http.StatusOK, leadResponse, 1)
}


//❌❌❌❌❌❌❌❌//❌❌❌❌❌❌❌❌//❌❌❌❌❌❌❌❌
/*// Additional fields based on lead status
  switch leadResponse.StatusID {
  case 0: // PENDING
      leadResponse.CreatedAt = data["created_at"].(time.Time)
  case 1: // SENT
      leadResponse.CreatedAt = data["created_at"].(time.Time)
      leadResponse.AppointmentDate = data["appointment_date"].(time.Time)
      leadResponse.AppointmentScheduledDate = data["appointment_scheduled_date"].(time.Time)
  case 2: // ACCEPTED
      leadResponse.CreatedAt = data["created_at"].(time.Time)
      leadResponse.AppointmentDate = data["appointment_date"].(time.Time)
      leadResponse.AppointmentScheduledDate = data["appointment_scheduled_date"].(time.Time)
      leadResponse.AppointmentAcceptedDate = data["appointment_accepted_date"].(time.Time)
  case 3: // DECLINED
      leadResponse.CreatedAt = data["created_at"].(time.Time)
      leadResponse.AppointmentDate = data["appointment_date"].(time.Time)
      leadResponse.AppointmentScheduledDate = data["appointment_scheduled_date"].(time.Time)
      leadResponse.AppointmentDeclinedDate = data["appointment_declined_date"].(time.Time)
  }
*/

// // Query based on status_id
// whereClause = fmt.Sprintf("WHERE li.status_id = %d", dataReq.StatusID)

//❌❌❌❌❌❌❌❌//❌❌❌❌❌❌❌❌//❌❌❌❌❌❌❌❌
// // Construct the query based on status and requested fields
// var leadsQuery string
// switch dataReq.StatusID {
// case 0: // PENDING
// 	leadsQuery = `
// 	SELECT li.first_name, li.last_name, li.email_id, li.phone_number, li.street_address, li.status_id, li.created_at
// 	FROM leads_info li
// 	` + whereClause
// case 1: // SENT
// 	leadsQuery = `
// 	SELECT li.first_name, li.last_name, li.email_id, li.phone_number, li.street_address, li.status_id, li.created_at,
// 	       li.appointment_date, li.appointment_scheduled_date
// 	FROM leads_info li
// 	` + whereClause
// case 2: // ACCEPTED
// 	leadsQuery = `
// 	SELECT li.first_name, li.last_name, li.email_id, li.phone_number, li.street_address, li.status_id, li.created_at,
// 	       li.appointment_date, li.appointment_scheduled_date, li.appointment_accepted_date
// 	FROM leads_info li
// 	` + whereClause
// case 3: // DECLINED
// 	leadsQuery = `
// 	SELECT li.first_name, li.last_name, li.email_id, li.phone_number, li.street_address, li.status_id, li.created_at,
// 	       li.appointment_date, li.appointment_scheduled_date, li.appointment_declined_date
// 	FROM leads_info li
// 	` + whereClause
// default:
// 	log.FuncErrorTrace(0, "Invalid status")
// 	FormAndSendHttpResp(resp, "Invalid status", http.StatusBadRequest, nil)
// 	return
// }
