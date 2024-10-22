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
	DrawAmt           float64
	NtpCompleteDate   time.Time
	PvComplettionDate time.Time
	RL                float64
}

type InitialDataLists struct {
	InitialDataList []InitialStruct
}

func LoadDlrPayInitialData() (InitialData InitialDataLists, err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadSaleData")
	defer func() { log.ExitFn(0, "LoadSaleData", err) }()

	// uidList := []string{"OUR21563"} //OUR21190
	query = `SELECT cdv.customer, cdv.project_status, cdv.unique_id, 
			 cdv.contracted_system_size, cdv.total_system_cost,cdv.adder_breakdown_and_total_new,
			 cdv.primary_sales_rep, cdv.secondary_sales_rep, cdv.setter, 
			 cdv.state, cdv.sale_date, cdv.net_epc, cdv.m1_sales_partner_draw_percentage, 
			 cdv.ntp_complete_date, cdv.pv_completion_date, 
			 CAST(cdv.redline AS float) AS redline
			 from consolidated_data_view`

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to Sale Data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch sale data from db")
		return InitialData, err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	/* Clean the sale Data List before updating new data */
	InitialData.InitialDataList = InitialData.InitialDataList[:0]
	for _, data := range dataList {
		var InitialDataa InitialStruct

		if uniqueId, ok := data["unique_id"]; (ok) && (uniqueId != nil) {
			InitialDataa.UniqueId = uniqueId.(string)
		} else {
			// log.ConfWarnTrace(0, "No UniqueId for found in Sale Data")
			continue
		}

		if homeOwner, ok := data["customer"]; (ok) && (homeOwner != nil) {
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

		if totalSystemCost, ok := data["total_system_cost"]; (ok) && (totalSystemCost != nil) {
			InitialDataa.ContractDolDol = totalSystemCost.(float64)
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

		if m1SalesPartnerDrawPercentage, ok := data["m1_sales_partner_draw_percentage"]; (ok) && (m1SalesPartnerDrawPercentage != nil) {
			InitialDataa.DrawAmt = m1SalesPartnerDrawPercentage.(float64)
		} else {
			InitialDataa.DrawAmt = 0.0
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

		if redLine, ok := data["redline"]; (ok) && (redLine != nil) {
			InitialDataa.RL = redLine.(float64)
		} else {
			InitialDataa.RL = 0.0
		}

		InitialData.InitialDataList = append(InitialData.InitialDataList, InitialDataa)
	}
	return InitialData, err
}
