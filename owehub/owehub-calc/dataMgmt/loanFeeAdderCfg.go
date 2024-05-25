/**************************************************************************
* File            : loanFeeAdderCfg.go
* DESCRIPTION     : This file contains the model and data form LoanFeeAdder
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type GetLoanFee struct {
	RecordId  int64   `json:"record_id"`
	UniqueId  string  `json:"unique_id"`
	Dealer    string  `json:"dealer"`
	Installer string  `json:"installer"`
	State     string  `json:"state"`
	LoanType  string  `json:"loan_type"`
	OweCost   float64 `json:"owe_cost"`
	DlrMu     float64 `json:"dlr_mu"`
	DlrCost   float64 `json:"dlr_cost"`
	StartDate string  `json:"start_date"`
	EndDate   string  `json:"end_date"`
}

type LoanFeeAdderCfgStruct struct {
	LoanFeeAdderList []GetLoanFee
}

var (
	LoanFeeAdderCfg LoanFeeAdderCfgStruct
)

func (pLoanFee *LoanFeeAdderCfgStruct) LoadRebateCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadRebateCfg")
	defer func() { log.ExitFn(0, "LoadRebateCfg", err) }()

	query = `
       SELECT lf.id as record_id, vd.dealer_name, pt.partner_name AS installer, st.name AS state_name, lt.product_code AS loan_type,
       lf.owe_cost, lf.dlr_mu, lf.dlr_cost,lf.start_date, lf.end_date
       FROM loan_fee lf
       JOIN v_dealer vd ON vd.id = lf.dealer_id
       JOIN partners pt ON pt.partner_id = lf.installer
       JOIN states st ON st.state_id = lf.state_id
       JOIN loan_type lt ON lt.id = lf.loan_type`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Dealer_name
		Dealer_name, ok := item["dealer_name"].(string)
		if !ok || Dealer_name == "" {
			log.FuncErrorTrace(0, "Failed to get dealer_name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer_name = ""
		}

		// Installer
		Installer, ok := item["installer"].(string)
		if !ok || Installer == "" {
			log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// state_name
		State_name, ok := item["state_name"].(string)
		if !ok || State_name == "" {
			log.FuncErrorTrace(0, "Failed to get state_name for Record ID %v. Item: %+v\n", RecordId, item)
			State_name = ""
		}

		// Loan_type
		Loan_type, ok := item["loan_type"].(string)
		if !ok || Loan_type == "" {
			log.FuncErrorTrace(0, "Failed to get loan type for Record ID %v. Item: %+v\n", RecordId, item)
			Loan_type = ""
		}

		// Owe_cost
		Owe_cost, ok := item["owe_cost"].(float64)
		if !ok || Owe_cost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			Owe_cost = 0.0
		}

		// Dlr_Mu
		Dlr_Mu, ok := item["dlr_mu"].(float64)
		if !ok || Dlr_Mu == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr mu for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Mu = 0.0
		}

		// Dlr_Cost
		Dlr_Cost, ok := item["dlr_cost"].(float64)
		if !ok || Dlr_Cost == 0.0 {
			log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Cost = 0.0
		}

		// start_date
		Start_date, ok := item["start_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		StartDateStr := Start_date.Format("2006-01-02")
		EndDateStr := EndDate.Format("2006-01-02")

		LoanFeeData := GetLoanFee{
			RecordId:  RecordId,
			Dealer:    Dealer_name,
			Installer: Installer,
			State:     State_name,
			LoanType:  Loan_type,
			OweCost:   Owe_cost,
			DlrMu:     Dlr_Mu,
			DlrCost:   Dlr_Cost,
			StartDate: StartDateStr,
			EndDate:   EndDateStr,
		}
		pLoanFee.LoanFeeAdderList = append(pLoanFee.LoanFeeAdderList, LoanFeeData)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateLoanFee
* DESCRIPTION:     calculates the "loanFee" value based on the provided data
* RETURNS:         loanFee
*****************************************************************************/
func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculateLoanFee(dealer string, uniqueId string) (loanFee float64) {
	log.EnterFn(0, "CalculateLoanFee")
	defer func() { log.ExitFn(0, "CalculateLoanFee", nil) }()
	if len(dealer) > 0 {
		for _, data := range LoanFeeAdderCfg.LoanFeeAdderList {
			if data.UniqueId == uniqueId {
				// loanFee += data.addramount
			}
		}
	}
	return loanFee
}
