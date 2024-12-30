package services

import (
	"OWEApp/shared/types"
	"time"
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
