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
	"regexp"
	"strconv"
	"strings"
	"unicode"
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
	PartnerName       string `json:"partner_name"`
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
			Designation:       "",
			Description:       getValue(headers, record, "description"),
			RoleName:          getValue(headers, record, "role_name"),
			Password:          "Welcome@123",
			PasswordChangeReq: true,
			UserStatus:        "Active",
			ReportingManager:  "",
			PartnerName:         getValue(headers, record, "partner_name"),
		}

		/****************************8handling fields****************************/

    /****************** ALL REQUIED FIELDS *****************/
    if len(CreateBulkUserReq.Name) == 0 || len(CreateBulkUserReq.Name) > 50 {
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Invalid name length for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

    if _, err := strconv.Atoi(CreateBulkUserReq.Name); err == nil {
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Name cannot be an integer for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

    if len(CreateBulkUserReq.EmailId) == 0 || len(CreateBulkUserReq.EmailId) > 50 {
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Invalid email length for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

    if !isValidEmail(CreateBulkUserReq.EmailId) {
      result.Failed++
      result.Errors = append(result.Errors, fmt.Sprintf("Invalid email format for user: %s", CreateBulkUserReq.EmailId))
      continue
    }

		if !isAlphaWithSpace(CreateBulkUserReq.Name) {
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Name must contain only alphabetic characters and single spaces between words for user: %s", CreateBulkUserReq.EmailId))
			continue
		}

		if len(CreateBulkUserReq.MobileNumber) < 10 || len(CreateBulkUserReq.MobileNumber) > 15 {
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Invalid mobile number length for user: %s", CreateBulkUserReq.EmailId))
			continue
		}

		if _, err := strconv.Atoi(CreateBulkUserReq.MobileNumber); err != nil {
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Mobile number is not an integer for user: %s", CreateBulkUserReq.EmailId))
			continue
		}

		if len(CreateBulkUserReq.RoleName) == 0 || len(CreateBulkUserReq.RoleName) > 50 {
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Invalid role name length for user: %s", CreateBulkUserReq.EmailId))
			continue
		}


/**************************OPTIONAL FOR SOME ROLES ************************************/

		if len(CreateBulkUserReq.PartnerName) > 50 {
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Invalid partner ID length for user: %s", CreateBulkUserReq.EmailId))
			continue
		}

		// if !isValidUser(CreateBulkUserReq) {
		//   result.Failed++
		//   result.Errors = append(result.Errors, fmt.Sprintf("Invalid data for user: %s", CreateBulkUserReq.EmailId))
		//   continue
		// }

		/**************************************************/

		reportingManagerEmail := getValue(headers, record, "reporting_manager")

		var reportingManagerRequired bool = !(CreateBulkUserReq.RoleName == "Admin" ||
			CreateBulkUserReq.RoleName == "Finance Admin" ||
			CreateBulkUserReq.RoleName == "DB User" ||
			CreateBulkUserReq.RoleName == "Dealer Owner" ||
			CreateBulkUserReq.RoleName == "Account Manager" ||
			CreateBulkUserReq.RoleName == "Account Executive" ||
			CreateBulkUserReq.RoleName == "Project Manager")

		if !reportingManagerRequired && reportingManagerEmail != "" {
			log.FuncErrorTrace(0, "Role %s cannot have a reporting manager: %s", CreateBulkUserReq.RoleName, reportingManagerEmail)
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Role %s cannot have a reporting manager", CreateBulkUserReq.RoleName))
			continue
		}

		if reportingManagerRequired && reportingManagerEmail != "" {
			reportingManagerCode, err := fetchUserCodeByEmail(reportingManagerEmail)
			if err != nil {
				log.FuncErrorTrace(0, "Error fetching reporting manager code for email: %s, error: %v", reportingManagerEmail, err)
				result.Failed++
				result.Errors = append(result.Errors, fmt.Sprintf("Error fetching reporting manager code for email: %s", reportingManagerEmail))
				continue
			}
			CreateBulkUserReq.ReportingManager = reportingManagerCode
		}









		// handling partner_name conditions , these roles cant have partner_name ....
		partnerName := getValue(headers, record, "partner_name")

		var partnerIdRequired bool = !(CreateBulkUserReq.RoleName == "Admin" ||
			CreateBulkUserReq.RoleName == "Finance Admin" ||
			CreateBulkUserReq.RoleName == "DB User" ||
			CreateBulkUserReq.RoleName == "Account Manager" ||
			CreateBulkUserReq.RoleName == "Account Executive" ||
			CreateBulkUserReq.RoleName == "Project Manager")

		if !partnerIdRequired && partnerName != "" {
			log.FuncErrorTrace(0, "Role %s should not have a partner name: %s", CreateBulkUserReq.RoleName, CreateBulkUserReq.PartnerName)
			result.Failed++
			result.Errors = append(result.Errors, fmt.Sprintf("Role %s should not have a partner_name", CreateBulkUserReq.RoleName))
			continue
		}

		if partnerIdRequired {
			salesPartnerName, err := fetchCorrectSalesPartnerName(partnerName)
			if err != nil {
				log.FuncErrorTrace(0, "Error fetching sales partner name for : %s, error: %v", partnerName, err)
				result.Failed++
				result.Errors = append(result.Errors, fmt.Sprintf("Error fetching sales partner name for : %s", partnerName))
				continue
			}
			CreateBulkUserReq.PartnerName = partnerName
			CreateBulkUserReq.SalesPartnerName = salesPartnerName
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

// func isValidUser(user CreateBulkUserReq) bool {
//   valid := len(user.Name) > 0 && len(user.Name) <= 50 &&
//     len(user.EmailId) > 0 &&
//     len(user.MobileNumber) > 0 &&
//     len(user.RoleName) > 0

//   if !valid {
//     log.FuncErrorTrace(0, "invalid user data: Name=%s, Email=%s, Mobile=%s, Role=%s",
//       user.Name,
//       user.EmailId,
//       user.MobileNumber,
//       user.RoleName)
//   }

//   return valid
// }

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
	query := "SELECT user_code FROM user_details WHERE LOWER(email_id) = LOWER($1)"
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{email})
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

// fetching sales_partner_name by using partner_name
func fetchCorrectSalesPartnerName(partnerName string) (string, error) {
  var salesPartnerName string
  query := "SELECT sales_partner_name FROM sales_partner_dbhub_schema WHERE LOWER(sales_partner_name) = LOWER($1)"
  data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{partnerName})
  if err != nil {
    return "", fmt.Errorf("sales partner with name %s not found", partnerName)
  }
  if len(data) == 0 {
    return "", fmt.Errorf("no sales partner found for name %s", partnerName)
  }
  salesPartnerName, ok := data[0]["sales_partner_name"].(string)
  if !ok {
    return "", fmt.Errorf("sales_partner_name is not of type string")
  }
  return salesPartnerName, nil
}

func isValidEmail(email string) bool {
	// validationnn
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return emailRegex.MatchString(email)
}


func isAlphaWithSpace(s string) bool {
	for i, r := range s {
		if !unicode.IsLetter(r) && !(r == ' ' && i > 0 && s[i-1] != ' ') {
			return false
		}
	}
	return true
}