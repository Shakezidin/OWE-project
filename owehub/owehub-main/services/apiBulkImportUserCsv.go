/*****************************************************************************
* File                  : apiBulkImportUserCsv.go
* DESCRIPTION           : This file contains a function to read data from a CSV file
*                         and store the parsed data into a database.
*
* DATE                  : 9-Jan-2024
*****************************************************************************/

package services

import (
  "OWEApp/shared/appserver"
  "OWEApp/shared/db"
  log "OWEApp/shared/logger"
  "encoding/csv"
  "fmt"
  "io"
  "net/http"
  "strings"
)

/******************************************************************************
 * FUNCTION:			HandleBulkImportUsersCsvRequest
 * DESCRIPTION:         Handles the file upload, parses the CSV file,
 *                      and stores the data into the database.
 * INPUT:			    (response writer), r (request)
 * RETURNS:    		    void
 ******************************************************************************/

type ImportResult struct {
  TotalProcessed int      `json:"total_processed"`
  Successful     int      `json:"successful"`
  Failed         int      `json:"failed"`
  Errors         []string `json:"errors"`
}

type CreateBulkUserReq struct {
  Name              string `json:"name"`
  MobileNumber      string `json:"mobile_number"`
  EmailId           string `json:"email_id"`
  PasswordChangeReq bool   `json:"password_change_req"`
  ReportingManager  string `json:"reporting_manager"`
  UserStatus        string `json:"user_status"`
  Designation       string `json:"designation"`
  Description       string `json:"description"`
  RoleName          string `json:"role_name"`
  Password          string `json:"password"`
  PartnerId         string `json:"partner_id"`
  SalesPartnerName  string `json:"sales_partner_name"`
}

func HandleBulkImportUsersCsvRequest(resp http.ResponseWriter, req *http.Request) {

  result := ImportResult{
    Errors: make([]string, 0),
  }

  err := req.ParseMultipartForm(5 << 20)
  if err != nil {
    log.FuncErrorTrace(0, "Error parsing multipart form: %v", err)
    appserver.FormAndSendHttpResp(resp, "Unable to parse form", http.StatusBadRequest, nil)
    return
  }

  file, _, err := req.FormFile("file")
  if err != nil {
    log.FuncErrorTrace(0, "Error retrieving file: %v", err)
    appserver.FormAndSendHttpResp(resp, "Unable to get file", http.StatusBadRequest, nil)
    return
  }
  defer file.Close()

  reader := csv.NewReader(file)
  headers, err := reader.Read()
  if err != nil {
    log.FuncErrorTrace(0, "Error reading CSV headers: %v", err)
    appserver.FormAndSendHttpResp(resp, "Error reading CSV file", http.StatusBadRequest, nil)
    return
  }

  for {
    record, err := reader.Read()
    if err == io.EOF {
      break
    }
    if err != nil {
      log.FuncErrorTrace(0, "error reading CSV row: %v", err)
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Row error: %v", err))
      continue
    }

    if isEmptyRow(record) {
      continue
    }

    result.TotalProcessed++

    CreateBulkUserReq := CreateBulkUserReq{
      Name:              getValue(headers, record, "name"),
      EmailId:           getValue(headers, record, "email_id"),
      MobileNumber:      getValue(headers, record, "mobile_number"),
      Designation:       getValue(headers, record, "designation"),
      Description:       getValue(headers, record, "description"),
      RoleName:          getValue(headers, record, "role_name"),
      Password:          "Welcome@123",
      PasswordChangeReq: true,
      UserStatus:        "Active",
      ReportingManager:  "",
      PartnerId:         getValue(headers, record, "partner_id"),
    }

    // fetching the reporting_manager user_code using email that we will get from .CSV file
    reportingManagerEmail := getValue(headers, record, "reporting_manager")


    // handing hierarchy conditions
    if CreateBulkUserReq.RoleName == "Admin" || CreateBulkUserReq.RoleName == "Finance Admin" ||
       CreateBulkUserReq.RoleName == "Dealer Owner" || CreateBulkUserReq.RoleName == "Account Manager" {

      if reportingManagerEmail != "" {
        log.FuncErrorTrace(0, "Role %s cannot have a reporting manager: %s", CreateBulkUserReq.RoleName, reportingManagerEmail)
        result.Failed++
        result.Errors = append(result.Errors, fmt.Sprintf("Role %s cannot have a reporting manager", CreateBulkUserReq.RoleName))
        continue
      }
    }else{
    reportingManagerCode, err := fetchUserCodeByEmail(reportingManagerEmail)
    if err != nil {
      log.FuncErrorTrace(0, "Error fetching reporting manager code for email: %s, error: %v", reportingManagerEmail, err)
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Error fetching reporting manager code for email: %s", reportingManagerEmail))
      continue
    }
    CreateBulkUserReq.ReportingManager = reportingManagerCode
  }

    partnerId := getValue(headers, record, "partner_id")
    salesPartnerName, err := fetchSalesPartnerNameById(partnerId)
    if err != nil {
      log.FuncErrorTrace(0, "Error fetching sales partner name for partner_id: %s, error: %v", partnerId, err)
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Error fetching sales partner name for partner_id: %s", partnerId))
      continue
    }
    CreateBulkUserReq.PartnerId = partnerId
    CreateBulkUserReq.SalesPartnerName = salesPartnerName

    if !isValidUser(CreateBulkUserReq) {
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Invalid data for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

    hashedPassBytes, err := GenerateHashPassword(CreateBulkUserReq.Password)
    if err != nil {
      log.FuncErrorTrace(0, "Password hash failed for user: %s, error: %v", CreateBulkUserReq.EmailId, err)
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Password hash failed for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

    queryParameters := []interface{}{
      CreateBulkUserReq.Name,
      "", // db_username
      CreateBulkUserReq.MobileNumber,
      strings.ToLower(CreateBulkUserReq.EmailId),
      string(hashedPassBytes),
      CreateBulkUserReq.PasswordChangeReq,
      CreateBulkUserReq.ReportingManager,
      "", // dealer_owner
      CreateBulkUserReq.RoleName,
      CreateBulkUserReq.UserStatus,
      CreateBulkUserReq.Designation,
      CreateBulkUserReq.Description,
      "", // region
      "", // street_address
      "", // state
      "", // city
      "", // zipcode
      "", // country
      "", // team_name
      CreateBulkUserReq.SalesPartnerName,
      "",    // dealer_logo
      false, // add_to_podio
      nil,   // tables_permissions
    }

    _, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateUserFunction, queryParameters)
    if err != nil {
      log.FuncErrorTrace(0, "DB error for user %s: %v", CreateBulkUserReq.EmailId, err)
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("DB error for user %s: %v", CreateBulkUserReq.EmailId, err))
      continue
    }

    result.Successful++
  }

  appserver.FormAndSendHttpResp(resp, "Bulk import completed", http.StatusOK, result)
}

