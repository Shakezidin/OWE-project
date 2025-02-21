package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/lib/pq"
)

func getString(item map[string]interface{}, key string) string {
	if val, ok := item[key]; ok && val != nil {
		if strVal, ok := val.(string); ok {
			return strVal
		}
	}
	return ""
}

func getTime(item map[string]interface{}, key string) time.Time {
	if val, ok := item[key]; ok && val != nil {
		if timeVal, ok := val.(time.Time); ok {
			return timeVal
		}
	}
	return time.Time{}
}

// Get DB office name from report office name via office mapping config
func getDBOfficeNames(reportOfficeName string) []string {
	dbOfficeName, ok := types.CommGlbCfg.ReportsOfficeMapping.ReportToDbMap[reportOfficeName]
	if !ok {
		return []string{reportOfficeName}
	}
	return dbOfficeName
}

// Get report office name from DB office name via office mapping config
func getReportOfficeName(dbOfficeName string) string {
	reportOfficeName, ok := types.CommGlbCfg.ReportsOfficeMapping.DbToReportMap[dbOfficeName]
	if !ok {
		return dbOfficeName
	}
	return reportOfficeName
}

// Get user id by production targets logic:
//
// 1. Admins can set overall targets, all admins can see overall targets; so same user_id for all admins
//
// 2. Admins can see all targets for all user_ids (provided username is not "all")
//
// 3. Non admins can see only their own target
func getProdTargetUserId(reqCtx context.Context, username string) (int64, error) {
	var (
		err          error
		query        string
		isAdmin      bool
		data         []map[string]interface{}
		whereEleList []interface{}
	)

	log.EnterFn(0, "getProdTargetUserId")
	defer func() { log.ExitFn(0, "getProdTargetUserId", err) }()

	authRole, ok := reqCtx.Value("rolename").(string)
	if !ok {
		return 0, fmt.Errorf("failed to get rolename from request")
	}
	authEmail, ok := reqCtx.Value("emailid").(string)
	if !ok {
		return 0, fmt.Errorf("failed to get emailid from request")
	}
	isAdmin = authRole == string(types.RoleAdmin)

	// admins; overall targets
	if isAdmin && strings.ToLower(username) == "all" {
		return 1, nil
	}

	// admin can see targets by username
	if isAdmin && strings.ToLower(username) != "all" {
		query = "SELECT user_id FROM user_details WHERE name = $1"
		whereEleList = []interface{}{username}
	}

	if !isAdmin {
		query = "SELECT user_id FROM user_details WHERE email_id = $1"
		whereEleList = []interface{}{authEmail}
	}

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "failed to get user id for %s, err: %v", username, err)
		return 0, fmt.Errorf("failed to get data from DB")
	}

	if len(data) == 0 {
		return 0, fmt.Errorf("user %s not found", username)
	}

	userId, ok := data[0]["user_id"].(int64)
	if !ok {
		return 0, fmt.Errorf("failed to get user id for %s", username)
	}

	return userId, nil
}

// get states for owe goals
func getGoalStates() []string {
	states := []string{"Colorado", "Arizona", "Texas", "New Mexico", "Nevada"}
	return states
}
func getGoalAMs() ([]string, error) {
	var whereEleList []interface{}
	var responseData []string

	names := []string{"Taylor Ramsthel", "Josh Morton", "Adam Doty"}
	query := `SELECT name FROM USER_DETAILS WHERE name = ANY($1)`

	whereEleList = append(whereEleList, pq.Array(names))
	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "failed to get name of AMs, err: %v", err)
		return nil, fmt.Errorf("failed to get AM data from DB")
	}

	for _, val := range data {
		if name, ok := val["name"].(string); ok {
			responseData = append(responseData, name)
		} else {
			log.FuncErrorTrace(0, "name of AM is not string")
			continue
		}
	}

	return responseData, nil

}
