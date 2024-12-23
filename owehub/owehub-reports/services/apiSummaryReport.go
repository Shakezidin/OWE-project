/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
 * DATE            : 22-Dec-2024
 **************************************************************************/

 package services

 import (
		 "OWEApp/shared/appserver"
		 log "OWEApp/shared/logger"
		 models "OWEApp/shared/models"
		 "strings"

		 "encoding/json"
		 "fmt"
		 "io/ioutil"
		 "net/http"
 )

 /******************************************************************************
	* FUNCTION:		HandleGetProductionSummaryReportRequest
	* DESCRIPTION:     handler for get Dealer pay commissions data request
	* INPUT:			resp, req
	* RETURNS:    		void
	******************************************************************************/
 func HandleGetProductionSummaryReportRequest(resp http.ResponseWriter, req *http.Request) {
		 var (
				 err               error
				 dataReq           models.ProductionSummaryReportRequest
				 RecordCount       int
				 summaryReportResp models.ProductionSummaryReportResponse
		 )

		 log.EnterFn(0, "HandleGetProductionSummaryReportRequest")
		 defer func() { log.ExitFn(0, "HandleGetProductionSummaryReportRequest", err) }()

		 if req.Body == nil {
				 err = fmt.Errorf("HTTP Request body is null in get dealer pay commissions data request")
				 log.FuncErrorTrace(0, "%v", err)
				 appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
				 return
		 }

		 reqBody, err := ioutil.ReadAll(req.Body)
		 if err != nil {
				 log.FuncErrorTrace(0, "Failed to read HTTP Request body from get dealer pay commissions data request err: %v", err)
				 appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
				 return
		 }

		 err = json.Unmarshal(reqBody, &dataReq)
		 if err != nil {
				 log.FuncErrorTrace(0, "Failed to unmarshal get dealer pay commissions data request err: %v", err)
				 appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get dealer pay commissions data Request body", http.StatusBadRequest, nil)
				 return
		 }

		 // After reading & unmarshaling dataReq, add logic to build a unified response:
		 summaryReportResp.ReportType = dataReq.ReportType
		 summaryReportResp.Year = dataReq.Year
		 summaryReportResp.Week = dataReq.Week
		 summaryReportResp.Day = dataReq.Day

		 var subReports []models.ProductionSummarySubReport

		 switch strings.ToLower(dataReq.ReportType) {
		 case "install":
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Install Scheduled",
						 Fields:        []string{"Office", "Scheduled-kW"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "Scheduled-kW": 44},
								 {"Office": "Texas", "Scheduled-kW": 213.97},
								 {"Office": "Tempe", "Scheduled-kW": 66.64},
								 {"Office": "Peoria/Kingman", "Scheduled-kW": 246.89},
								 {"Office": "Colorado", "Scheduled-kW": 164.45},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Install Fix Scheduled",
						 Fields:        []string{"Office", "System Size"},
						 Data:          []map[string]interface{}{}, // No data
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Install Completed",
						 Fields:        []string{"Office", "System Size", "Customer", "Active Install Team", "Average System Size"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "System Size": 44.6, "Customer": 3, "Active Install Team": 3, "Average System Size": 14.87},
								 {"Office": "Texas", "System Size": 132.92, "Customer": 15, "Active Install Team": 6, "Average System Size": 9.49},
								 {"Office": "Tempe", "System Size": 77.94, "Customer": 10, "Active Install Team": 8, "Average System Size": 7.79},
								 {"Office": "Peoria/Kingman", "System Size": 266.15, "Customer": 24, "Active Install Team": 13, "Average System Size": 11.09},
								 {"Office": "Colorado", "System Size": 180.61, "Customer": 25, "Active Install Team": 10, "Average System Size": 8.21},
								 {"Office": "Albuquerque/El Paso", "System Size": 64.4, "Customer": 9, "Active Install Team": 5, "Average System Size": 7.16},
								 {"Office": "#N/A", "System Size": 205.68, "Customer": 25, "Active Install Team": 18, "Average System Size": 8.94},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Install Fix Completed",
						 Fields:        []string{"Office", "System Size", "Customer", "Active Install Team", "Average System Size"},
						 Data:          []map[string]interface{}{}, // No data
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Pending Installs",
						 Fields:        []string{"Office", "System Size"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "System Size": 302.73},
								 {"Office": "Texas", "System Size": 376.1},
								 {"Office": "Tempe", "System Size": 282.14},
								 {"Office": "Peoria/Kingman", "System Size": 766.97},
								 {"Office": "Colorado", "System Size": 425.02},
								 {"Office": "Albuquerque/El Paso", "System Size": 505.24},
								 {"Office": "#N/A", "System Size": 175.21},
						 },
				 })

		 case "battery":
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Battery Scheduled",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Colorado", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 4},
								 {"Office": "Tempe", "Customer": 3},
								 {"Office": "Texas", "Customer": 2},
								 {"Office": "#N/A", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 9},
								 {"Office": "Texas", "Customer": 7},
								 {"Office": "Tucson", "Customer": 6},
								 {"Office": "Albuquerque/El Paso", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Battery Completed",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "Customer": 6},
								 {"Office": "Texas", "Customer": 5},
								 {"Office": "Tempe", "Customer": 4},
								 {"Office": "Colorado", "Customer": 4},
								 {"Office": "#N/A", "Customer": 2},
								 {"Office": "Tucson", "Customer": 1},
								 {"Office": "Albuquerque/El Paso", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Pending Battery",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "#N/A", "Customer": 250},
								 {"Office": "Peoria/Kingman", "Customer": 241},
								 {"Office": "Tempe", "Customer": 98},
								 {"Office": "Tucson", "Customer": 95},
								 {"Office": "Texas", "Customer": 80},
								 {"Office": "Colorado", "Customer": 27},
								 {"Office": "Albuquerque/El Paso", "Customer": 8},
								 {"Office": "null", "Customer": 0},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Service Scheduled",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "Customer": 67},
								 {"Office": "Tucson", "Customer": 40},
								 {"Office": "Colorado", "Customer": 34},
								 {"Office": "Albuquerque/El Paso", "Customer": 31},
								 {"Office": "Tempe", "Customer": 20},
								 {"Office": "Texas", "Customer": 17},
								 {"Office": "#N/A", "Customer": 10},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Service Completed",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "Customer": 49},
								 {"Office": "Tucson", "Customer": 37},
								 {"Office": "Albuquerque/El Paso", "Customer": 30},
								 {"Office": "Colorado", "Customer": 17},
								 {"Office": "Tempe", "Customer": 11},
								 {"Office": "#N/A", "Customer": 8},
								 {"Office": "Texas", "Customer": 6},
						 },
				 })

		 case "mpu":
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "MPU Scheduled",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Colorado", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 15},
								 {"Office": "Tempe", "Customer": 7},
								 {"Office": "Colorado", "Customer": 6},
								 {"Office": "Albuquerque/El Paso", "Customer": 4},
								 {"Office": "Texas", "Customer": 2},
								 {"Office": "Tucson", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "MPU Completed",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "Customer": 17},
								 {"Office": "Colorado", "Customer": 7},
								 {"Office": "Tempe", "Customer": 7},
								 {"Office": "Albuquerque/El Paso", "Customer": 4},
								 {"Office": "Texas", "Customer": 2},
								 {"Office": "Tucson", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Pending MPU",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "Customer": 107},
								 {"Office": "Texas", "Customer": 43},
								 {"Office": "Tempe", "Customer": 74},
								 {"Office": "Peoria/Kingman", "Customer": 182},
								 {"Office": "Colorado", "Customer": 71},
								 {"Office": "Albuquerque/El Paso", "Customer": 33},
								 {"Office": "#N/A", "Customer": 16},
						 },
				 })

		 case "derate":
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Derate Scheduled",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "Customer": 2},
								 {"Office": "Albuquerque/El Paso", "Customer": 1},
								 {"Office": "Tucson", "Customer": 1},
								 {"Office": "Tempe", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 1},
								 {"Office": "#N/A", "Customer": 1},
								 {"Office": "Tempe", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Derate Completed",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "Customer": 1},
								 {"Office": "Tempe", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 2},
								 {"Office": "Albuquerque/El Paso", "Customer": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Pending Derate",
						 Fields:        []string{"Office", "Customer"},
						 Data: []map[string]interface{}{
								 {"Office": "Tucson", "Customer": 1},
								 {"Office": "Peoria/Kingman", "Customer": 5},
								 {"Office": "Albuquerque/El Paso", "Customer": 1},
						 },
				 })

		 case "der/lst/sub-panel":
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "DER/LST Scheduled",
						 Fields:        []string{"Office", "Scheduled"},
						 Data: []map[string]interface{}{
								 {"Office": "Tempe", "Scheduled": 4},
								 {"Office": "Peoria/Kingman", "Scheduled": 5},
								 {"Office": "Colorado", "Scheduled": 2},
								 {"Office": "Tucson", "Scheduled": 2},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "DER/LST Completed",
						 Fields:        []string{"Office", "Completed"},
						 Data: []map[string]interface{}{
								 {"Office": "Tempe", "Completed": 5},
								 {"Office": "Peoria/Kingman", "Completed": 2},
								 {"Office": "Colorado", "Completed": 1},
								 {"Office": "Tucson", "Completed": 1},
						 },
				 })
				 subReports = append(subReports, models.ProductionSummarySubReport{
						 SubReportName: "Pending DER/LST",
						 Fields:        []string{"Office", "New Project", "Scheduled", "DER Dropped", "Pending Utility", "Pending DER Drop Off", "Work Being Done With MPU"},
						 Data: []map[string]interface{}{
								 {"Office": "Peoria/Kingman", "New Project": 25, "Scheduled": 15, "DER Dropped": 20, "Pending Utility": 10, "Pending DER Drop Off": 15, "Work Being Done With MPU": 20},
								 {"Office": "Tempe", "New Project": 30, "Scheduled": 20, "DER Dropped": 25, "Pending Utility": 15, "Pending DER Drop Off": 20, "Work Being Done With MPU": 25},
								 {"Office": "Tucson", "New Project": 35, "Scheduled": 25, "DER Dropped": 30, "Pending Utility": 20, "Pending DER Drop Off": 25, "Work Being Done With MPU": 30},
								 {"Office": "Albuquerque/El Paso", "New Project": 40, "Scheduled": 30, "DER Dropped": 35, "Pending Utility": 25, "Pending DER Drop Off": 30, "Work Being Done With MPU": 35},
								 {"Office": "Colorado", "New Project": 45, "Scheduled": 35, "DER Dropped": 40, "Pending Utility": 30, "Pending DER Drop Off": 35, "Work Being Done With MPU": 40},
								 {"Office": "Texas", "New Project": 50, "Scheduled": 40, "DER Dropped": 45, "Pending Utility": 35, "Pending DER Drop Off": 40, "Work Being Done With MPU": 45},
								 {"Office": "#N/A", "New Project": 55, "Scheduled": 45, "DER Dropped": 50, "Pending Utility": 40, "Pending DER Drop Off": 45, "Work Being Done With MPU": 50},
						 },
				 })

		 default:
				 err = fmt.Errorf("unknown report type: %s", dataReq.ReportType)
				 log.FuncErrorTrace(0, "%v", err)
				 appserver.FormAndSendHttpResp(resp, "Unknown report type", http.StatusBadRequest, nil)
				 return
		 }

		 summaryReportResp.SubReports = subReports

		 appserver.FormAndSendHttpResp(
				 resp,
				 "Production summary report data",
				 http.StatusOK,
				 summaryReportResp,
				 int64(RecordCount),
		 )
 }