/*************************************helper functions *************************************/

func getValue(headers []string, record []string, key string) string {
  for i, h := range headers {

    if strings.EqualFold(strings.TrimSpace(h), strings.TrimSpace(key)) && i < len(record) {
      return strings.TrimSpace(record[i])
    }
  }
  return ""
}

func isValidUser(user CreateBulkUserReq) bool {
  valid := len(user.Name) > 0 &&
    len(user.EmailId) > 0 &&
    len(user.MobileNumber) > 0 &&
    len(user.Designation) > 0 &&
    len(user.RoleName) > 0

  if !valid {
    log.FuncErrorTrace(0, "invalid user data: Name=%s, Email=%s, Mobile=%s, Designation=%s, Role=%s",
      user.Name,
      user.EmailId,
      user.MobileNumber,
      user.Designation,
      user.RoleName)
  }

  return valid
}

func isEmptyRow(record []string) bool {
  for _, value := range record {
    if value != "" {
      return false
    }
  }
  return true
}

func fetchUserCodeByEmail(email string) (string, error) {
  var userCode string
  query := fmt.Sprintf("SELECT user_code FROM user_details WHERE email_id = '%s'", email)
  data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
  if err != nil {
    return "", fmt.Errorf("error fetching user_code for email %s: %v", email, err)
  }
  if len(data) == 0 {
    return "", fmt.Errorf("no user found for email %s", email)
  }
  userCode, ok := data[0]["user_code"].(string)
  if !ok {
    return "", fmt.Errorf("user_code is not of type string")
  }

  return userCode, nil
}

// fetching sales_partner_name by using partner_id
func fetchSalesPartnerNameById(partnerId string) (string, error) {
  var salesPartnerName string
  query := "SELECT sales_partner_name FROM sales_partner_dbhub_schema WHERE partner_id = $1"
  data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{partnerId})
  if err != nil {
    return "", fmt.Errorf("sales partner with id %s not found", partnerId)
  }
  if len(data) == 0 {
    return "", fmt.Errorf("no user found for email %s", partnerId)
  }
  salesPartnerName, ok := data[0]["sales_partner_name"].(string)
  if !ok {
    return "", fmt.Errorf("sales_partner_name is not of type string")
  }
  return salesPartnerName, nil
}
