package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	oweconfig "OWEApp/shared/oweconfig"
	"fmt"
	"strings"
	"time"
)

func ExecAgingReportInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err                 error
		agingReportDataList []map[string]interface{}
		count               = 0
	)
	log.EnterFn(0, "ExecAgingReportInitialCalculation")
	defer func() { log.ExitFn(0, "ExecAgingReportInitialCalculation", err) }()

	var idList []string
	if uniqueIds != "" {
		idList = []string{uniqueIds}
	} else {
		idList = []string{}
	}

	InitailData, err := oweconfig.LoadAgngRpInitialData(idList)
	if err != nil {
		log.FuncErrorTrace(0, "error while loading initial data %v", err)
		return err
	}
	for _, data := range InitailData.InitialAgngRpDataList {

		agngRpData, err := CalculateAgngRp(data)
		if err != nil || agngRpData == nil {
			log.FuncErrorTrace(0, "Failed to calculate Aging Report err : %+v", err)
			return err

		}
		if hookType == "update" {
			// Build the update query

			query, _ := buildUpdateQuery("aging_report", agngRpData, "unique_id", data.Unique_ID)

			// Execute the update query

			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to update AgRp Data for unique id: %+v err: %+v", data.Unique_ID, err)
			}
		} else {
			agingReportDataList = append(agingReportDataList, agngRpData)
		}

		if (count+1)%1000 == 0 && len(agingReportDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "aging_report", agingReportDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial aging report  Data in DB err: %v", err)
				return err
			}
			agingReportDataList = nil // Clear the agingReportDataList
		}
		count++

	}
	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "aging_report", agingReportDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial aging report Data in DB err: %v", err)
		return err
	}

	return err
}

func CalculateAgngRp(agngRpData oweconfig.InitialAgngRpStruct) (outData map[string]interface{}, err error) {

	log.EnterFn(0, "CalculateAgngRp")
	defer func() { log.ExitFn(0, "CalculateAgngRp", err) }()

	outData = make(map[string]interface{})

	outData["unique_id"] = agngRpData.Unique_ID
	outData["project_status"] = agngRpData.Project_Status
	outData["customer_name"] = agngRpData.Customer
	outData["contract_date"] = agngRpData.Contract_Date
	outData["ntp_date"] = agngRpData.NTP_Date
	outData["permit_approved_date"] = agngRpData.Permit_Approved_Date
	outData["pv_install_completed_date"] = agngRpData.PV_Install_Completed_Date
	outData["pto_date"] = agngRpData.PTO_Date
	outData["install_complete"] = agngRpData.Install_Complete
	outData["primary_sales_rep"] = agngRpData.Primary_Sales_Rep
	outData["project_age_days"] = agngRpData.Project_Age_Days

	// outData["System_Size"] = agngRpData.System_Size
	// outData["site_survey_scheduled_date"] = agngRpData.Site_Survey_Scheduled_Date
	// outData["site_survey_completed_date"] = agngRpData.Site_Survey_Completed_Date
	// outData["ntp_working_date"] = agngRpData.NTP_Working_Date
	// outData["permit_created"] = agngRpData.Permit_Created
	// outData["permit_submitted_date"] = agngRpData.Permit_Submitted_Date
	// outData["ic_created_date"] = agngRpData.IC_Created_Date
	// outData["ic_submitted_date"] = agngRpData.IC_Submitted_Date
	// outData["ic_approved_date"] = agngRpData.IC_Approved_Date
	// outData["dealer_for_plecto"] = agngRpData.Dealer_For_Plecto
	// outData["permit_expected_approval_date"] = agngRpData.Permit_Expected_Approval_Date
	// outData["ic_expected_approval_date"] = agngRpData.IC_Expected_Approval_Date
	// outData["pv_install_created_date"] = agngRpData.PV_Install_Created_Date
	// outData["pto_created_date"] = agngRpData.PTO_Created_Date
	// outData["pto_submitted_date"] = agngRpData.PTO_Submitted_Date
	// outData["plan_set_complete_day"] = agngRpData.Plan_Set_Complete_Day
	// outData["most_recent_plan_set_h"] = agngRpData.Most_Recent_Plan_Set_H
	// outData["peee_submitted_date"] = agngRpData.PE_EE_Submitted_Date
	// outData["peee_complete_date"] = agngRpData.PE_EE_Complete_Date
	// outData["fin_scheduled_date"] = agngRpData.FIN_Scheduled_Date
	// outData["fin_rescheduled_date"] = agngRpData.FIN_Rescheduled_Date
	// outData["fin_fail_date"] = agngRpData.FIN_Fail_Date
	// outData["fin_pass_date"] = agngRpData.FIN_Pass_Date
	// outData["install_scheduled_date"] = agngRpData.Install_Scheduled
	// outData["install_eta_date"] = agngRpData.Install_ETA
	// outData["pre_post_install"] = agngRpData.Pre_Post_Install
	// outData["tier_one_status"] = agngRpData.Tier_One_Status
	// outData["what_tier_one"] = agngRpData.What_Tier_One
	// outData["when_tier_one"] = agngRpData.When_Tier_One
	// outData["how_tier_one"] = agngRpData.How_Tier_One
	// outData["solar_journey"] = agngRpData.Solar_Journey

	dayspendingNTP := calculateDaysPendingNTP(agngRpData.NTP_Date, agngRpData.Contract_Date, agngRpData.Project_Status)
	outData["days_pending_ntp"] = dayspendingNTP

	dayspendingPermit := calculateDaysPendingPermit(agngRpData.Permit_Approved_Date, agngRpData.NTP_Date, agngRpData.Project_Status, dayspendingNTP)
	outData["days_pending_permits"] = dayspendingPermit

	daysPendingInstall := calculateDaysPendingInstall(agngRpData.Install_Complete, agngRpData.Permit_Approved_Date, agngRpData.Project_Status, dayspendingPermit)
	outData["days_pending_install"] = daysPendingInstall

	outData["days_pending_pto"] = calculateDaysPendingPTO(agngRpData.PTO_Date, agngRpData.PV_Install_Completed_Date, agngRpData.Project_Status, daysPendingInstall)

	outData["project_age"] = calculateProjectAge(agngRpData.Unique_ID, agngRpData.Contract_Date)

	return outData, err
}

