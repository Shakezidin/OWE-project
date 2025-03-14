package oweconfig

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"strings"
	"time"
)

type InitialAgngRpStruct struct {
	Unique_ID                 string
	Project_Status            string
	Customer                  string
	Contract_Date             time.Time
	NTP_Date                  time.Time
	Permit_Approved_Date      time.Time
	PV_Install_Completed_Date time.Time
	PTO_Date                  time.Time
	Install_Complete          time.Time
	Primary_Sales_Rep         string
	Project_Age_Days          string
	// System_Size                   float64
	// Site_Survey_Scheduled_Date    time.Time
	// Site_Survey_Completed_Date    time.Time
	// NTP_Working_Date              time.Time
	// Permit_Created                time.Time
	// Permit_Submitted_Date         time.Time
	// IC_Created_Date               time.Time
	// IC_Submitted_Date             time.Time
	// IC_Approved_Date              time.Time
	// Dealer_For_Plecto             string
	// Permit_Expected_Approval_Date time.Time
	// IC_Expected_Approval_Date     time.Time
	// PV_Install_Created_Date       time.Time
	// PTO_Created_Date              time.Time
	// PTO_Submitted_Date            time.Time
	// Plan_Set_Complete_Day         time.Time
	//Most_Recent_Plan_Set_H        time.Time
	// PE_EE_Submitted_Date          time.Time
	// PE_EE_Complete_Date           time.Time
	// FIN_Scheduled_Date            time.Time
	// FIN_Rescheduled_Date          time.Time
	// FIN_Fail_Date                 time.Time
	// FIN_Pass_Date                 time.Time
	// Install_Scheduled             time.Time
	// Install_ETA                   time.Time
	// Pre_Post_Install              string
	// Tier_One_Status               string
	// What_Tier_One                 string
	// When_Tier_One                 string
	// How_Tier_One                  string
	// Solar_Journey                 string
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
    customers_customers_schema.sale_date AS contract_date,
    ntp_ntp_schema.ntp_complete_date AS ntp_date,
    permit_fin_pv_permits_schema.pv_approved AS permit_approved_date,
    pv_install_install_subcontracting_schema.pv_completion_date AS pv_install_completed_date,
    pto_ic_schema.pto_granted AS pto_date,
    pv_install_install_subcontracting_schema.pv_completion_date as install_complete,
    customers_customers_schema.primary_sales_rep,
    customers_customers_schema.project_age_days
FROM
    customers_customers_schema
LEFT JOIN
    ntp_ntp_schema ON ntp_ntp_schema.unique_id = customers_customers_schema.unique_id
	AND ntp_ntp_schema.project_status NOT ILIKE '%DUPLICATE%' AND ntp_ntp_schema.app_status NOT ILIKE '%DUPLICATE%'
LEFT JOIN
    permit_fin_pv_permits_schema ON permit_fin_pv_permits_schema.customer_unique_id = customers_customers_schema.unique_id
	AND permit_fin_pv_permits_schema.project_status NOT ILIKE '%DUPLICATE%' AND permit_fin_pv_permits_schema.app_status NOT ILIKE '%DUPLICATE%'
LEFT JOIN
    pv_install_install_subcontracting_schema ON pv_install_install_subcontracting_schema.customer_unique_id = customers_customers_schema.unique_id
	AND pv_install_install_subcontracting_schema.project_status NOT ILIKE '%DUPLICATE%' AND pv_install_install_subcontracting_schema.app_status NOT ILIKE '%DUPLICATE%'
LEFT JOIN
    pto_ic_schema ON pto_ic_schema.customer_unique_id = customers_customers_schema.unique_id
	AND pto_ic_schema.project_status NOT ILIKE '%DUPLICATE%' 
WHERE
 customers_customers_schema.unique_id IS NOT NULL AND customers_customers_schema.unique_id != '' 
 AND customers_customers_schema.project_status NOT ILIKE '%DUPLICATE%'
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

		if val, ok := checkField(data["contract_date"], "contract_date", "time.Time"); ok {
			InitialData.Contract_Date = val.(time.Time)
		} else {
			InitialData.Contract_Date = time.Time{}
		}

		if val, ok := checkField(data["ntp_date"], "ntp_date", "time.Time"); ok {
			InitialData.NTP_Date = val.(time.Time)
		} else {
			InitialData.NTP_Date = time.Time{}
		}

		if val, ok := checkField(data["permit_approved_date"], "permit_approved_date", "time.Time"); ok {
			InitialData.Permit_Approved_Date = val.(time.Time)
		} else {
			InitialData.Permit_Approved_Date = time.Time{}
		}

		if val, ok := checkField(data["pv_install_completed_date"], "pv_install_completed_date", "time.Time"); ok {
			InitialData.PV_Install_Completed_Date = val.(time.Time)
		} else {
			InitialData.PV_Install_Completed_Date = time.Time{}
		}

		if val, ok := checkField(data["pto_date"], "pto_date", "time.Time"); ok {
			InitialData.PTO_Date = val.(time.Time)
		} else {
			InitialData.PTO_Date = time.Time{}
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

		if val, ok := checkField(data["project_age_days"], "project_age_days", "string"); ok {
			InitialData.Project_Age_Days = val.(string)
		} else {
			InitialData.Project_Age_Days = ""
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
		if fieldName == "install_scheduled_date" {
			if strVal, ok := value.(string); ok {
				// Parse the string into a time.Time object
				layout := "Mon Jan 02 2006 15:04:05 MST-0700 (MST)"
				parsedTime, err := time.Parse(layout, strVal)
				if err != nil {
					log.FuncErrorTrace(0, "Error parsing %s as time.Time: %v", fieldName, err)
					return nil, false
				}
				return parsedTime, true
			}
		} else if timeVal, ok := value.(time.Time); ok {
			return timeVal, true
		}
	}

	log.FuncErrorTrace(0, "Error: %s is not a %s. Value: %v", fieldName, targetType, value)
	return nil, false
}
