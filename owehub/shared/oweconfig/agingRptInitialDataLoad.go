package oweconfig

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"strings"
	"time"
)

type InitialAgngRpStruct struct {
	Unique_ID                     string
	Project_Status                string
	Customer                      string
	System_Size                   float64
	Contract_Date                 time.Time
	Site_Survey_Scheduled_Date    time.Time
	Site_Survey_Completed_Date    time.Time
	NTP_Working_Date              time.Time
	NTP_Date                      time.Time
	Permit_Created                time.Time
	Permit_Submitted_Date         time.Time
	Permit_Approved_Date          time.Time
	IC_Created_Date               time.Time
	IC_Submitted_Date             time.Time
	IC_Approved_Date              time.Time
	Dealer_For_Plecto             string
	Permit_Expected_Approval_Date time.Time
	IC_Expected_Approval_Date     time.Time
	PV_Install_Created_Date       time.Time
	PV_Install_Completed_Date     time.Time
	PTO_Created_Date              time.Time
	PTO_Submitted_Date            time.Time
	PTO_Date                      time.Time
	First_Time_CAD_Complete_Date  time.Time
	Most_Recent_CAD_Complete_Date time.Time
	PE_EE_Submitted_Date          time.Time
	PE_EE_Complete_Date           time.Time
	FIN_Scheduled_Date            time.Time
	FIN_Rescheduled_Date          time.Time
	FIN_Fail_Date                 time.Time
	FIN_Pass_Date                 time.Time
	Install_Scheduled             time.Time
	Install_ETA                   time.Time
	Install_Complete              time.Time
	Primary_Sales_Rep             string
	Pre_Post_Install              string
	Tier_One_Status               string
	What_Tier_One                 string
	When_Tier_One                 string
	How_Tier_One                  string
	Project_Age_Days              string
	Solar_Journey                 string
}

type InitialAgngRPDataLists struct {
	InitialAgngRpDataList []InitialAgngRpStruct
}

