/**************************************************************************
 *	Function        : reportsConfig.go
 *  DESCRIPTION     : This file contains structures for reports app configuration
 *  DATE            : 5-May-2023
 **************************************************************************/
package models

type ReportsOfficeMappingItem struct {
	DBOfficeName     string `json:"db_office_name"`
	ReportOfficeName string `json:"report_office_name"`
}

// bidirectional mapping for db office name to report office name and vice versa
type ReportsOfficeMapping struct {
	DbToReportMap map[string]string
	ReportToDbMap map[string][]string
}
