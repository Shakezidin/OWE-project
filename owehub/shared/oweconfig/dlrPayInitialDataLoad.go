/**************************************************************************
* File            : dlrPayInitailDataLoad.go
* DESCRIPTION     : This file contains the model and data form dealer pay initila data
                     on which we need to perform calculations
* DATE            : 17-Oct-2024
**************************************************************************/

package oweconfig

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type InitialStruct struct {
	HomeOwner         string
	CurrectStatus     string
	UniqueId          string
	DealerCode        string
	SystemSize        float64
	ContractDolDol    float64
	OtherAdders       string
	Rep1              string
	Rep2              string
	Setter            string
	ST                string
	ContractDate      time.Time
	NetEpc            float64
	NtpCompleteDate   time.Time
	PvComplettionDate time.Time
	// RL                float64
	// DrawMax        float64
	FinanceType    string
	FinanceCompany string
	AdderBreakDown string
}

type InitialDataLists struct {
	InitialDataList []InitialStruct
}

func LoadDlrPayInitialData(uniqueIds []string) (InitialData InitialDataLists, err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadDlrPayInitialData")
	defer func() { log.ExitFn(0, "LoadDlrPayInitialData", err) }()

	// uidList := []string{"OUR21563"} //OUR21190
	query = `SELECT cs.customer_name, cs.project_status, cs.unique_id, cs.dealer, cs.adder_breakdown_and_total_new,
			 cs.contracted_system_size, cs.total_system_cost,cs.adder_breakdown_and_total_new,
			 cs.primary_sales_rep,cs.secondary_sales_rep, cs.setter, 
			 cs.state, cs.sale_date, ns.net_epc, 
			 ns.ntp_complete_date,ps.pv_completion_date, 
			 ns.finance_type, ns.finance
			 from customers_customers_schema cs
             LEFT JOIN ntp_ntp_schema ns ON ns.unique_id = cs.unique_id
             LEFT JOIN pv_install_install_subcontracting_schema ps ON ps.customer_unique_id = cs.unique_id WHERE cs.unique_id != ''`

	if len(uniqueIds) > 0 {
		// Create a string to hold the unique IDs for the SQL query
		placeholders := make([]string, len(uniqueIds))
		for i, id := range uniqueIds {
			placeholders[i] = fmt.Sprintf("'%s'", id) // Quote each ID for SQL
		}
		query += fmt.Sprintf(" AND cs.unique_id IN (%s)", strings.Join(placeholders, ","))
	}

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to inital data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch inital data from db")
		return InitialData, err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	/* Clean the inital data List before updating new data */
	// InitialData.InitialDataList = InitialData.InitialDataList[:0]
	for _, data := range dataList {
		var InitialDataa InitialStruct

		if uniqueId, ok := data["unique_id"]; (ok) && (uniqueId != nil) {
			InitialDataa.UniqueId = uniqueId.(string)
		} else {
			// log.ConfWarnTrace(0, "No UniqueId for found in inital data")
			continue
		}

		if homeOwner, ok := data["customer_name"]; (ok) && (homeOwner != nil) {
			InitialDataa.HomeOwner = homeOwner.(string)
		} else {
			InitialDataa.HomeOwner = ""
		}

		if projectStatus, ok := data["project_status"]; (ok) && (projectStatus != nil) {
			InitialDataa.CurrectStatus = projectStatus.(string)
		} else {
			InitialDataa.CurrectStatus = ""
		}

		if contractedSystemSize, ok := data["contracted_system_size"]; (ok) && (contractedSystemSize != nil) {
			InitialDataa.SystemSize = contractedSystemSize.(float64)
		} else {
			InitialDataa.SystemSize = 0.0
		}

		if dealerCode, ok := data["dealer"]; (ok) && (dealerCode != nil) {
			InitialDataa.DealerCode = dealerCode.(string)
		} else {
			InitialDataa.DealerCode = ""
		}

		if totalSystemCost, ok := data["total_system_cost"]; ok && totalSystemCost != nil {
			// Step 1: Convert to string and trim spaces
			costStr := strings.TrimSpace(totalSystemCost.(string))

			// Step 2: Remove any HTML tags if present
			re := regexp.MustCompile(`<.*?>`)
			costStr = re.ReplaceAllString(costStr, "")

			// Step 3: Remove commas and "$" symbols
			costStr = strings.ReplaceAll(costStr, ",", "")
			costStr = strings.ReplaceAll(costStr, "$", "")

			// Step 4: Final trim to remove any residual spaces after cleaning
			costStr = strings.TrimSpace(costStr)

			// Step 5: Attempt to parse the cleaned string as a float
			if costStr != "" { // Ensure the string is not empty
				InitialDataa.ContractDolDol, err = strconv.ParseFloat(costStr, 64)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to parse total_system_cost: %v", err)
					InitialDataa.ContractDolDol = 0.0
				}
			} else {
				InitialDataa.ContractDolDol = 0.0
			}
		} else {
			InitialDataa.ContractDolDol = 0.0
		}

		if adderBreakdownandTotalNew, ok := data["adder_breakdown_and_total_new"]; (ok) && (adderBreakdownandTotalNew != nil) {
			InitialDataa.OtherAdders = adderBreakdownandTotalNew.(string)
		} else {
			InitialDataa.OtherAdders = ""
		}

		if primarySalesRep, ok := data["primary_sales_rep"]; (ok) && (primarySalesRep != nil) {
			InitialDataa.Rep1 = primarySalesRep.(string)
		} else {
			InitialDataa.HomeOwner = ""
		}

		if secondarySalesRep, ok := data["secondary_sales_rep"]; (ok) && (secondarySalesRep != nil) {
			InitialDataa.Rep2 = secondarySalesRep.(string)
		} else {
			InitialDataa.Rep2 = ""
		}

		if setter, ok := data["setter"]; (ok) && (setter != nil) {
			InitialDataa.Setter = setter.(string)
		} else {
			InitialDataa.Setter = ""
		}

		if state, ok := data["state"]; (ok) && (state != nil) {
			InitialDataa.ST = state.(string)
		} else {
			InitialDataa.ST = ""
		}

		if saleDate, ok := data["sale_date"]; (ok) && (saleDate != nil) {
			InitialDataa.ContractDate = saleDate.(time.Time)
		} else {
			InitialDataa.ContractDate = time.Time{}
		}

		if netEpc, ok := data["net_epc"]; (ok) && (netEpc != nil) {
			InitialDataa.NetEpc = netEpc.(float64)
		} else {
			InitialDataa.NetEpc = 0.0
		}

		if ntpCompleteDate, ok := data["ntp_complete_date"]; (ok) && (ntpCompleteDate != nil) {
			InitialDataa.NtpCompleteDate = ntpCompleteDate.(time.Time)
		} else {
			InitialDataa.NtpCompleteDate = time.Time{}
		}

		if pvCompletionDate, ok := data["pv_completion_date"]; (ok) && (pvCompletionDate != nil) {
			InitialDataa.PvComplettionDate = pvCompletionDate.(time.Time)
		} else {
			InitialDataa.PvComplettionDate = time.Time{}
		}

		// if m1SalesPartnerNottoExceed, ok := data["m1_sales_partner_not_to_exceed"]; (ok) && (m1SalesPartnerNottoExceed != nil) {
		// 	InitialDataa.DrawMax = m1SalesPartnerNottoExceed.(float64)
		// } else {
		// 	InitialDataa.DrawMax = 0.0
		// }

		if FinanceCompany, ok := data["finance"]; (ok) && (FinanceCompany != nil) {
			InitialDataa.FinanceCompany = FinanceCompany.(string)
		} else {
			InitialDataa.FinanceCompany = ""
		}

		if FinanceType, ok := data["finance_type"]; (ok) && (FinanceType != nil) {
			InitialDataa.FinanceType = FinanceType.(string)
		} else {
			InitialDataa.FinanceType = ""
		}

		if AdderBreakDown, ok := data["adder_breakdown_and_total_new"]; (ok) && (AdderBreakDown != nil) {
			InitialDataa.AdderBreakDown = AdderBreakDown.(string)
		} else {
			InitialDataa.AdderBreakDown = ""
		}

		InitialData.InitialDataList = append(InitialData.InitialDataList, InitialDataa)
	}
	return InitialData, err
}
