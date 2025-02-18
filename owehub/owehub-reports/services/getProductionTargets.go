/**************************************************************************
 * File       	   : getProductionTargets.go
 * DESCRIPTION     : This file contains functions to get production targets
 * DATE            : 17-feb-2024
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
   "strings"
 )

 /******************************************************************************
 * FUNCTION:		HandleGetProductionTargets
 * DESCRIPTION:     Handler for get production targets request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

 func HandleGetProductionTargets(resp http.ResponseWriter, req *http.Request) {
   var (
     err          error
     query        string
     dataReq      models.ProductionTargetsReq
     apiResp      []models.ProductionTargetsRespItem
     data         []map[string]interface{}
     whereEleList []interface{}
   //  targetUserId   int64
   //  targetStateCnd string
   )

   log.EnterFn(0, "HandleGetProductionTargets")
   defer func() { log.ExitFn(0, "HandleGetProductionTargets", err) }()

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

   var intMonth int
   // Convert month name to integer (frontend -> "jan" -> 1)
   //need to implement new logic for this 📍

     if dataReq.GroupBy == "am" || dataReq.GroupBy == "state" {
       intMonth = MonthNameToInt(dataReq.Month)
       if intMonth == 0 {
         err = fmt.Errorf("invalid month name")
         log.FuncErrorTrace(0, "%v", err)
         appserver.FormAndSendHttpResp(resp, "invalid month name", http.StatusBadRequest, nil)
         return
       }
     }
     
   // 	 targetUserId, err = getProdTargetUserId(req.Context(), dataReq.AccountManager)
   //  if err != nil {
   // 	 log.FuncErrorTrace(0, "Failed to get user id for %s, err: %v", dataReq.AccountManager, err)
   // 	 appserver.FormAndSendHttpResp(resp, "Failed to get user id for %s", http.StatusBadRequest, nil)
   // 	 return
   //  }

   switch strings.ToLower(dataReq.GroupBy) {
   case "month":
     //targetStateCnd = "p.state = $4"
     //  if targetUserId == 1 && strings.ToLower(dataReq.AccountManager) == "all" && strings.ToLower(dataReq.State) == "all" {
     // 	 targetStateCnd = "$4 = $4" // TRUE; no need to check state
     //  }
     query = `
              WITH months(n) AS (SELECT generate_series(1, 12))
              SELECT
                  TRIM(TO_CHAR(TO_DATE(months.n::TEXT, 'MM'), 'Month')) AS month,
                  COALESCE(SUM(p.projects_sold), 0) AS projects_sold,
                  COALESCE(SUM(p.mw_sold), 0) AS mw_sold,
                  COALESCE(SUM(p.install_ct), 0) AS install_ct,
                  COALESCE(SUM(p.mw_installed), 0) AS mw_installed,
                  COALESCE(SUM(p.batteries_ct), 0) AS batteries_ct,
                  COALESCE(SUM(p.ntp), 0) AS ntp
              FROM months
              LEFT JOIN production_targets p
              ON months.n = p.month AND p.target_percentage = $1 AND p.year = $2 AND p.user_id = 1
              GROUP BY months.n
              ORDER BY months.n
          `
     whereEleList = []interface{}{dataReq.TargetPercentage, dataReq.Year}

   case "am":
     query = `
              SELECT
                  u.name,
                  p.user_id,
                  COALESCE(SUM(p.projects_sold), 0) AS projects_sold,
                  COALESCE(SUM(p.mw_sold), 0) AS mw_sold,
                  COALESCE(SUM(p.install_ct), 0) AS install_ct,
                  COALESCE(SUM(p.mw_installed), 0) AS mw_installed,
                  COALESCE(SUM(p.batteries_ct), 0) AS batteries_ct,
                  COALESCE(SUM(p.ntp), 0) AS ntp
              FROM production_targets p
              JOIN user_details u ON p.user_id = u.user_id
              WHERE p.user_id!= 1 AND p.target_percentage = $1 AND p.year = $2 AND p.month = $3 AND LOWER(p.state) = 'all'
              GROUP BY u.name, p.user_id
          `
     whereEleList = []interface{}{dataReq.TargetPercentage, dataReq.Year, intMonth}

   case "state":
     query = `
              SELECT
                 state,
                  COALESCE(SUM(p.projects_sold), 0) AS projects_sold,
                  COALESCE(SUM(p.mw_sold), 0) AS mw_sold,
                  COALESCE(SUM(p.install_ct), 0) AS install_ct,
                  COALESCE(SUM(p.mw_installed), 0) AS mw_installed,
                  COALESCE(SUM(p.batteries_ct), 0) AS batteries_ct,
                  COALESCE(SUM(p.ntp), 0) AS ntp
              FROM production_targets p
              WHERE p.user_id = 1  AND p.target_percentage = $1 AND p.year = $2 AND p.month = $3 AND LOWER(p.state) != 'all'
              GROUP BY state
          `
     whereEleList = []interface{}{dataReq.TargetPercentage, dataReq.Year, intMonth}

   default:
     err = fmt.Errorf("invalid group_by value")
     log.FuncErrorTrace(0, "%v", err)
     appserver.FormAndSendHttpResp(resp, "Invalid group_by value", http.StatusBadRequest, nil)
     return
   }

   //for debugging
   log.FuncInfoTrace(0, "Executing query: %s with parameters: %v", query, whereEleList)

   // fetching data from db
   data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
   if err != nil {
     log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
     appserver.FormAndSendHttpResp(resp, "Failed to get data from DB", http.StatusBadRequest, nil)
     return
   }

   // prepare response data
   for _, item := range data {
     var respItem models.ProductionTargetsRespItem
     if dataReq.GroupBy == "month" {
       respItem.Month, _ = item["month"].(string)
     } else if dataReq.GroupBy == "am" {
       respItem.UserName, _ = item["name"].(string)
       respItem.UserID, _ = item["user_id"].(int64)
     } else if dataReq.GroupBy == "state" {
       respItem.UserID, _ = item["user_id"].(int64)
     }
     respItem.ProjectsSold, _ = item["projects_sold"].(float64)
     respItem.MwSold, _ = item["mw_sold"].(float64)
     respItem.InstallCt, _ = item["install_ct"].(float64)
     respItem.MwInstalled, _ = item["mw_installed"].(float64)
     respItem.BatteriesCt, _ = item["batteries_ct"].(float64)
     respItem.NTP, _ = item["ntp"].(float64)

     apiResp = append(apiResp, respItem)
   }

   // Send response with production targets data
   appserver.FormAndSendHttpResp(resp, "Production targets", http.StatusOK, apiResp)
 }

 /***************************--helper functions --***************************************************/

 func MonthNameToInt(month string) int {
   switch strings.ToLower(month) {
   case "january":
     return 1
   case "february":
     return 2
   case "march":
     return 3
   case "april":
     return 4
   case "may":
     return 5
   case "june":
     return 6
   case "july":
     return 7
   case "august":
     return 8
   case "september":
     return 9
   case "october":
     return 10
   case "november":
     return 11
   case "december":
     return 12
   default:
     return 0 // invalid month name
   }
 }
