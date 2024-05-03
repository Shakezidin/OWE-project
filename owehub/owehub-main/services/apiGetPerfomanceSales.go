// /**************************************************************************
//  * File       	   : apiGetPerfomanceSales.go
//  * DESCRIPTION     : This file contains functions for get PerfomanceSales handler
//  * DATE            : 03-May-2024
//  **************************************************************************/

 package services

//  import (
// 	 "OWEApp/shared/db"
// 	 log "OWEApp/shared/logger"
// 	 models "OWEApp/shared/models"
// 	 "strings"
 
// 	 "encoding/json"
// 	 "fmt"
// 	 "io/ioutil"
// 	 "net/http"
//  )
 
//  /******************************************************************************
// 	* FUNCTION:		HandleGetRateAdjustmentsRequest
// 	* DESCRIPTION:     handler for get RateAdjustments request
// 	* INPUT:			resp, req
// 	* RETURNS:    		void
// 	******************************************************************************/
//  func HandleGetPerfomanceSalesRequest(resp http.ResponseWriter, req *http.Request) {
// 	 var (
// 		 err             error
// 		 dataReq         models.GetPerfomanceSales
// 		 data            []map[string]interface{}
// 		 whereEleList    []interface{}
// 		 query           string
// 		 queryWithFiler  string
// 		 queryForAlldata string
// 		 filter          string
// 		 RecordCount     int64
// 	 )
 
// 	 log.EnterFn(0, "HandleGetRateAdjustmentsRequest")
// 	 defer func() { log.ExitFn(0, "HandleGetRateAdjustmentsRequest", err) }()
 
// 	 if req.Body == nil {
// 		 err = fmt.Errorf("HTTP Request body is null in get rate adjustments request")
// 		 log.FuncErrorTrace(0, "%v", err)
// 		 FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
// 		 return
// 	 }
 
// 	 reqBody, err := ioutil.ReadAll(req.Body)
// 	 if err != nil {
// 		 log.FuncErrorTrace(0, "Failed to read HTTP Request body from get rate adjustments request err: %v", err)
// 		 FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
// 		 return
// 	 }
 
// 	 err = json.Unmarshal(reqBody, &dataReq)
// 	 if err != nil {
// 		 log.FuncErrorTrace(0, "Failed to unmarshal get rate adjustments request err: %v", err)
// 		 FormAndSendHttpResp(resp, "Failed to unmarshal get rate adjustments Request body", http.StatusBadRequest, nil)
// 		 return
// 	 }
 
// 	 tableName := db.TableName_rate_adjustments
// 	 query = `
// 	 SELECT SUM(system_size) AS sales_kw, COUNT(system_size) AS sales
// 	 FROM sales_metrics_schema sm`
 
// 	 filter = PreparePerfomanceFilters(tableName, dataReq)
// 	//  if filter != "" {
// 	// 	 queryWithFiler = query + filter
// 	//  }
 
// 	//  data, err = db.ReteriveFromDB(queryWithFiler, whereEleList)
// 	 data, err = db.ReteriveFromDB(query, whereEleList)
// 	 if err != nil {
// 		 log.FuncErrorTrace(0, "Failed to get rate adjustments from DB err: %v", err)
// 		 FormAndSendHttpResp(resp, "Failed to get rate adjustments from DB", http.StatusBadRequest, nil)
// 		 return
// 	 }
 
// 	 rateAdjustmentsList := models.GetRateAdjustmentsList{}
 
// 	 for _, item := range data {
// 		 RecordId, ok := item["record_id"].(int64)
// 		 if !ok {
// 			 log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
// 			 continue
// 		 }
 
// 		 UniqueId, ok := item["unique_id"].(string)
// 		 if !ok || UniqueId == "" {
// 			 log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
// 			 UniqueId = ""
// 		 }
 
// 		 PayScale, ok := item["pay_scale"].(string)
// 		 if !ok || PayScale == "" {
// 			 log.FuncErrorTrace(0, "Failed to get pay scale for Record ID %v. Item: %+v\n", RecordId, item)
// 			 PayScale = ""
// 		 }
 
