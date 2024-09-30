/**************************************************************************
 *      Function        : main.go
 *      DESCRIPTION     : This file contains main function for
 *						 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package main

import (
	"OWEApp/shared/types"
	"fmt"
	"os"
	"os/signal"

	arCalc "OWEApp/owehub-calc/arcalc"
	datamgmt "OWEApp/owehub-calc/dataMgmt"

	dlrPayCalc "OWEApp/owehub-calc/dlrpaycalc"
	repPayCalc "OWEApp/owehub-calc/reppaycalc"

	appserver "OWEApp/shared/appserver"
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"

	"github.com/robfig/cron/v3"
)

/******************************************************************************
 * FUNCTION:        main
 *
 * DESCRIPTION:     main function to start the service
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func main() {
	log.EnterFn(0, "main")
	router := appserver.CreateApiRouter(apiRoutes)
	var err error
	/* Start HTTP Server */
	if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
		appserver.StartServiceServer("HTTP", true, router)
	} else {
		appserver.StartServiceServer("HTTP", false, router)
	}
	/* Start HTTPS Server */
	if types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.HttpsSupport == "YES" {
		if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
			appserver.StartServiceServer("HTTPS", true, router)
		} else {
			appserver.StartServiceServer("HTTPS", false, router)
		}
	}

	// Perform Initial Load and Calculations at Startup
	err = performInitialLoadAndCalculations()
	if err != nil {
		log.FuncErrorTrace(0, "error while loading performInitialLoadAndCalculations function")
		return
	}

	// 	* * * * * tine of crown job
	// | | | | |
	// | | | | +---- Day of the week (0 - 6) (Sunday=0)
	// | | | +------ Month (1 - 12)
	// | | +-------- Day of the month (1 - 31)
	// | +---------- Hour (0 - 23)
	// +------------ Minute (0 - 59)

	// Schedule Daily Execution at Midnight
	c := cron.New()
	_, err = c.AddFunc("0 0 * * *", func() {
		err := performInitialLoadAndCalculations()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to perform daily load and calculations:", err)
		}
	})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to schedule daily job:", err)
	}
	c.Start()
	/* Spawn signal handler routine*/
	go signalHandler()
	/*Execute app inifinetly until it gets exit indication*/
	err = <-types.ExitChan

	/*Close exit channel*/
	close(types.ExitChan)

	log.ExitFn(0, "main", nil)
	log.FuncErrorTrace(0, "Exiting Comm-App : reason=%v", err)
}

/******************************************************************************
 * FUNCTION:        signalHandler
 *
 * DESCRIPTION:     Signal handler function
 * INPUT:
 * RETURNS:    VOID
 ******************************************************************************/
func signalHandler() {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt)
	sig := <-sigChan
	types.ExitChan <- fmt.Errorf("%+v signal", sig)
}

func performInitialLoadAndCalculations() error {
	var err error
	arCalcResult := make(chan string)
	dlrPayResult := make(chan string)
	repPayResult := make(chan string)

	// Clear previous data
	err = clearPreviousData()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to clear previous data err: %+v", err)
		return fmt.Errorf("failed to clear previous data: %w", err)
	}

	// Load Configurations
	err = datamgmt.LoadConfigurations()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get config from DB err: %+v", err)
		return fmt.Errorf("failed to load config from DB: %w", err)
	}

	// Load Sale Data
	err = datamgmt.SaleData.LoadSaleData("", "")
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sale data from DB err: %+v", err)
		return fmt.Errorf("failed to load sale data from DB: %w", err)
	}

	// Perform Initial AR Calculation
	go arCalc.ExecArInitialCalculation(arCalcResult)

	// Perform Initial DLR PAY Calculation
	go dlrPayCalc.ExecDlrPayInitialCalculation(dlrPayResult)

	// Perform Initial REP PAY Calculation
	go repPayCalc.ExecRepPayInitialCalculation(repPayResult)

	repPayRs := <-repPayResult
	dlrPayRs := <-dlrPayResult
	arRs := <-arCalcResult

	if arRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for AR")
		return fmt.Errorf("failed to perform initial calculations for AR")
	} else {
		log.FuncDebugTrace(0, "AR Initial calculation completed successfully.")
	}

	if dlrPayRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for DealerPay")
		return fmt.Errorf("failed to perform initial calculations for DealerPay")
	} else {
		log.FuncDebugTrace(0, "DLR Pay Initial calculation completed successfully.")
	}

	if repPayRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for RepPay")
		return fmt.Errorf("failed to perform initial calculations for RepPay")
	} else {
		log.FuncDebugTrace(0, "Rep Pay Initial calculation completed successfully.")
	}

	// Closing channels
	close(arCalcResult)
	close(repPayResult)
	close(dlrPayResult)

	return nil
}

func clearPreviousData() error {
	queries := `
		TRUNCATE TABLE sales_ar_calc;
		TRUNCATE TABLE dealer_pay_calc_standard;
		TRUNCATE TABLE rep_pay_cal_standard;
		TRUNCATE TABLE rep_pay_cal_ovrrd_standard;`

	err := db.ExecQueryDB(0, queries)
	if err != nil {
		return err
	}
	return nil
}

