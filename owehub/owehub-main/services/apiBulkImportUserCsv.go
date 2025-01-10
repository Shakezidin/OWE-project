/**************************************************************************
* File                  : apiBulkImportUserCsv.go
* DESCRIPTION           : This file contains a function to read data from a CSV file
*                         and store the parsed data into a database.
*
* DATE                  : 9-Jan-2024
**************************************************************************/

package services

import (
    "OWEApp/shared/appserver"
    "OWEApp/shared/db"
    log "OWEApp/shared/logger"
    models "OWEApp/shared/models"
    "encoding/csv"
    "fmt"
    "io"
    "net/http"
    "strings"
)

/******************************************************************************
 * FUNCTION:			HandleBulkImportUsersCsvRequest
 * DESCRIPTION:     Handles the file upload, parses the CSV file,
 *                  and stores the data into the database.
 * INPUT:			  (response writer), r (request)
 * RETURNS:    		void
 ******************************************************************************/

func HandleBulkImportUsersCsvRequest(resp http.ResponseWriter, req *http.Request) {
    type ImportResult struct {
        TotalProcessed int      `json:"total_processed"`
        Successful     int      `json:"successful"`
        Failed         int      `json:"failed"`
        Errors         []string `json:"errors"`
    }

    result := ImportResult{
        Errors: make([]string, 0),
    }

    // Parse multipart form
    err := req.ParseMultipartForm(10 << 20)
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

    //each row of excellll
    for {
        record, err := reader.Read()
        if err == io.EOF {
            break
        }
        if err != nil {
            log.FuncErrorTrace(0, "Error reading CSV row: %v", err)
            result.Failed++
            result.Errors = append(result.Errors, fmt.Sprintf("Row error: %v", err))
            continue
        }


        if isEmptyRow(record) {
            continue
        }

        result.TotalProcessed++


        createUserReq := models.CreateUserReq{
            Name:             getValue(headers, record, "name"),
            EmailId:          getValue(headers, record, "email_id"),
            MobileNumber:     getValue(headers, record, "mobile_number"),
            Designation:      getValue(headers, record, "designation"),
            RoleName:         getValue(headers, record, "role_name"),
            Password:         "Welcome@123",
            PasswordChangeReq: true,
            Dealer:           getValue(headers, record, "dealer"),
            UserStatus:       "Active",
        }


        log.FuncErrorTrace(0, "Mapped user data: Name=%s, Email=%s, Mobile=%s, Designation=%s, Role=%s",
            createUserReq.Name,
            createUserReq.EmailId,
            createUserReq.MobileNumber,
            createUserReq.Designation,
            createUserReq.RoleName)


        if !isValidUser(createUserReq) {
            result.Failed++
            result.Errors = append(result.Errors, fmt.Sprintf("Invalid data for user: %s", createUserReq.EmailId))
            continue
        }

        hashedPassBytes, err := GenerateHashPassword(createUserReq.Password)
        if err != nil {
            log.FuncErrorTrace(0, "Password hash failed for user: %s, error: %v", createUserReq.EmailId, err)
            result.Failed++
            result.Errors = append(result.Errors, fmt.Sprintf("Password hash failed for user: %s", createUserReq.EmailId))
            continue
        }


        queryParameters := []interface{}{
            createUserReq.Name,
            "",
            createUserReq.MobileNumber,
            strings.ToLower(createUserReq.EmailId),
            string(hashedPassBytes),
            createUserReq.PasswordChangeReq,
            createUserReq.ReportingManager,
            createUserReq.DealerOwner,
            createUserReq.RoleName,
            createUserReq.UserStatus,
            createUserReq.Designation,
            createUserReq.Description,
            createUserReq.Region,
            createUserReq.StreetAddress,
            createUserReq.State,
            createUserReq.City,
            createUserReq.Zipcode,
            createUserReq.Country,
            createUserReq.TeamName,
            createUserReq.Dealer,
            createUserReq.DealerLogo,
            createUserReq.AddToPodio,
            nil,
        }


        _, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateUserFunction, queryParameters)
        if err != nil {
            log.FuncErrorTrace(0, "DB error for user %s: %v", createUserReq.EmailId, err)
            result.Failed++
            result.Errors = append(result.Errors, fmt.Sprintf("DB error for user %s: %v", createUserReq.EmailId, err))
            continue
        }

        result.Successful++
    }


    appserver.FormAndSendHttpResp(resp, "Bulk import completed", http.StatusOK, result)
}


func getValue(headers []string, record []string, key string) string {
    for i, h := range headers {

        if strings.EqualFold(strings.TrimSpace(h), strings.TrimSpace(key)) && i < len(record) {
            return strings.TrimSpace(record[i])
        }
    }
    return ""
}

func isValidUser(user models.CreateUserReq) bool {
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
