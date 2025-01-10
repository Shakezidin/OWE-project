/**************************************************************************
 * File       	   : apiReportTarget.go
 * DESCRIPTION     : This file contains functions to get report Target data
 * DATE            : 08-Jan-2025
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:		HandleReportsTargetListRequest
 * DESCRIPTION:     handler for get reports Target data
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleReportsTargetListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.GetReportsTargetReq
		// data           []map[string]interface{}
		apiResp        models.GetReportsTargetResp
		requestedMonth time.Time
	)

	log.EnterFn(0, "HandleReportsTargetListRequest")
	defer func() { log.ExitFn(0, "HandleReportsTargetListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal HTTP Request Body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal HTTP Request Body", http.StatusBadRequest, nil)
		return
	}

	requestedMonth, err = time.Parse("January", dataReq.Month)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse month err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid month provided", http.StatusBadRequest, nil)
		return
	}

	log.FuncDebugTrace(0, "Requested Month: %v", requestedMonth.Format("1"))

	// Return Dummy Data For Now
	apiResp.Summary = map[string]models.GetReportsTargetRespSummaryItem{
		"Projects Sold": {
			Target:            26780,
			Achieved:          18250,
			LastMonthAcheived: 100,
		},
		"mW Sold": {
			Target:            110.10,
			Achieved:          214.93129312,
			LastMonthAcheived: 109.9912133899,
		},
		"Install Ct": {
			Target:            11250,
			Achieved:          12500,
			LastMonthAcheived: 70,
		},
		"mW Installed": {
			Target:            8901.21,
			Achieved:          10000,
			LastMonthAcheived: 90,
		},
		"Batteries Ct": {
			Target:            3100,
			Achieved:          5000,
			LastMonthAcheived: 100,
		},
	}

	// fill dummy values but accurate percentages
	apiResp.Progress = map[string]models.GetReportsTargetRespProgressItem{
		"Projects Sold": {
			Target:             26780,
			Achieved:           18250,
			PercentageAchieved: (18250 / 26780) * 100,
		},
		"mW Sold": {
			Target:             110.10,
			Achieved:           214.93129312,
			PercentageAchieved: (214.93129312 / 110.10) * 100,
		},
		"Install Ct": {
			Target:             11250,
			Achieved:           12500,
			PercentageAchieved: (12500 / 11250) * 100,
		},
		"mW Installed": {
			Target:             8901.21,
			Achieved:           10000,
			PercentageAchieved: (10000 / 8901.21) * 100,
		},
		"Batteries Ct": {
			Target:             3100,
			Achieved:           5000,
			PercentageAchieved: (5000 / 3100) * 100,
		},
	}

	apiResp.MonthlyOverview = map[string][]models.GetReportsTargetRespMonthlyItem{
		"Projects Sold": {
			{
				Month:    "Jan",
				Target:   26780,
				Achieved: 18250,
			},
			{
				Month:    "Feb",
				Target:   24000,
				Achieved: 20000,
			},
			{
				Month:    "Mar",
				Target:   32000,
				Achieved: 33000,
			},
			{
				Month:    "Apr",
				Target:   36000,
				Achieved: 40000,
			},
			{
				Month:    "May",
				Target:   40000,
				Achieved: 20000,
			},
		},
		"mW Sold": {
			{
				Month:    "Jan",
				Target:   110.10,
				Achieved: 214.93129312,
			},
			{
				Month:    "Feb",
				Target:   110.10,
				Achieved: 214.93129312,
			},
			{
				Month:    "Mar",
				Target:   110.10,
				Achieved: 214.93129312,
			},
			{
				Month:    "Apr",
				Target:   110.10,
				Achieved: 214.93129312,
			},
			{
				Month:    "May",
				Target:   110.10,
				Achieved: 214.93129312,
			},
			{Month: "Jun"},
			{Month: "Jul"},
			{Month: "Aug"},
			{Month: "Sep"},
			{Month: "Oct"},
			{Month: "Nov"},
			{Month: "Dec"},
		},
		"Install Ct": {
			{
				Month:    "Jan",
				Target:   11250,
				Achieved: 12500,
			},
			{
				Month:    "Feb",
				Target:   11250,
				Achieved: 12500,
			},
			{
				Month:    "Mar",
				Target:   11250,
				Achieved: 12500,
			},
			{
				Month:    "Apr",
				Target:   11250,
				Achieved: 12500,
			},
			{
				Month:    "May",
				Target:   11250,
				Achieved: 12500,
			},
			{Month: "Jun"},
			{Month: "Jul"},
			{Month: "Aug"},
			{Month: "Sep"},
			{Month: "Oct"},
			{Month: "Nov"},
			{Month: "Dec"},
		},
		"mW Installed": {
			{
				Month:    "Jan",
				Target:   8901.21,
				Achieved: 10000,
			},
			{
				Month:    "Feb",
				Target:   8901.21,
				Achieved: 10000,
			},
			{
				Month:    "Mar",
				Target:   8901.21,
				Achieved: 10000,
			},
			{
				Month:    "Apr",
				Target:   8901.21,
				Achieved: 10000,
			},
			{
				Month:    "May",
				Target:   8901.21,
				Achieved: 10000,
			},
			{Month: "Jun"},
			{Month: "Jul"},
			{Month: "Aug"},
			{Month: "Sep"},
			{Month: "Oct"},
			{Month: "Nov"},
			{Month: "Dec"},
		},
		"Batteries Ct": {
			{
				Month:    "Jan",
				Target:   3100,
				Achieved: 5000,
			},
			{
				Month:    "Feb",
				Target:   3100,
				Achieved: 5000,
			},
			{
				Month:    "Mar",
				Target:   3100,
				Achieved: 5000,
			},
			{
				Month:    "Apr",
				Target:   3100,
				Achieved: 5000,
			},
			{Month: "Jun"},
			{Month: "Jul"},
			{Month: "Aug"},
			{Month: "Sep"},
			{Month: "Oct"},
			{Month: "Nov"},
			{Month: "Dec"},
		},
	}

	appserver.FormAndSendHttpResp(resp, "Report target data", http.StatusOK, apiResp)

	// // targetData := models.GetReportsTargetModel{}

	// targetQuery := fmt.Sprintf(`SELECT
	// 					month,
	// 					projects_sold AS target_projects_sold,
	// 					mw_sold AS target_mw_sold,
	// 					install_count AS target_install_count,
	// 					mw_installed AS target_mw_installed,
	// 					batteries_count AS target_batteries_count
	// 				FROM
	// 					milestones_targets
	// 				WHERE
	// 					year = '%v' AND target_type = '%v'
	// 				ORDER BY
	// 					month_order(month);
	// 				`, dataReq.Year, dataReq.TargetType)

	// // retrieving value from owe_db from here
	// data, err = db.ReteriveFromDB(db.OweHubDbIndex, targetQuery, nil)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
	// 	return
	// }

	// var milestoneTarget []models.MilestoneTarget

	// // Loop through the data and assign values to variables
	// for _, item := range data {
	// 	// Retrieve and cast "month"
	// 	month, ok := item["month"].(string)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", item)
	// 		continue
	// 	}

	// 	// Retrieve and cast "target_projects_sold"
	// 	targetProjectsSold, ok := item["target_projects_sold"].(float64) // Adjust type based on DB value
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'target_projects_sold' Item: %+v\n", item)
	// 		// continue
	// 	}

	// 	// Retrieve and cast "target_mw_sold"
	// 	targetMwSold, ok := item["target_mw_sold"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'target_mw_sold' Item: %+v\n", item)
	// 		// continue
	// 	}

	// 	// Retrieve and cast "target_install_count"
	// 	targetInstallCount, ok := item["target_install_count"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'target_install_count' Item: %+v\n", item)
	// 		// continue
	// 	}

	// 	// Retrieve and cast "target_mw_installed"
	// 	targetMwInstalled, ok := item["target_mw_installed"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'target_mw_installed' Item: %+v\n", item)
	// 		// continue
	// 	}

	// 	// Retrieve and cast "target_batteries_count"
	// 	targetBatteriesCount, ok := item["target_batteries_count"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'target_batteries_count' Item: %+v\n", item)
	// 		// continue
	// 	}

	// 	milestoneTarget = append(milestoneTarget, models.MilestoneTarget{
	// 		Month:                month,
	// 		TargetProjectsSold:   targetProjectsSold,
	// 		TargetMwSold:         targetMwSold,
	// 		TargetInstallCount:   targetInstallCount,
	// 		TargetMwInstalled:    targetMwInstalled,
	// 		TargetBatteriesCount: targetBatteriesCount,
	// 	})
	// }

	// query1 := fmt.Sprintf(`
	// 	WITH monthly_counts AS (
	// 		SELECT
	// 			EXTRACT(MONTH FROM c.sale_date) AS month,
	// 			COUNT(*) AS month_sale_count,
	// 			SUM(COALESCE(NULLIF(c.contracted_system_size, '')::FLOAT, 0)) AS month_system_size
	// 		FROM
	// 			customers_customers_schema c
	// 		WHERE
	// 			EXTRACT(YEAR FROM c.sale_date) = %v
	// 			AND EXTRACT(MONTH FROM c.sale_date) <= %v
	// 		GROUP BY
	// 			EXTRACT(MONTH FROM c.sale_date)
	// 	)
	// 	SELECT
	// 		TO_CHAR(TO_DATE(month::TEXT, 'MM'), 'Mon') AS month,
	// 		SUM(month_sale_count) AS sale_count,
	// 		SUM(month_system_size) AS kw_sale_count
	// 	FROM
	// 		monthly_counts
	// 	GROUP BY
	// 		month
	// 	ORDER BY
	// 		month;`, dataReq.Year, dataReq.Month)

	// // Retrieving sales data
	// data, err = db.ReteriveFromDB(db.OweHubDbIndex, query1, nil)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get sales data from DB err: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to get sales data", http.StatusBadRequest, nil)
	// 	return
	// }

	// var monthlySales []models.MonthlySale

	// // Loop through the sales data and assign values to variables
	// for _, row := range data {
	// 	month, ok := row["month"].(string)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", row)
	// 		continue
	// 	}

	// 	saleCount, ok := row["sale_count"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'sale_count' Item: %+v\n", row)
	// 		continue
	// 	}

	// 	kwSaleCount, ok := row["kw_sale_count"].(float64)
	// 	if !ok {
	// 		log.FuncErrorTrace(0, "Failed to get 'kw_sale_count' Item: %+v\n", row)
	// 		continue
	// 	}

	// 	monthlySales = append(monthlySales, models.MonthlySale{
	// 		Month:       month,
	// 		SaleCount:   saleCount,
	// 		KwSaleCount: kwSaleCount,
	// 	})
	// }
	// // Step 1: Create a map for milestoneTarget for fast lookup by month
	// targetMap := make(map[string]models.MilestoneTarget)
	// for _, target := range milestoneTarget {
	// 	targetMap[target.Month] = target
	// }

	// // Step 2: Initialize variables
	// var totalSaleCount, totalKwSaleCount, targetSaleCount, targetKwSaleCount float64
	// var monthlyAchievement []models.MonthlyAchievement

	// // Step 3: Calculate the total sales and KW sales up to the given month
	// for _, monthData := range monthlySales {
	// 	// Calculate total sales and KW sales for the entire year
	// 	totalSaleCount += monthData.SaleCount
	// 	totalKwSaleCount += monthData.KwSaleCount

	// 	// Find the target data for the given month using the map
	// 	targetData, found := targetMap[monthData.Month]
	// 	if found {
	// 		// Calculate the percentage achievement for the month
	// 		targetProjectsSold := targetData.TargetProjectsSold
	// 		targetMwSold := targetData.TargetMwSold

	// 		// Calculate the percentage of target achieved for sales and KW
	// 		percentageSaleAchieved := 0.0
	// 		percentageKwAchieved := 0.0

	// 		if targetProjectsSold > 0 {
	// 			percentageSaleAchieved = (monthData.SaleCount / targetProjectsSold) * 100
	// 		}

	// 		if targetMwSold > 0 {
	// 			percentageKwAchieved = (monthData.KwSaleCount / targetMwSold) * 100
	// 		}

	// 		// Add monthly achievement to the list
	// 		monthlyAchievement = append(monthlyAchievement, models.MonthlyAchievement{
	// 			Month:                  monthData.Month,
	// 			ActualSaleCount:        monthData.SaleCount,
	// 			ActualKwSaleCount:      monthData.KwSaleCount,
	// 			TargetProjectsSold:     targetProjectsSold,
	// 			TargetMwSold:           targetMwSold,
	// 			PercentageSaleAchieved: percentageSaleAchieved,
	// 			PercentageKwAchieved:   percentageKwAchieved,
	// 		})

	// 		// Calculate total target sales and KW sales up to the given month
	// 		targetSaleCount += targetProjectsSold
	// 		targetKwSaleCount += targetMwSold
	// 	}
	// }

	// apiResp = models.ReportTargetResponse{
	// 	MonthlySales:       monthlySales,
	// 	TotalSaleCount:     totalSaleCount,
	// 	TotalKwSaleCount:   totalKwSaleCount,
	// 	TargetSaleCount:    targetSaleCount,
	// 	TargetKwSaleCount:  targetKwSaleCount,
	// 	MonthlyAchievement: monthlyAchievement, // Include the monthly achievements in the response
	// }
	// appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, apiResp)

}