func LoadAgngRpInitialData(uniqueIds []string) (InitialDataa InitialAgngRPDataLists, err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadAgngRpInitialData")
	defer func() { log.ExitFn(0, "LoadAgngRpInitialData", err) }()
	query = `
SELECT
    customers_customers_schema.unique_id,
    customers_customers_schema.project_status,
    customers_customers_schema.customer_name,
    system_customers_schema.contracted_system_size_parent AS system_size,
    customers_customers_schema.sale_date AS contract_date,
    survey_survey_schema.original_survey_scheduled_date AS site_survey_scheduled_date,
    survey_survey_schema.survey_completion_date AS site_survey_completed_date,
    ntp_ntp_schema.pending_ntp_date AS ntp_working_date,
    ntp_ntp_schema.ntp_complete_date AS ntp_date,
    permit_fin_pv_permits_schema.created_on AS permit_created,
    permit_fin_pv_permits_schema.pv_submitted AS permit_submitted_date,
    permit_fin_pv_permits_schema.pv_approved AS permit_approved_date,
    ic_ic_pto_schema.created_on AS ic_created_date,
    ic_ic_pto_schema.ic_submitted_date,
    ic_ic_pto_schema.ic_approved_date,
    permit_fin_pv_permits_schema.dealer_for_plecto,
    permit_fin_pv_permits_schema.pv_expected_approval_date AS permit_expected_approval_date,
    ic_ic_pto_schema.ic_estimated_approval_date AS ic_expected_approval_date,
    pv_install_install_subcontracting_schema.created_on AS pv_install_created_date,
    pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date,
    pto_ic_schema.pto_created_on AS pto_created_date,
    pto_ic_schema.submitted AS pto_submitted_date,
    pto_ic_schema.pto_granted AS pto_date,
    cad_cad_schema.first_time_cad_complete_date,
    cad_cad_schema.most_recent_cad_complete_date,
    pe_ee_stamps_cad_schema.submitted_date AS peee_submitted_date,
    pe_ee_stamps_cad_schema.completion_date AS peee_complete_date,
    fin_permits_fin_schema.pv_fin_date AS fin_scheduled_date,
    fin_permits_fin_schema.fin_rescheduled_date,
    project_mgmt_metrics_schema.fin_fail_date,
    fin_permits_fin_schema.approved_date AS fin_pass_date,
    system_customers_schema.install_scheduled_date,
    customers_customers_schema.install_eta_date,
    pv_install_install_subcontracting_schema.pv_completion_date as install_complete,
    customers_customers_schema.primary_sales_rep,
    customers_customers_schema.pre_post_install,
    customers_customers_schema.tier_one_status,
    customers_customers_schema.what_tier_one,
    customers_customers_schema.when_tier_one,
    customers_customers_schema.how_tier_one,
    customers_customers_schema.project_age_days,
    customers_customers_schema.solar_journey
FROM
    customers_customers_schema
LEFT JOIN
    system_customers_schema ON customers_customers_schema.unique_id = system_customers_schema.customer_id
LEFT JOIN
    survey_survey_schema ON survey_survey_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    ntp_ntp_schema ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
LEFT JOIN
    permit_fin_pv_permits_schema ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    ic_ic_pto_schema ON ic_ic_pto_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    pv_install_install_subcontracting_schema ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    pto_ic_schema ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    cad_cad_schema ON cad_cad_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    pe_ee_stamps_cad_schema ON pe_ee_stamps_cad_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    fin_permits_fin_schema ON fin_permits_fin_schema.customer_unique_id = customers_customers_schema.unique_id
LEFT JOIN
    project_mgmt_metrics_schema ON project_mgmt_metrics_schema.unique_id = customers_customers_schema.unique_id

WHERE
 customers_customers_schema.unique_id IS NOT NULL AND customers_customers_schema.unique_id != ''
`

	if len(uniqueIds) > 0 {
		// Create a string to hold the unique IDs for the SQL query
		placeholders := make([]string, len(uniqueIds))
		for i, id := range uniqueIds {
			placeholders[i] = fmt.Sprintf("'%s'", id) // Quote each ID for SQL
		}
		query += fmt.Sprintf(" AND customers_customers_schema.unique_id IN (%s)", strings.Join(placeholders, ","))
	}

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to inital data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch inital data from db")
		return InitialDataa, err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	for _, data := range dataList {
		var InitialData InitialAgngRpStruct

		if val, ok := checkField(data["unique_id"], "unique_id", "string"); ok {
			InitialData.Unique_ID = val.(string)
		} else {
			continue
		}

		if val, ok := checkField(data["project_status"], "project_status", "string"); ok {
			InitialData.Project_Status = val.(string)
		} else {
			InitialData.Project_Status = ""
		}

		if val, ok := checkField(data["customer_name"], "customer_name", "string"); ok {
			InitialData.Customer = val.(string)
		} else {
			InitialData.Customer = ""
		}

		if val, ok := checkField(data["system_size"], "system_size", "float64"); ok {
			InitialData.System_Size = val.(float64)
		} else {
			InitialData.System_Size = 0.0
		}

		if val, ok := checkField(data["contract_date"], "contract_date", "time.Time"); ok {
			InitialData.Contract_Date = val.(time.Time)
		} else {
			InitialData.Contract_Date = time.Time{}
		}

		if val, ok := checkField(data["site_survey_scheduled_date"], "site_survey_scheduled_date", "time.Time"); ok {
			InitialData.Site_Survey_Scheduled_Date = val.(time.Time)
		} else {
			InitialData.Site_Survey_Scheduled_Date = time.Time{}
		}

		if val, ok := checkField(data["site_survey_completed_date"], "site_survey_completed_date", "time.Time"); ok {
			InitialData.Site_Survey_Completed_Date = val.(time.Time)
		} else {
			InitialData.Site_Survey_Completed_Date = time.Time{}
		}

		if val, ok := checkField(data["ntp_working_date"], "ntp_working_date", "time.Time"); ok {
			InitialData.NTP_Working_Date = val.(time.Time)
		} else {
			InitialData.NTP_Working_Date = time.Time{}
		}

		if val, ok := checkField(data["ntp_date"], "ntp_date", "time.Time"); ok {
			InitialData.NTP_Date = val.(time.Time)
		} else {
			InitialData.NTP_Date = time.Time{}
		}

		if val, ok := checkField(data["permit_created"], "permit_created", "time.Time"); ok {
			InitialData.Permit_Created = val.(time.Time)
		} else {
			InitialData.Permit_Created = time.Time{}
		}

		if val, ok := checkField(data["permit_submitted_date"], "permit_submitted_date", "time.Time"); ok {
			InitialData.Permit_Submitted_Date = val.(time.Time)
		} else {
			InitialData.Permit_Submitted_Date = time.Time{}
		}

		if val, ok := checkField(data["permit_approved_date"], "permit_approved_date", "time.Time"); ok {
			InitialData.Permit_Approved_Date = val.(time.Time)
		} else {
			InitialData.Permit_Approved_Date = time.Time{}
		}

		if val, ok := checkField(data["ic_created_date"], "ic_created_date", "time.Time"); ok {
			InitialData.IC_Created_Date = val.(time.Time)
		} else {
			InitialData.IC_Created_Date = time.Time{}
		}

		if val, ok := checkField(data["ic_submitted_date"], "ic_submitted_date", "time.Time"); ok {
			InitialData.IC_Submitted_Date = val.(time.Time)
		} else {
			InitialData.IC_Submitted_Date = time.Time{}
		}

		if val, ok := checkField(data["ic_approved_date"], "ic_approved_date", "time.Time"); ok {
			InitialData.IC_Approved_Date = val.(time.Time)
		} else {
			InitialData.IC_Approved_Date = time.Time{}
		}

		if val, ok := checkField(data["dealer_for_plecto"], "dealer_for_plecto", "string"); ok {
			InitialData.Dealer_For_Plecto = val.(string)
		} else {
			InitialData.Dealer_For_Plecto = ""
		}

		if val, ok := checkField(data["permit_expected_approval_date"], "permit_expected_approval_date", "time.Time"); ok {
			InitialData.Permit_Expected_Approval_Date = val.(time.Time)
		} else {
			InitialData.Permit_Expected_Approval_Date = time.Time{}
		}

		if val, ok := checkField(data["ic_expected_approval_date"], "ic_expected_approval_date", "time.Time"); ok {
			InitialData.IC_Expected_Approval_Date = val.(time.Time)
		} else {
			InitialData.IC_Expected_Approval_Date = time.Time{}
		}

		if val, ok := checkField(data["pv_install_created_date"], "pv_install_created_date", "time.Time"); ok {
			InitialData.PV_Install_Created_Date = val.(time.Time)
		} else {
			InitialData.PV_Install_Created_Date = time.Time{}
		}

		if val, ok := checkField(data["pv_install_completed_date"], "pv_install_completed_date", "time.Time"); ok {
			InitialData.PV_Install_Completed_Date = val.(time.Time)
		} else {
			InitialData.PV_Install_Completed_Date = time.Time{}
		}

		if val, ok := checkField(data["pto_created_date"], "pto_created_date", "time.Time"); ok {
			InitialData.PTO_Created_Date = val.(time.Time)
		} else {
			InitialData.PTO_Created_Date = time.Time{}
		}

		if val, ok := checkField(data["pto_submitted_date"], "pto_submitted_date", "time.Time"); ok {
			InitialData.PTO_Submitted_Date = val.(time.Time)
		} else {
			InitialData.PTO_Submitted_Date = time.Time{}
		}

		if val, ok := checkField(data["pto_date"], "pto_date", "time.Time"); ok {
			InitialData.PTO_Date = val.(time.Time)
		} else {
			InitialData.PTO_Date = time.Time{}
		}

		if val, ok := checkField(data["first_time_cad_complete_date"], "first_time_cad_complete_date", "time.Time"); ok {
			InitialData.First_Time_CAD_Complete_Date = val.(time.Time)
		} else {
			InitialData.First_Time_CAD_Complete_Date = time.Time{}
		}

		if val, ok := checkField(data["most_recent_cad_complete_date"], "most_recent_cad_complete_date", "time.Time"); ok {
			InitialData.Most_Recent_CAD_Complete_Date = val.(time.Time)
		} else {
			InitialData.Most_Recent_CAD_Complete_Date = time.Time{}
		}

		if val, ok := checkField(data["peee_submitted_date"], "peee_submitted_date", "time.Time"); ok {
			InitialData.PE_EE_Submitted_Date = val.(time.Time)
		} else {
			InitialData.PE_EE_Submitted_Date = time.Time{}
		}

		if val, ok := checkField(data["peee_complete_date"], "peee_complete_date", "time.Time"); ok {
			InitialData.PE_EE_Complete_Date = val.(time.Time)
		} else {
			InitialData.PE_EE_Complete_Date = time.Time{}
		}

		if val, ok := checkField(data["fin_scheduled_date"], "fin_scheduled_date", "time.Time"); ok {
			InitialData.FIN_Scheduled_Date = val.(time.Time)
		} else {
			InitialData.FIN_Scheduled_Date = time.Time{}
		}

		if val, ok := checkField(data["fin_rescheduled_date"], "fin_rescheduled_date", "time.Time"); ok {
			InitialData.FIN_Rescheduled_Date = val.(time.Time)
		} else {
			InitialData.FIN_Rescheduled_Date = time.Time{}
		}

		if val, ok := checkField(data["fin_fail_date"], "fin_fail_date", "time.Time"); ok {
			InitialData.FIN_Fail_Date = val.(time.Time)
		} else {
			InitialData.FIN_Fail_Date = time.Time{}
		}

		if val, ok := checkField(data["fin_pass_date"], "fin_pass_date", "time.Time"); ok {
			InitialData.FIN_Pass_Date = val.(time.Time)
		} else {
			InitialData.FIN_Pass_Date = time.Time{}
		}

		if val, ok := checkField(data["install_scheduled_date"], "install_scheduled_date", "time.Time"); ok {
			InitialData.Install_Scheduled = val.(time.Time)
		} else {
			InitialData.Install_Scheduled = time.Time{}
		}

		if val, ok := checkField(data["install_eta_date"], "install_eta_date", "time.Time"); ok {
			InitialData.Install_ETA = val.(time.Time)
		} else {
			InitialData.Install_ETA = time.Time{}
		}

		if val, ok := checkField(data["install_complete"], "install_complete", "time.Time"); ok {
			InitialData.Install_Complete = val.(time.Time)
		} else {
			InitialData.Install_Complete = time.Time{}
		}

		if val, ok := checkField(data["primary_sales_rep"], "primary_sales_rep", "string"); ok {
			InitialData.Primary_Sales_Rep = val.(string)
		} else {
			InitialData.Primary_Sales_Rep = ""
		}

		if val, ok := checkField(data["pre_post_install"], "pre_post_install", "string"); ok {
			InitialData.Pre_Post_Install = val.(string)
		} else {
			InitialData.Pre_Post_Install = ""
		}

		if val, ok := checkField(data["tier_one_status"], "tier_one_status", "string"); ok {
			InitialData.Tier_One_Status = val.(string)
		} else {
			InitialData.Tier_One_Status = ""
		}

		if val, ok := checkField(data["what_tier_one"], "what_tier_one", "string"); ok {
			InitialData.What_Tier_One = val.(string)
		} else {
			InitialData.What_Tier_One = ""
		}

		if val, ok := checkField(data["when_tier_one"], "when_tier_one", "string"); ok {
			InitialData.When_Tier_One = val.(string)
		} else {
			InitialData.When_Tier_One = ""
		}

		if val, ok := checkField(data["how_tier_one"], "how_tier_one", "string"); ok {
			InitialData.How_Tier_One = val.(string)
		} else {
			InitialData.How_Tier_One = ""
		}

		if val, ok := checkField(data["project_age_days"], "project_age_days", "string"); ok {
			InitialData.Project_Age_Days = val.(string)
		} else {
			InitialData.Project_Age_Days = ""
		}

		if val, ok := checkField(data["solar_journey"], "solar_journey", "string"); ok {
			InitialData.Solar_Journey = val.(string)
		} else {
			InitialData.Solar_Journey = ""
		}

		InitialDataa.InitialAgngRpDataList = append(InitialDataa.InitialAgngRpDataList, InitialData)

	}

	return InitialDataa, err
}

func checkField(value interface{}, fieldName string, targetType string) (interface{}, bool) {
	if value == nil {
		log.FuncErrorTrace(0, "Warning: %s is nil", fieldName)
		return nil, false
	}
	switch targetType {
	case "string":
		if strVal, ok := value.(string); ok {
			return strVal, true
		}
	case "float64":
		if floatVal, ok := value.(float64); ok {
			return floatVal, true
		}
	case "time.Time":
		if timeVal, ok := value.(time.Time); ok {
			return timeVal, true
		}
	}
	log.FuncErrorTrace(0, "Error: %s is not a %s. Value: %v", fieldName, targetType, value)
	return nil, false
}