func calculateDaysPendingNTP(ntpDate, contractDate time.Time, projectStatus string) int {
	ntpDate = time.Date(ntpDate.Year(), ntpDate.Month(), ntpDate.Day(), 0, 0, 0, 0, ntpDate.Location())
	contractDate = time.Date(contractDate.Year(), contractDate.Month(), contractDate.Day(), 0, 0, 0, 0, contractDate.Location())
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	// Calculate days
	var daysPendingNtp int
	if !ntpDate.IsZero() && !contractDate.IsZero() {
		days := int(ntpDate.Sub(contractDate).Abs().Hours() / 24)
		daysPendingNtp = days
	} else if projectStatus == "ACTIVE" && !contractDate.IsZero() {
		days := int(today.Sub(contractDate).Abs().Hours() / 24)
		daysPendingNtp = days
	} else {
		daysPendingNtp = 0 // Represents an empty result
	}

	return daysPendingNtp
}

func calculateDaysPendingPermit(permitDate time.Time, ntpDate time.Time, projectStatus string, dayspendingNTP int) int {
	ntpDate = time.Date(ntpDate.Year(), ntpDate.Month(), ntpDate.Day(), 0, 0, 0, 0, ntpDate.Location())
	permitDate = time.Date(permitDate.Year(), permitDate.Month(), permitDate.Day(), 0, 0, 0, 0, permitDate.Location())
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	// Calculate days
	var daysPendingPermit int
	if !permitDate.IsZero() && !ntpDate.IsZero() {
		days := int(permitDate.Sub(ntpDate).Abs().Hours() / 24)
		daysPendingPermit = days
	} else if !ntpDate.IsZero() {
		if projectStatus == "ACTIVE" {
			days := int(today.Sub(ntpDate).Abs().Hours() / 24)
			daysPendingPermit = days
		} else {
			daysPendingPermit = 0
		}
	} else {
		daysPendingPermit = dayspendingNTP
	}

	return daysPendingPermit
}

