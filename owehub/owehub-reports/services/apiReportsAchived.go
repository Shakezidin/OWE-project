/**************************************************************************
 * File       	   : apiReportTarget.go
 * DESCRIPTION     : This file contains functions to get report Target data
 * DATE            : 08-Jan-2025
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
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
		dataReq models.GetReportsTargetModelsReq
		data    []map[string]interface{}
		apiResp models.ReportTargetResponse
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

	// targetData := models.GetReportsTargetModel{}

	targetQuery := fmt.Sprintf(`SELECT 
						month,
						projects_sold AS target_projects_sold,
						mw_sold AS target_mw_sold,
						install_count AS target_install_count,
						mw_installed AS target_mw_installed,
						batteries_count AS target_batteries_count
					FROM 
						milestones_targets
					WHERE 
						year = '%v' AND target_type = '%v'
					ORDER BY 
						month_order(month);
					`, dataReq.Year, dataReq.TargetType)

	// retrieving value from owe_db from here
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, targetQuery, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get PerfomanceProjectStatus data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get PerfomanceProjectStatus data", http.StatusBadRequest, nil)
		return
	}

	var milestoneTarget []models.MilestoneTarget

	// Loop through the data and assign values to variables
	for _, item := range data {
		// Retrieve and cast "month"
		month, ok := item["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", item)
			continue
		}

		// Retrieve and cast "target_projects_sold"
		targetProjectsSold, ok := item["target_projects_sold"].(float64) // Adjust type based on DB value
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'target_projects_sold' Item: %+v\n", item)
			// continue
		}

		// Retrieve and cast "target_mw_sold"
		targetMwSold, ok := item["target_mw_sold"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'target_mw_sold' Item: %+v\n", item)
			// continue
		}

		// Retrieve and cast "target_install_count"
		targetInstallCount, ok := item["target_install_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'target_install_count' Item: %+v\n", item)
			// continue
		}

		// Retrieve and cast "target_mw_installed"
		targetMwInstalled, ok := item["target_mw_installed"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'target_mw_installed' Item: %+v\n", item)
			// continue
		}

		// Retrieve and cast "target_batteries_count"
		targetBatteriesCount, ok := item["target_batteries_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'target_batteries_count' Item: %+v\n", item)
			// continue
		}

		milestoneTarget = append(milestoneTarget, models.MilestoneTarget{
			Month:                month,
			TargetProjectsSold:   targetProjectsSold,
			TargetMwSold:         targetMwSold,
			TargetInstallCount:   targetInstallCount,
			TargetMwInstalled:    targetMwInstalled,
			TargetBatteriesCount: targetBatteriesCount,
		})
	}

	query1 := fmt.Sprintf(`
		WITH monthly_counts AS (
			SELECT 
				EXTRACT(MONTH FROM c.sale_date) AS month,
				COUNT(*) AS month_sale_count,
				SUM(COALESCE(NULLIF(c.contracted_system_size, '')::FLOAT, 0)) AS month_system_size
			FROM 
				customers_customers_schema c
			WHERE 
				EXTRACT(YEAR FROM c.sale_date) = %v
				AND EXTRACT(MONTH FROM c.sale_date) <= %v
			GROUP BY 
				EXTRACT(MONTH FROM c.sale_date)
		)
		SELECT 
			TO_CHAR(TO_DATE(month::TEXT, 'MM'), 'Mon') AS month,
			SUM(month_sale_count) AS sale_count,
			SUM(month_system_size) AS kw_sale_count
		FROM 
			monthly_counts
		GROUP BY 
			month
		ORDER BY 
			month;`, dataReq.Year, dataReq.Month)

	// Retrieving sales data
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query1, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sales data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get sales data", http.StatusBadRequest, nil)
		return
	}

	var monthlySales []models.MonthlySale

	// Loop through the sales data and assign values to variables
	for _, row := range data {
		month, ok := row["month"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'month' Item: %+v\n", row)
			continue
		}

		saleCount, ok := row["sale_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'sale_count' Item: %+v\n", row)
			continue
		}

		kwSaleCount, ok := row["kw_sale_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get 'kw_sale_count' Item: %+v\n", row)
			continue
		}

		monthlySales = append(monthlySales, models.MonthlySale{
			Month:       month,
			SaleCount:   saleCount,
			KwSaleCount: kwSaleCount,
		})
	}
	// Step 1: Create a map for milestoneTarget for fast lookup by month
	targetMap := make(map[string]models.MilestoneTarget)
	for _, target := range milestoneTarget {
		targetMap[target.Month] = target
	}

	// Step 2: Initialize variables
	var totalSaleCount, totalKwSaleCount, targetSaleCount, targetKwSaleCount float64
	var monthlyAchievement []models.MonthlyAchievement

	// Step 3: Calculate the total sales and KW sales up to the given month
	for _, monthData := range monthlySales {
		// Calculate total sales and KW sales for the entire year
		totalSaleCount += monthData.SaleCount
		totalKwSaleCount += monthData.KwSaleCount

		// Find the target data for the given month using the map
		targetData, found := targetMap[monthData.Month]
		if found {
			// Calculate the percentage achievement for the month
			targetProjectsSold := targetData.TargetProjectsSold
			targetMwSold := targetData.TargetMwSold

			// Calculate the percentage of target achieved for sales and KW
			percentageSaleAchieved := 0.0
			percentageKwAchieved := 0.0

			if targetProjectsSold > 0 {
				percentageSaleAchieved = (monthData.SaleCount / targetProjectsSold) * 100
			}

			if targetMwSold > 0 {
				percentageKwAchieved = (monthData.KwSaleCount / targetMwSold) * 100
			}

			// Add monthly achievement to the list
			monthlyAchievement = append(monthlyAchievement, models.MonthlyAchievement{
				Month:                  monthData.Month,
				ActualSaleCount:        monthData.SaleCount,
				ActualKwSaleCount:      monthData.KwSaleCount,
				TargetProjectsSold:     targetProjectsSold,
				TargetMwSold:           targetMwSold,
				PercentageSaleAchieved: percentageSaleAchieved,
				PercentageKwAchieved:   percentageKwAchieved,
			})

			// Calculate total target sales and KW sales up to the given month
			targetSaleCount += targetProjectsSold
			targetKwSaleCount += targetMwSold
		}
	}

	apiResp = models.ReportTargetResponse{
		MonthlySales:       monthlySales,
		TotalSaleCount:     totalSaleCount,
		TotalKwSaleCount:   totalKwSaleCount,
		TargetSaleCount:    targetSaleCount,
		TargetKwSaleCount:  targetKwSaleCount,
		MonthlyAchievement: monthlyAchievement, // Include the monthly achievements in the response
	}
	appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, apiResp)

}