// 		 Position, ok := item["position"].(string)
// 		 if !ok || Position == "" {
// 			 log.FuncErrorTrace(0, "Failed to get position for Record ID %v. Item: %+v\n", RecordId, item)
// 			 Position = ""
// 		 }
 
// 		 Adjustment, ok := item["adjustment"].(string)
// 		 if !ok || Adjustment == "" {
// 			 log.FuncErrorTrace(0, "Failed to get adjustment for Record ID %v. Item: %+v\n", RecordId, item)
// 			 Adjustment = ""
// 		 }
 
// 		 MinRate, ok := item["min_rate"].(float64)
// 		 if !ok {
// 			 log.FuncErrorTrace(0, "Failed to get min rate for Record ID %v. Item: %+v\n", RecordId, item)
// 			 MinRate = 0.0
// 		 }
 
// 		 MaxRate, ok := item["max_rate"].(float64)
// 		 if !ok {
// 			 log.FuncErrorTrace(0, "Failed to get max rate for Record ID %v. Item: %+v\n", RecordId, item)
// 			 MaxRate = 0.0
// 		 }
 
// 		 StartDate, ok := item["start_date"].(string)
// 		 if !ok || StartDate == "" {
// 			 log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
// 			 StartDate = ""
// 		 }
 
// 		 EndDate, ok := item["end_date"].(string)
// 		 if !ok || EndDate == "" {
// 			 log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
// 			 EndDate = ""
// 		 }
 
// 		 rateAdjustmentData := models.GetRateAdjustments{
// 			 RecordId:   RecordId,
// 			 UniqueId:   UniqueId,
// 			 PayScale:   PayScale,
// 			 Position:   Position,
// 			 Adjustment: Adjustment,
// 			 MinRate:    MinRate,
// 			 MaxRate:    MaxRate,
// 			 StartDate:  StartDate,
// 			 EndDate:    EndDate,
// 		 }
// 		 rateAdjustmentsList.RateAdjustmentsList = append(rateAdjustmentsList.RateAdjustmentsList, rateAdjustmentData)
// 	 }
 
// 	//  filter, whereEleList = PrepareRateAdjustmentsFilters(tableName, dataReq, true)
// 	//  if filter != "" {
// 	// 	 queryForAlldata = query + filter
// 	//  }
 
// 	//  data, err = db.ReteriveFromDB(queryForAlldata, whereEleList)
// 	//  if err != nil {
// 	// 	 log.FuncErrorTrace(0, "Failed to get rate adjustments from DB err: %v", err)
// 	// 	 FormAndSendHttpResp(resp, "Failed to get rate adjustments from DB", http.StatusBadRequest, nil)
// 	// 	 return
// 	//  }
// 	//  RecordCount = int64(len(data))
// 	 // Send the response
// 	 log.FuncInfoTrace(0, "Number of rate adjustments List fetched : %v list %+v", len(rateAdjustmentsList.RateAdjustmentsList), rateAdjustmentsList)
// 	 FormAndSendHttpResp(resp, "Rate Adjustments", http.StatusOK, rateAdjustmentsList, RecordCount)
//  }
 
//  /******************************************************************************
// 	* FUNCTION:		PreparePerfomanceFilters
// 	* DESCRIPTION:     handler for prepare filter
// 	* INPUT:			resp, req
// 	* RETURNS:    		void
// 	******************************************************************************/
//  func PreparePerfomanceFilters(tableName string, dataFilter models.GetPerfomanceSales) (filters string, whereEleList []interface{}) {
// 	 log.EnterFn(0, "PreparePerfomanceFilters")
// 	 defer func() { log.ExitFn(0, "PreparePerfomanceFilters", nil) }()
 
// 	 var filtersBuilder strings.Builder
// 	 filtersBuilder.WriteString(" WHERE ")

// 	 filtersBuilder.WriteString(fmt.Sprintf("contract_date BETWEEN %s AND $%s", dataFilter.StartDate, dataFilter.EndDate))
// 	 filters = filtersBuilder.String()
 
// 	 log.FuncDebugTrace(0, "filters for table name : %s", tableName)
// 	 return filters
//  }
 