// func GetDefferenceFromCDVAndSchema() {

// 	var (
// 		CdvData       []string
// 		ConfigeurData []string
// 	)

// 	query := `SELECT DISTINCT(loan_type) FROM consolidated_data_view ORDER BY loan_type`

// 	data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "error occurred while retrieving from consolidated_data_view: %v", err)
// 		return
// 	}

// 	for _, item := range data {

// 		DealerName1, ok := item["loan_type"].(string)
// 		if !ok {
// 			continue
// 		}

// 		CdvData = append(CdvData, DealerName1)
// 	}

// 	query = `SELECT DISTINCT(product_code) FROM loan_type ORDER BY product_code`

// 	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "error occurred while retrieving from consolidated_data_view: %v", err)
// 		return
// 	}

// 	for _, item := range data {

// 		DealerName, ok := item["product_code"].(string)
// 		if !ok {
// 			continue
// 		}

// 		ConfigeurData = append(ConfigeurData, DealerName)
// 	}

// 	result := map[string][]string{
// 		"CdvData":       CdvData,
// 		"ConfigeurData": ConfigeurData,
// 	}

// 	// Creating JSON file
// 	fileName := "loanType.json"
// 	file, err := os.Create(fileName)
// 	if err != nil {
// 		log.FuncErrorTrace(0, "error occurred while creating file: %v", err)
// 		return
// 	}
// 	log.FuncErrorTrace(0, "File created: %v", file.Name())

// 	defer file.Close()

// 	encoder := json.NewEncoder(file)
// 	encoder.SetIndent("", "  ")

// 	if err := encoder.Encode(result); err != nil {
// 		log.FuncErrorTrace(0, "error occurred while encoding data to JSON: %v", err)
// 		return
// 	}

// 	log.FuncErrorTrace(0, "Data successfully written to dealers.json")

// 	// Get the current working directory
// 	workingDir, err := os.Getwd()
// 	if err != nil {
// 		log.FuncErrorTrace(0, "error occurred while getting current working directory: %v", err)
// 		return
// 	}

// 	// Construct the full path of the created file
// 	fullPath := filepath.Join(workingDir, fileName)
// 	log.FuncErrorTrace(0, "The file was created at: %s", fullPath)

// 	// Check if file exists
// 	if _, err := os.Stat(fileName); err == nil {
// 		log.FuncErrorTrace(0, "File %s exists", fileName)
// 	} else if os.IsNotExist(err) {
// 		log.FuncErrorTrace(0, "File %s does not exist", fileName)
// 	} else {
// 		log.FuncErrorTrace(0, "Error checking file %s: %v", fileName, err)
// 	}
// }

// var responce []map[string][]string

// func GetUniqueIds(datas string) {
// 	if datas != "finish" {
// 		var UniqueIds []string

// 		query := fmt.Sprintf("SELECT unique_id FROM consolidated_data_view WHERE loan_type = '%v' ORDER BY unique_id", datas)

// 		data, err := db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
// 		if err != nil {
// 			log.FuncErrorTrace(0, "error occurred while retrieving from consolidated_data_view: %v", err)
// 			return
// 		}

// 		for _, item := range data {
// 			UniqueId, ok := item["unique_id"].(string)
// 			if !ok {
// 				continue
// 			}
// 			UniqueIds = append(UniqueIds, UniqueId)
// 		}

// 		result := map[string][]string{
// 			datas: UniqueIds,
// 		}

// 		responce = append(responce, result)
// 	} else {
// 		// Creating JSON file
// 		fileName := "loan_fee.json"
// 		file, err := os.Create(fileName)
// 		if err != nil {
// 			log.FuncErrorTrace(0, "error occurred while creating file: %v", err)
// 			return
// 		}
// 		log.FuncErrorTrace(0, "File created: %v", file.Name())

// 		defer file.Close()

// 		encoder := json.NewEncoder(file)
// 		encoder.SetIndent("", "  ")

// 		if err := encoder.Encode(responce); err != nil {
// 			log.FuncErrorTrace(0, "error occurred while encoding data to JSON: %v", err)
// 			return
// 		}

// 		log.FuncErrorTrace(0, "Data successfully written to %s", fileName)

// 		// Get the current working directory
// 		workingDir, err := os.Getwd()
// 		if err != nil {
// 			log.FuncErrorTrace(0, "error occurred while getting current working directory: %v", err)
// 			return
// 		}

// 		// Construct the full path of the created file
// 		fullPath := filepath.Join(workingDir, fileName)
// 		log.FuncErrorTrace(0, "The file was created at: %s", fullPath)

// 		// Check if file exists
// 		if _, err := os.Stat(fileName); err == nil {
// 			log.FuncErrorTrace(0, "File %s exists", fileName)
// 		} else if os.IsNotExist(err) {
// 			log.FuncErrorTrace(0, "File %s does not exist", fileName)
// 		} else {
// 			log.FuncErrorTrace(0, "Error checking file %s: %v", fileName, err)
// 		}
// 	}
// }
