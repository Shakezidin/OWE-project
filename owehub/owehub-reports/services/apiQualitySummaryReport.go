/**************************************************************************
* File                  : apiQualitySummaryReport.go
* DESCRIPTION           : This file contains functions to get quality summary reports on weekly basis

* DATE                  : 23-december-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"
	"net/http"
	"time"
)

/******************************************************************************
* FUNCTION:		    HandleGetQualitySummaryReportRequest
* DESCRIPTION:      handler for quality summary data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetQualitySummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.QualitySummaryReportRequest
		apiResponse models.QualitySummaryReportRequestResponse
		// data         []map[string]interface{}
		// query        string
		// whereEleList []interface{}
		// whereClause  string
	)

	log.EnterFn(0, "HandleGetQualitySummaryReportRequest")

	defer func() { log.ExitFn(0, "HandleGetQualitySummaryReportRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in quality Summary data request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from quality summary report data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal quality summary report data request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal quality summary report data Request body", http.StatusInternalServerError, nil)
		return
	}

	// Hardcoded values
	report := models.QualitySummaryReportRequestResponse{
		Metrics: []models.ResponseMetric{
			{
				Type:  "fin",
				Title: "finApproved",
				Total: "",
				Items: map[string]interface{}{
					"Peoria/kingman":      32,
					"Tempe":               10,
					"Tucson":              7,
					"Albuquerque/El Paso": 11,
					"Texas":               9,
					"Colarado":            27,
					"Overall":             96,
				},
			},
			{
				Type:  "fin",
				Title: "finPassRate",
				Total: "",
				Items: map[string]interface{}{
					"PassRate - Peoria/k..": "89%",
					"PassRate - Tempe":      "100%",
					"PassRate - Tucson":     "78%",
					"PassRate - Albuquer..": "92%",
					"PassRate - Texas":      "90%",
					"PassRate - Colorado":   "51%",
					"Overall":               "72.73%",
				},
			},

			{
				Type:  "fin",
				Title: "finpending",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office", "App Status", "Pending"},
						Rows: [][]string{
							{"N/A", "Pending Ad..", "0"},
							{"N/A", "Audit Compl..", "0"},
							{"Albuquerque", "Pending Cor", "2"},
							{"Albuquerque", "Pending Audit", "0"},
							{"Albuquerque", "Audit Compl", "1"},
						},
					},
				},
			},

			{
				Type:  "fin",
				Title: "finFailed",
				Total: "",
				Items: map[string]interface{}{
					"Peoria/kingman":      32,
					"Tempe":               10,
					"Tucson":              7,
					"Albuquerque/El Paso": 11,
					"Texas":               9,
					"Colarado":            27,
					"Overall":             96,
				},
			},

			{
				Type:  "fin",
				Title: "finSourceOfFail",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Customer Unique Id", "Source of fail", "Employee Responsible", "finRedlineReason", "Customer"},
						Rows: [][]string{
							{"Albuequerque/..", "OUR2912", "-", "-", "-", "1"},
							{"Colorado", "OUR28632", "-", "-", "-", "1"},
							{"Colorado", "OUR31066", "-", "-", "-", "1"},
							{"Colorado", "OUR31705", "-", "-", "-", "1"},
							{"Colorado", "OUR30576", "-", "-", "-", "1"},
						},
					},
				},
			},

			// PTO
			{
				Type:  "pto",
				Title: "ptoGranted",
				Total: "",
				Items: map[string]interface{}{
					"Peoria/kingman":      32,
					"Tempe":               10,
					"Tucson":              7,
					"Albuquerque/El Paso": 11,
					"Texas":               9,
					"Colarado":            27,
					"Overall":             96,
				},
			},

			{
				Type:  "pto",
				Title: "ptoFailed",
				Total: "",
				Items: map[string]interface{}{
					"Peoria/kingman":      32,
					"Tempe":               10,
					"Tucson":              7,
					"Albuquerque/El Paso": 11,
					"Texas":               9,
					"Colarado":            27,
					"Overall":             96,
				},
			},
			{
				Type:  "pto",
				Title: "ptoPassRate",
				Total: "",
				Items: map[string]interface{}{
					"PassRate - Peoria/k..": "89%",
					"PassRate - Tempe":      "100%",
					"PassRate - Tucson":     "78%",
					"PassRate - Albuquer..": "92%",
					"PassRate - Texas":      "90%",
					"PassRate - Colorado":   "51%",
					"Overall":               "72.73%",
				},
			},
			{
				Type:  "pto",
				Title: "ptoPending",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Pto App Status", "Pending"},
						Rows: [][]string{
							{"Albuquerque/El", "Pending ", "0"},
							{"Albuquerque/El", "Pending", "0"},
							{"Albuquerque/El", "Pto over", "2"},
							{"Albuquerque/El", "Pending Ic", "0"},
							{"Albuquerque/El", "Pending", "1"},
						},
					},
				},
			},
			{
				Type:  "pto",
				Title: "ptoSourceOfFail",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Customer Unique Id", "Source of fail", "Employee Responsible", "finRedlineReason", "Customer"},
						Rows: [][]string{
							{"Colorado/..", "OUR2912", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR28632", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR31066", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR31705", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR30576", "-", "-", "-", "1"},
						},
					},
				},
			},

			// install funding

			{
				Type:  "install funding",
				Title: "installFunding-Approved",
				Total: "",
				Items: map[string]interface{}{
					"Colorado":       32,
					"Peoria/Kingman": 10,
					"Tempe":          7,
					"Texas":          9,
					"Tucson":         27,
					"GrandTotal":     96,
				},
			},

			{
				Type:  "install funding",
				Title: "installFunding-Redlined",
				Total: "",
				Items: map[string]interface{}{
					"Albuquerque/El Paso": 11,
					"Colarado":            27,
					"Peoria/kingman":      32,
					"Tempe":               10,
					"Tucson":              7,
					"GrandTotal":          96,
				},
			},
			{
				Type:  "install funding",
				Title: "installFunding-Pending",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Customer Unique Id", "App Status", "Customer"},
						Rows: [][]string{
							{"Albuquerque/El", "OUR2912", "Changed to New Status", "1"},
							{"Albuquerque/El", "OUR29112", "Changed to New Status", "1"},
							{"Albuquerque/El", "OUR29122", "Inactive", "1"},
							{"Albuquerque/El", "OUR22912", "Inactive", "1"},
							{"Colorado", "OUR22912", "Changed to New Statu", "1"},
						},
					},
				},
			},
			{
				Type:  "install funding",
				Title: "installFunding-SourceOfFail",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Customer Unique Id", "Source of fail", "Employee Responsible", "redlineReason", "Customer"},
						Rows: [][]string{
							{"Albuquerque/Paso..", "OUR2912", "-", "-", "-", "1"},
							{"Colorado", "OUR28632", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR31066", "-", "-", "-", "1"},
							{"Peoria/Kingm..", "OUR31705", "install", "-", "-", "1"},
							{"Tempe", "OUR30576", "-", "-", "-", "1"},
						},
					},
				},
			},

			// final funding
			{
				Type:  "final funding",
				Title: "finalFunding-Approved",
				Total: "",
				Items: map[string]interface{}{
					"Albuquerque/Paso": 32,
					"Colorado":         10,
					"Peoria/Kingman":   27,
					"Tempe":            7,
					"Texas":            9,
					"GrandTotal":       96,
				},
			},

			{
				Type:  "install funding",
				Title: "installFunding-Pending",
				Total: "",
				Items: map[string]interface{}{
					"table_item_1": models.TableItem{
						Headers: []string{"Office(2)", "Customer Unique Id", "App Status", "Customer"},
						Rows: [][]string{
							{"Albuquerque/El", "OUR2912", "Changed to New Status", "1"},
							{"Albuquerque/El", "OUR29112", "Changed to New Status", "1"},
							{"Albuquerque/El", "OUR29122", "Inactive", "1"},
							{"Albuquerque/El", "OUR22912", "Inactive", "1"},
							{"Colorado", "OUR22912", "Changed to New Statu", "1"},
						},
					},
				},
			},
		},
	}

	//////////// for charts ..........///////////////////////////////////////

	// Populate the ResponseChart with 52 weeks of data
	chart := models.ResponseChart{
		Title: "Fin Approved Weekly",
		//Weeks: [][]models.WeekData{}, // Initialize as an empty slice
		Weeks: make([][]models.WeekData, 0), // Initialize as an empty slice

	}

	// Seed the random number generator
	rand.Seed(time.Now().UnixNano())

	// Create a temporary slice to hold 52 weeks' data
	var allWeeks []models.WeekData

	// Loop through the 52 weeks and add data
	for i := 1; i <= 52; i++ {
		// Generate data for each column with some variation week to week
		week := models.WeekData{
			WeekNumber:                i,
			PeoriaKingmanApproved:     rand.Intn(50) + 5,  // Random number between 5 and 55
			TempeApproved:             rand.Intn(30),      // Random number between 0 and 30
			TucsonApproved:            rand.Intn(25) + 5,  // Random number between 5 and 30
			AlbuquerqueEIPasoApproved: rand.Intn(45) + 10, // Random number between 10 and 55
			TexasApproved:             rand.Intn(20),      // Random number between 0 and 20
			ColoradoApproved:          rand.Intn(15),      // Random number between 0 and 15
		}

		log.FuncDebugTrace(0, "printing the values of charts %v", week)

		// Add some logic to slightly change values for each subsequent week
		week.PeoriaKingmanApproved += rand.Intn(5) - 2 // Slight fluctuation
		week.TempeApproved += rand.Intn(5) - 2
		week.TucsonApproved += rand.Intn(5) - 2
		week.AlbuquerqueEIPasoApproved += rand.Intn(5) - 2
		week.TexasApproved += rand.Intn(5) - 2
		week.ColoradoApproved += rand.Intn(5) - 2

		// Add the week data to the allWeeks slice
		allWeeks = append(allWeeks, week)
	}

	// Dynamically append the allWeeks data multiple times
	numOfWeeksSets := 6 // This could be dynamically calculated or determined by other factors
	for i := 0; i < numOfWeeksSets; i++ {
		// Append the allWeeks data to the Weeks slice
		chart.Weeks = append(chart.Weeks, allWeeks)
	}

	// Append the chart (multiple 52 weeks data sets) to the apiResponse
	apiResponse.Charts = append(apiResponse.Charts, chart)

	// // Serialize the response to JSON for the HTTP response body
	// jsonData, err := json.MarshalIndent(apiResponse.Charts, "", "  ")
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to marshal Chart data: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Error marshaling Chart data", http.StatusInternalServerError, nil)
	// 	return
	// }

	// For debugging: print the apiResponse
	// You can format this to make it more readable for output or JSON response.
	fmt.Printf("%+v\n", apiResponse)

	appserver.FormAndSendHttpResp(resp, "Metrics Data", http.StatusOK, report, 0)
	appserver.FormAndSendHttpResp(resp, "Chart Data", http.StatusOK, apiResponse.Charts, 0)
	//appserver.FormAndSendHttpResp(resp, "Chart Data", http.StatusOK, jsonData, 0)

}
