/**************************************************************************
* File			: apiGetSchedulingProjects.go
* DESCRIPTION	: This file contains functions for fetching scheduling projects
*                 with pagination support.
* DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
 * FUNCTION:        HandleGetSalesRepSchedulingProjectsRequest
 * DESCRIPTION:     Handler for getting scheduling projects with pagination
 * INPUT:           resp, req
 * RETURNS:         void
 ******************************************************************************/
func HandleGetSalesRepSchedulingProjectsRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                       error
		apiResp                   models.GetSchedulingProjectsList
		dataReq                   models.GetSchedulingProjectsReq
		schedulingProjectsQuery   string
		schedulingProjectsRecords []map[string]interface{}
	)

	FormAndSendHttpResp(resp, "Scheduling projects retrieved successfully", http.StatusOK, apiResp)
	log.EnterFn(0, "HandleGetSalesRepSchedulingProjectsRequest")


	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get SalesRep SchedulingProjects request")
		log.FuncErrorTrace(0, "%v", err)
		FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get SalesRep SchedulingProjects request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get SalesRep SchedulingProjects request err: %v", err)
		FormAndSendHttpResp(resp, "Failed to unmarshal request body", http.StatusBadRequest, nil)
		return
	}

	// Fetch records with pagination
	schedulingProjectsQuery = fmt.Sprintf(`
		SELECT 
			sp.first_name,
			sp.last_name,
			sp.email,
			sp.phone,
			sp.address,
			sp.roof_type,
			sp.system_size,
			ud.name as sales_rep_name
		FROM %s sp
		INNER JOIN %s ud ON ud.email_id = sp.sales_rep_email_id
		WHERE sp.is_appointment_approved = false
		ORDER BY sp.created_at 
		DESC LIMIT $1 
		OFFSET $2`,
		db.TableName_SchedulingProjects,
		db.TableName_users_details,
	)

	offset := dataReq.PageSize * (dataReq.PageNumber - 1)

	schedulingProjectsRecords, err = db.ReteriveFromDB(db.OweHubDbIndex, schedulingProjectsQuery, []interface{}{dataReq.PageSize, offset})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve SalesRep scheduling projects from DB err: %v", err)
		FormAndSendHttpResp(resp, "Failed to retrieve records", http.StatusInternalServerError, nil)
		return
	}

	apiResp.SchedulingList = []models.GetSchedulingProjects{}

	for _, record := range schedulingProjectsRecords {
		// First Name
		firstName, ok := record["first_name"].(string)
		if !ok || firstName == "" {
			log.FuncErrorTrace(0, "Failed to get first name for Record: %v", record)
			continue
		}

		// Last Name
		lastName, ok := record["last_name"].(string)
		if !ok || lastName == "" {
			log.FuncErrorTrace(0, "Failed to get last name for Record: %v", record)
			continue
		}

		// Email
		email, ok := record["email"].(string)
		if !ok || email == "" {
			log.FuncErrorTrace(0, "Failed to get email for Record: %v", record)
			continue
		}

		// Sales Rep Name
		salesRepName, ok := record["sales_rep_name"].(string)
		if !ok || salesRepName == "" {
			log.FuncErrorTrace(0, "Failed to get sales rep name for Record: %v", record)
			continue
		}

		// Phone
		phone, ok := record["phone"].(string)
		if !ok || phone == "" {
			log.FuncErrorTrace(0, "Failed to get phone for Record: %v", record)
			phone = ""
		}

		// Address
		address, ok := record["address"].(string)
		if !ok || address == "" {
			log.FuncErrorTrace(0, "Failed to get address for Record: %v", record)
			address = ""
		}

		// Roof Type
		roofType, ok := record["roof_type"].(string)
		if !ok || roofType == "" {
			log.FuncErrorTrace(0, "Failed to get roof type for Record: %v", record)
			roofType = ""
		}

		// System Size
		systemSize, ok := record["system_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get system size for Record: %v", record)
			systemSize = 0.0
		}

		apiResp.SchedulingList = append(apiResp.SchedulingList, models.GetSchedulingProjects{
			FirstName:    firstName,
			LastName:     lastName,
			Email:        email,
			Phone:        phone,
			Address:      address,
			RoofType:     roofType,
			SystemSize:   systemSize,
			SalesRepName: salesRepName,
		})
	}

	log.FuncBriefTrace(0, "%d SalesRep scheduling projects fetched %+v", len(apiResp.SchedulingList), apiResp.SchedulingList)
	FormAndSendHttpResp(resp, "Scheduling projects retrieved successfully", http.StatusOK, apiResp)
}
