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
	"fmt"
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
}

type SaleDataList struct {
	SaleDataList []SaleDataStruct
}

var (
	SaleData SaleDataList
)

func (saleDataList *SaleDataList) LoadSaleData(uniqueIDs []string) (err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadSaleData")
	defer func() { log.ExitFn(0, "LoadSaleData", err) }()
	query = "SELECT * from " + db.ViewName_ConsolidatedDataView
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

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to Sale Data from DB err: %+v", err)
		err = fmt.Errorf("Failed to fetch Sale Data from DB")
		return err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	/* Clean the sale Data List before updating new data */
	saleDataList.SaleDataList = saleDataList.SaleDataList[:0]
	for _, data := range dataList {
		var saleData SaleDataStruct

		if _, ok := data["unique_id"]; ok {
			saleData.UniqueId = data["unique_id"].(string)
		} else {
			log.ConfWarnTrace(0, "No UniqueId for found in Sale Data")
			continue
		}

		if _, ok := data["dealer"]; ok {
			saleData.Dealer = data["dealer"].(string)
		} else {
			saleData.Dealer = ""
		}
		if _, ok := data["partner"]; ok {
			saleData.Partner = data["partner"].(string)
		} else {
			saleData.Partner = ""
		}
		if _, ok := data["installer"]; ok {
			saleData.Installer = data["installer"].(string)
		} else {
			saleData.Installer = ""
		}
		if _, ok := data["source"]; ok {
			saleData.Source = data["source"].(string)
		} else {
			saleData.Source = ""
		}
		if _, ok := data["loan_type"]; ok {
			saleData.LoanType = data["loan_type"].(string)
		} else {
			saleData.LoanType = ""
		}
		if _, ok := data["home_owner"]; ok {
			saleData.HomeOwner = data["home_owner"].(string)
		} else {
			saleData.HomeOwner = ""
		}
		if _, ok := data["address"]; ok {
			saleData.Address = data["address"].(string)
		} else {
			saleData.Address = ""
		}
		if _, ok := data["state"]; ok {
			saleData.State = data["state"].(string)
		} else {
			saleData.State = ""
		}
		if _, ok := data["primary_sales_rep"]; ok {
			saleData.PrimarySalesRep = data["primary_sales_rep"].(string)
		} else {
			saleData.PrimarySalesRep = ""
		}
		if _, ok := data["secondary_sales_rep"]; ok {
			saleData.SecondarySalesRep = data["secondary_sales_rep"].(string)
		} else {
			saleData.SecondarySalesRep = ""
		}
		if _, ok := data["system_size"]; ok {
			saleData.SystemSize = data["system_size"].(float64)
		} else {
			saleData.SystemSize = 0.0
		}
		if _, ok := data["contract_total"]; ok {
			saleData.ContractTotal = data["contract_total"].(float64)
		} else {
			saleData.ContractTotal = 0.0
		}

		if _, ok := data["net_epc"]; ok {
			saleData.NetEpc = data["net_epc"].(float64)
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

		if _, ok := data["project_status"]; ok {
			saleData.ProjectStatus = data["project_status"].(string)
		} else {
			saleData.ProjectStatus = ""
		}

		if WC1, ok := data["wc_1"]; ok && WC1 != nil {
			WC1 = WC1.(time.Duration)
		} else {
			log.FuncWarnTrace(0, "Empty value received in WC1 for Unique Id: %v", saleData.UniqueId)
		}

		if pvInstallCompletedDate, ok := data["pv_install_completed_date"]; ok && pvInstallCompletedDate != nil {
			saleData.PvInstallCompletedDate = pvInstallCompletedDate.(time.Time)
		} else {
			log.FuncWarnTrace(0, "Empty value received in pvInstallCompletedDate for Unique Id: %v", saleData.UniqueId)
		}

		if permitSubmittedDate, ok := data["permit_submitted_date"]; ok && permitSubmittedDate != nil {
			saleData.PermitSubmittedDate = permitSubmittedDate.(time.Time)
		} else {
			log.FuncWarnTrace(0, "Empty value received in permitSubmittedDate for Unique Id: %v", saleData.UniqueId)
		}

		if cancelledDate, ok := data["cancelled_date"]; ok && cancelledDate != nil {
			saleData.CancelledDate = cancelledDate.(time.Time)
		} else {
			log.FuncWarnTrace(0, "Empty value received in cancelledDate for Unique Id: %v", saleData.UniqueId)
		}

		if ptoDate, ok := data["pto_date"]; ok && ptoDate != nil {
			saleData.PtoDate = ptoDate.(time.Time)
		} else {
			log.FuncWarnTrace(0, "Empty value received in ptoDate for Unique Id: %v", saleData.UniqueId)
		}

		saleDataList.SaleDataList = append(saleDataList.SaleDataList, saleData)
	}

	return err
}
