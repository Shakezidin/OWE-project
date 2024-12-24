/**************************************************************************
 * File       	   : apiSummaryReport.go
 * DESCRIPTION     : This file contains functions to get summary report
 * DATE            : 2-Dec-2024
 **************************************************************************/

package services

import (
    "OWEApp/shared/appserver"
    log "OWEApp/shared/logger"
    models "OWEApp/shared/models"
    "strings"
    "time"
    "fmt"
    "io/ioutil"
    "net/http"
    "encoding/json"
    "math/rand"
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

    // Generate random data for each week (for tables on the left )......1-52
    rand.Seed(time.Now().UnixNano())
    generateWeeklyData := func() []models.WeeklyData {
        var weeklyData []models.WeeklyData
        for week := 1; week <= 52; week++ {
            officeData := map[string]float64{
                "Peoria/Kingman":      rand.Float64() * 1000,
                "Tucson":              rand.Float64() * 200,
                "Colorado":            rand.Float64() * 100,
                "Albuquerque/El Paso": rand.Float64() * 200,
                "Tempe":               rand.Float64() * 50,
                "Texas":               rand.Float64() * 100,
                "#N/A":                rand.Float64() * 100,
            }
            weeklyData = append(weeklyData, models.WeeklyData{
                Week:       week,
                OfficeData: officeData,
            })
        }
        return weeklyData
    }

    // Generate random data for the bar graph ....cases ::::  pending_installs : pending_battery : pending_service : pending_mpu : pending_derate
    generateBarGraphData := func(reportType string) interface{} {
        offices := []string{"Peoria/Kingman", "Tucson", "Colorado", "Albuquerque/El Paso", "Tempe", "Texas", "#N/A"}
        switch reportType {
        case "pending_installs":
            var barGraphData []models.PendingInstallsBarGraphData
            for _, office := range offices {
                barGraphData = append(barGraphData, models.PendingInstallsBarGraphData{
                    Office:                        office,
                    CompletedPendingCompletionPhotos: rand.Float64() * 100,
                    PendingMaterial:               rand.Float64() * 100,
                    PendingHOA:                    rand.Float64() * 100,
                    PendingCustomerShaky:          rand.Float64() * 100,
                    PendingScheduling:             rand.Float64() * 100,
                    PendingDesignChange:           rand.Float64() * 100,
                    PendingChangeOrder:            rand.Float64() * 100,
                    PendingReschedule:             rand.Float64() * 100,
                    PendingAHJ:                    rand.Float64() * 100,
                    PendingCompletion:             rand.Float64() * 100,
                    CompletedDay2_3:               rand.Float64() * 100,
                })
            }
            return barGraphData
        case "pending_battery":
            var barGraphData []models.PendingBatteryBarGraphData
            for _, office := range offices {
                barGraphData = append(barGraphData, models.PendingBatteryBarGraphData{
                    Office:                        office,
                    NewProjectPendingPermits:      rand.Intn(100),
                    ReadyToSchedule:               rand.Intn(100),
                    Scheduled:                     rand.Intn(100),
                    PreWorkScheduled:              rand.Intn(100),
                    BatteryInstalledReturnTripRequired: rand.Intn(100),
                    PrepWorkNeeded:                rand.Intn(100),
                })
            }
            return barGraphData
        case "pending_service":
            var barGraphData []models.PendingServiceBarGraphData
            for _, office := range offices {
                barGraphData = append(barGraphData, models.PendingServiceBarGraphData{
                    Office:                        office,
                    Scheduled:                     rand.Intn(100),
                    Rescheduled:                   rand.Intn(100),
                    PendingAction:                 rand.Intn(100),
                    Opened:                        rand.Intn(100),
                    ReturnTripRequired:            rand.Intn(100),
                    ReadyToSchedule:               rand.Intn(100),
                    CompletedDay1_2:               rand.Intn(100),
                    OnSite:                        rand.Intn(100),
                })
            }
            return barGraphData
        case "pending_mpu":
            var barGraphData []models.PendingMPUBarGraphData
            for _, office := range offices {
                barGraphData = append(barGraphData, models.PendingMPUBarGraphData{
                    Office:                        office,
                    Scheduled:                     rand.Intn(100),
                    Opened:                        rand.Intn(100),
                    Rescheduled:                   rand.Intn(100),
                    PendingAction:                 rand.Intn(100),
                    ReturnTripRequired:            rand.Intn(100),
                    ReadyToSchedule:               rand.Intn(100),
                    OnSite:                        rand.Intn(100),
                })
            }
            return barGraphData
        case "pending_derate":
            var barGraphData []models.PendingDerateBarGraphData
            for _, office := range offices {
                barGraphData = append(barGraphData, models.PendingDerateBarGraphData{
                    Office:                        office,
                    Scheduled:                     rand.Intn(100),
                    QuoteRequested:                rand.Intn(100),
                    PendingPermittingICApproval:   rand.Intn(100),
                    OrderPurchasedPendingDelivery: rand.Intn(100),
                    PendingScheduling:             rand.Intn(100),
                    OnHoldPendingCustomer:         rand.Intn(100),
                })
            }
            return barGraphData
        }
        return nil
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
            WeeklyData: generateWeeklyData(),
        })
        subReports = append(subReports, models.ProductionSummarySubReport{
            SubReportName: "Install Fix Scheduled",
            Fields:        []string{"Office", "System Size"},
            Data:          []map[string]interface{}{},
            WeeklyData:    generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
        })
        subReports = append(subReports, models.ProductionSummarySubReport{
            SubReportName: "Install Fix Completed",
            Fields:        []string{"Office", "System Size", "Customer", "Active Install Team", "Average System Size"},
            Data:          []map[string]interface{}{},
            WeeklyData:    generateWeeklyData(),
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
            //WeeklyData: generateWeeklyData(),
            BarGraphData: generateBarGraphData("pending_installs"),
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
            WeeklyData: generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
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
            //WeeklyData: generateWeeklyData(),
            BarGraphData: generateBarGraphData("pending_battery"),
        })
        // subReports = append(subReports, models.ProductionSummarySubReport{
        //     SubReportName: "Service Scheduled",
        //     Fields:        []string{"Office", "Customer"},
        //     Data: []map[string]interface{}{
        //         {"Office": "Peoria/Kingman", "Customer": 67},
        //         {"Office": "Tucson", "Customer": 40},
        //         {"Office": "Colorado", "Customer": 34},
        //         {"Office": "Albuquerque/El Paso", "Customer": 31},
        //         {"Office": "Tempe", "Customer": 20},
        //         {"Office": "Texas", "Customer": 17},
        //         {"Office": "#N/A", "Customer": 10},
        //     },
        //     WeeklyData: generateWeeklyData(),
        // })
        // subReports = append(subReports, models.ProductionSummarySubReport{
        //     SubReportName: "Service Completed",
        //     Fields:        []string{"Office", "Customer"},
        //     Data: []map[string]interface{}{
        //         {"Office": "Peoria/Kingman", "Customer": 49},
        //         {"Office": "Tucson", "Customer": 37},
        //         {"Office": "Albuquerque/El Paso", "Customer": 30},
        //         {"Office": "Colorado", "Customer": 17},
        //         {"Office": "Tempe", "Customer": 11},
        //         {"Office": "#N/A", "Customer": 8},
        //         {"Office": "Texas", "Customer": 6},
        //     },
        //     WeeklyData: generateWeeklyData(),
        // })


				case "service":
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
						WeeklyData: generateWeeklyData(),
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
						WeeklyData: generateWeeklyData(),
					})
					subReports = append(subReports, models.ProductionSummarySubReport{
						SubReportName: "Pending Service",
						Fields: []string{
							"Office", "System Activation", "AR Fix", "Advanced Troubleshooting and Fix", "Install Fix", "Null", "RMA",
							"Drywall/Stucco Repair", "Commission", "Pre-lim Troubleshooting and Fix", "FIN Fix", "PTO Fix", "Photos",
							"Tie In", "Equipment Relocation/Replacement", "CT Install", "Tile Replacement", "Minor Electrical",
							"Battery Commissionings", "Tesla Powerwall Troubleshooting", "Misc Service", "Roof Leak", "Plans/Permit/Labelling",
							"EV Charger", "Emergency Electrical", "Breaker Replacement", "Power Outage", "Panel Replaced", "Conduit Painting",
							"System Removal",
						},
						Data: []map[string]interface{}{
							{"Office": "#N/A", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
							{"Office": "Tempe", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
							{"Office": "Colorado", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
							{"Office": "Tucson", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
							{"Office": "Texas", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
							{"Office": "Albuquerque/El Paso", "System Activation": rand.Intn(10), "AR Fix": rand.Intn(10), "Advanced Troubleshooting and Fix": rand.Intn(10), "Install Fix": rand.Intn(10), "Null": rand.Intn(10), "RMA": rand.Intn(10), "Drywall/Stucco Repair": rand.Intn(10), "Commission": rand.Intn(10), "Pre-lim Troubleshooting and Fix": rand.Intn(10), "FIN Fix": rand.Intn(10), "PTO Fix": rand.Intn(10), "Photos": rand.Intn(10), "Tie In": rand.Intn(10), "Equipment Relocation/Replacement": rand.Intn(10), "CT Install": rand.Intn(10), "Tile Replacement": rand.Intn(10), "Minor Electrical": rand.Intn(10), "Battery Commissionings": rand.Intn(10), "Tesla Powerwall Troubleshooting": rand.Intn(10), "Misc Service": rand.Intn(10), "Roof Leak": rand.Intn(10), "Plans/Permit/Labelling": rand.Intn(10), "EV Charger": rand.Intn(10), "Emergency Electrical": rand.Intn(10), "Breaker Replacement": rand.Intn(10), "Power Outage": rand.Intn(10), "Panel Replaced": rand.Intn(10), "Conduit Painting": rand.Intn(10), "System Removal": rand.Intn(10)},
						},
						//WeeklyData: generateWeeklyData(),
						BarGraphData: generateBarGraphData("pending_service"),
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
            WeeklyData: generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
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
            //WeeklyData: generateWeeklyData(),
            BarGraphData: generateBarGraphData("pending_mpu"),
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
            WeeklyData: generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
        })
        subReports = append(subReports, models.ProductionSummarySubReport{
            SubReportName: "Pending Derate",
            Fields:        []string{"Office", "Customer"},
            Data: []map[string]interface{}{
                {"Office": "Tucson", "Customer": 1},
                {"Office": "Peoria/Kingman", "Customer": 5},
                {"Office": "Albuquerque/El Paso", "Customer": 1},
            },
            WeeklyData: generateWeeklyData(),
            BarGraphData: generateBarGraphData("pending_derate"),
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
            WeeklyData: generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
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
            WeeklyData: generateWeeklyData(),
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