func calculateDaysPendingInstall(installDate time.Time, permitDate time.Time, projectStatus string, dayspendingPermit int) int {
	installDate = time.Date(installDate.Year(), installDate.Month(), installDate.Day(), 0, 0, 0, 0, installDate.Location())
	permitDate = time.Date(permitDate.Year(), permitDate.Month(), permitDate.Day(), 0, 0, 0, 0, permitDate.Location())
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	// If installComplete is not empty, calculate the difference between installComplete and permitApprovedDate
	if !installDate.IsZero() && !permitDate.IsZero() {
		// Pass the Duration directly to absDuration
		return int(installDate.Sub(permitDate).Abs().Hours() / 24)
	} else if !permitDate.IsZero() {
		// If projectStatus is "ACTIVE", calculate the difference between today and permitApprovedDate
		if projectStatus == "ACTIVE" {
			// Pass the Duration directly to absDuration
			return int(today.Sub(permitDate).Abs().Hours() / 24)
		} else {
			return 0
		}
	} else {
		return dayspendingPermit
	}
}

func calculateDaysPendingPTO(ptoDate time.Time, pvInstallCompleteDate time.Time, projectStatus string, daysPendingInstall int) int {
	var daysPendingPto int
	ptoDate = time.Date(ptoDate.Year(), ptoDate.Month(), ptoDate.Day(), 0, 0, 0, 0, ptoDate.Location())
	pvInstallCompleteDate = time.Date(pvInstallCompleteDate.Year(), pvInstallCompleteDate.Month(), pvInstallCompleteDate.Day(), 0, 0, 0, 0, pvInstallCompleteDate.Location())
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	// Check if both ptoDate and pvInstallCompleteDate are not empty
	if !ptoDate.IsZero() && !pvInstallCompleteDate.IsZero() {
		daysPendingPto = int(ptoDate.Sub(pvInstallCompleteDate).Abs().Hours() / 24) // Calculate days between ptoDate and pvInstallCompleteDate
	} else if projectStatus == "ACTIVE" && !pvInstallCompleteDate.IsZero() {
		daysPendingPto = int(today.Sub(pvInstallCompleteDate).Abs().Hours() / 24) // Calculate days from today to pvInstallCompleteDate
	} else {
		daysPendingPto = daysPendingInstall
	}

	return daysPendingPto
}

func calculateProjectAge(uniqueId string, contractDate time.Time) int {
	var projectAge int
	contractDate = time.Date(contractDate.Year(), contractDate.Month(), contractDate.Day(), 0, 0, 0, 0, contractDate.Location())
	today := time.Now()
	today = time.Date(today.Year(), today.Month(), today.Day(), 0, 0, 0, 0, today.Location())

	if uniqueId != "" && !contractDate.IsZero() {
		projectAge = int(today.Sub(contractDate).Abs().Hours() / 24) // Calculate days from today
	} else {
		projectAge = 0
	}

	return projectAge
}

func ClearAgingRp() error {

	log.EnterFn(0, "ClearAgingRp")
	defer func() { log.ExitFn(0, "ClearAgingRp", nil) }()

	query := `TRUNCATE TABLE aging_report`
	err := db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		return fmt.Errorf("error while truncating aging_report db: %v", err)
	}
	return nil
}

func DeleteFromAgRp(uniqueIDs []string) error {

	log.EnterFn(0, "DeleteFromAgRp")
	defer func() { log.ExitFn(0, "DeleteFromAgRp", nil) }()
	// Ensure there are IDs to delete
	if len(uniqueIDs) == 0 {
		log.FuncErrorTrace(0, "No unique IDs provided for deletion in DeleteFromAgRp.")
		return nil
	}

	quotedIDs := make([]string, len(uniqueIDs))
	for i, id := range uniqueIDs {
		quotedIDs[i] = fmt.Sprintf("'%s'", id)
	}

	// Join the quoted IDs with commas
	query := fmt.Sprintf("DELETE FROM aging_report WHERE unique_id IN (%s);", strings.Join(quotedIDs, ", "))

	// Execute the delete query
	err := db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		return fmt.Errorf("failed to delete rows from aging_report: %w", err)
	}

	log.FuncErrorTrace(0, "Deleted %d rows from aging_report table  .\n", len(uniqueIDs))
	return nil
}
