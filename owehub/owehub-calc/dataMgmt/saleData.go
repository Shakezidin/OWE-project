/**************************************************************************
* File            : saleData.go
* DESCRIPTION     : This file contains the model and data form Sale Data
                     on which we need to perform calculations
* DATE            : 03-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strings"
	"time"
)

type SaleDataStruct struct {
	Dealer                 string
	Partner                string
	Installer              string
	Source                 string
	LoanType               string
	UniqueId               string
	HomeOwner              string
	Address                string
	State                  string
	PrimarySalesRep        string
	SecondarySalesRep      string
	SystemSize             float64
	ContractTotal          float64
	NetEpc                 float64
	WC1                    time.Time
	NtpDate                time.Time
	PermitSubmittedDate    time.Time
	PermitApprovedDate     time.Time
	IcSubmittedDate        time.Time
	IcApprovedDate         time.Time
	CancelledDate          time.Time
	PvInstallCompletedDate time.Time
	PtoDate                time.Time
	ProjectStatus          string
	SystemType             string
	StartDate              time.Time // added by zidhin
	EndDate                time.Time //field added by zidhin
	ChargeDlr              string    // field added by zidhiin
	// SaleType               string    //field added by zidhin
}

type SaleDataList struct {
	SaleDataList []SaleDataStruct
}

var (
	SaleData SaleDataList
)

func (saleDataList *SaleDataList) LoadSaleData(uniqueID string, hookType string) (err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	//Shushank
	uniqueID = "OUR17644"

	// log.EnterFn(0, "LoadSaleData")
	// defer func() { log.ExitFn(0, "LoadSaleData", err) }()
	log.EnterFn(0, "LoadSaleData")
	defer func() { log.ExitFn(0, "LoadSaleData", err) }()
	log.FuncDebugTrace(0, "In LoadSaleData for uniqueID: %v, hookType: %v", uniqueID, hookType)
	query = "SELECT * from " + db.ViewName_ConsolidatedDataView
	if uniqueID != "" {

		//query += " WHERE unique_id='" + uniqueID + "'"
		query += " WHERE UPPER(unique_id)='" + strings.ToUpper(uniqueID) + "'"

	}
	/*
		if (uniqueIDs != nil) && (len(uniqueIDs) > 0) {
			query += "WHERE unique_id IN ("
			for i, id := range uniqueIDs {
				if i != 0 {
					query += ","
				}
				query += "'" + id + "'"
			}
			query += ")"
		}
	*/

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		// log.FuncErrorTrace(0, "Failed to Sale Data from DB err: %+v", err)
		// err = fmt.Errorf("Failed to fetch Sale Data from DB")
		return err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	/* Clean the sale Data List before updating new data */
	saleDataList.SaleDataList = saleDataList.SaleDataList[:0]
	for _, data := range dataList {
		var saleData SaleDataStruct

		if uniqueId, ok := data["unique_id"]; (ok) && (uniqueId != nil) {
			saleData.UniqueId = uniqueId.(string)
		} else {
			// log.ConfWarnTrace(0, "No UniqueId for found in Sale Data")
			continue
		}

		if dealer, ok := data["dealer"]; (ok) && (dealer != nil) {
			saleData.Dealer = dealer.(string)
		} else {
			saleData.Dealer = ""
		}

		if partner, ok := data["partner"]; (ok) && (partner != nil) {
			saleData.Partner = partner.(string)
		} else {
			saleData.Partner = ""
		}

		if installer, ok := data["installer"]; (ok) && (installer != nil) {
			saleData.Installer = installer.(string)
		} else {
			saleData.Installer = ""
		}

		if source, ok := data["source"]; (ok) && (source != nil) {
			saleData.Source = source.(string)
		} else {
			saleData.Source = ""
		}

		if loanType, ok := data["loan_type"]; (ok) && (loanType != nil) {
			saleData.LoanType = loanType.(string)
		} else {
			saleData.LoanType = ""
		}

		if homeOwner, ok := data["home_owner"]; (ok) && (homeOwner != nil) {
			saleData.HomeOwner = homeOwner.(string)
		} else {
			saleData.HomeOwner = ""
		}

		if address, ok := data["address"]; (ok) && (address != nil) {
			saleData.Address = address.(string)
		} else {
			saleData.Address = ""
		}

		if state, ok := data["state"]; (ok) && (state != nil) {
			saleData.State = state.(string)
		} else {
			saleData.State = ""
		}

		if primarySalerRep, ok := data["primary_sales_rep"]; (ok) && (primarySalerRep != nil) {
			saleData.PrimarySalesRep = primarySalerRep.(string)
		} else {
			saleData.PrimarySalesRep = ""
		}

		if secondarySalesRep, ok := data["secondary_sales_rep"]; (ok) && (secondarySalesRep != nil) {
			saleData.SecondarySalesRep = secondarySalesRep.(string)
		} else {
			saleData.SecondarySalesRep = ""
		}

		if systemSize, ok := data["system_size"]; (ok) && (systemSize != nil) {
			saleData.SystemSize = systemSize.(float64)
		} else {
			saleData.SystemSize = 0.0
		}

		if contractTotal, ok := data["contract_total"]; (ok) && (contractTotal != nil) {
			saleData.ContractTotal = contractTotal.(float64)
		} else {
			saleData.ContractTotal = 0.0
		}

		if netEpc, ok := data["net_epc"]; (ok) && (netEpc != nil) {
			saleData.NetEpc = netEpc.(float64)
		} else {
			saleData.NetEpc = 0.0
		}

		if ntpDate, ok := data["ntp_date"]; ok && ntpDate != nil {
			saleData.NtpDate = ntpDate.(time.Time)
		}

		if permitApprovedDate, ok := data["permit_approved_date"]; ok && permitApprovedDate != nil {
			saleData.PermitApprovedDate = permitApprovedDate.(time.Time)
		}

		if icSubmittedDate, ok := data["ic_submitted_date"]; ok && icSubmittedDate != nil {
			saleData.IcSubmittedDate = icSubmittedDate.(time.Time)
		}

		if icApprovedDate, ok := data["ic_approved_date"]; ok && icApprovedDate != nil {
			saleData.IcApprovedDate = icApprovedDate.(time.Time)
		}

		if projectStatus, ok := data["project_status"]; (ok) && (projectStatus != nil) {
			saleData.ProjectStatus = projectStatus.(string)
		} else {
			saleData.ProjectStatus = ""
		}

		if WC1, ok := data["wc_1"]; ok && WC1 != nil {
			saleData.WC1 = WC1.(time.Time)
		} else {
			// log.FuncWarnTrace(0, "Empty value received in WC1 for Unique Id: %v", saleData.UniqueId)
		}

		if pvInstallCompletedDate, ok := data["pv_install_completed_date"]; ok && pvInstallCompletedDate != nil {
			saleData.PvInstallCompletedDate = pvInstallCompletedDate.(time.Time)
		} else {
			// log.FuncWarnTrace(0, "Empty value received in pvInstallCompletedDate for Unique Id: %v", saleData.UniqueId)
		}

		if permitSubmittedDate, ok := data["permit_submitted_date"]; ok && permitSubmittedDate != nil {
			saleData.PermitSubmittedDate = permitSubmittedDate.(time.Time)
		} else {
			// log.FuncWarnTrace(0, "Empty value received in permitSubmittedDate for Unique Id: %v", saleData.UniqueId)
		}

		if cancelledDate, ok := data["cancelled_date"]; ok && cancelledDate != nil {
			saleData.CancelledDate = cancelledDate.(time.Time)
		} else {
			// log.FuncWarnTrace(0, "Empty value received in cancelledDate for Unique Id: %v", saleData.UniqueId)
		}

		if ptoDate, ok := data["pto_date"]; ok && ptoDate != nil {
			saleData.PtoDate = ptoDate.(time.Time)
		} else {
			// log.FuncWarnTrace(0, "Empty value received in ptoDate for Unique Id: %v", saleData.UniqueId)
		}

		saleData.SystemType = determineSystemType(saleData.SystemSize, saleData.State)
		saleDataList.SaleDataList = append(saleDataList.SaleDataList, saleData)
	}
	return err
}

func determineSystemType(sysSize float64, state string) string {
	// var (
	// 	err error
	// )

	// log.EnterFn(0, "determineSystemType")
	// defer func() { log.ExitFn(0, "determineSystemType", err) }()

	if sysSize < 3 {
		if state == "CA" {
			return "SM-CA2"
		}
		return "SM-UNI2"
	} else if sysSize < 4 {
		if state != "CA" {
			return "SM-UNI3"
		}
	}
	return "N//A"
}
