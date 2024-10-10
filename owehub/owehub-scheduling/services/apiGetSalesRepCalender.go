/**************************************************************************
 * File       	   : apiGetSalesRepCalender.go
 * DESCRIPTION		 : This file contains Filter Operation Mapping handler
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"net/http"
)

func HandleGetSalesRepCalenderRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err error
	)

	dummyResponse := models.CalendarResponse{
		CustomerEmail: "axy@pqr.com",
		Details: []models.CalendarDay{
			{
				Date:      "2024-10-10",
				ColorCode: "#FF5733",
				AvailableTimeSlots: []string{
					"3:30 pm - 4:30 pm",
					"5:30 pm - 6:30 pm",
					"7:00 pm - 8:00 pm",
				},
			},
			{
				Date:      "2024-10-11",
				ColorCode: "#33FF57",
				AvailableTimeSlots: []string{
					"9:00 am - 10:00 am",
					"1:00 pm - 2:00 pm",
					"4:00 pm - 5:00 pm",
				},
			},
		},
	}

	if err != nil {
		log.FuncErrorTrace(0, "%v", err)
	}

	log.FuncBriefTrace(0, "%d SalesRep scheduling days fetched", len(dummyResponse.Details))
	FormAndSendHttpResp(resp, "Scheduling projects retrieved successfully", http.StatusOK, dummyResponse)
}
