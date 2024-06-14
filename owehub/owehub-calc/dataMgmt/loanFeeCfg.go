/**************************************************************************
* File            : loanFeeCfg.go
* DESCRIPTION     : This file contains the model and data form LoanFee
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type LoanFeeCfgStruct struct {
	LoanFeeCfg models.GetLoanFeeList
}

var (
	LoanFeeCfg LoanFeeCfgStruct
)

func (pLoanFee *LoanFeeCfgStruct) LoadLoanFeeCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	   SELECT lf.id as record_id, vd.dealer_name, pt.partner_name AS installer, st.name AS state_name, lt.product_code AS loan_type,
	   lf.owe_cost, lf.dlr_mu, lf.dlr_cost,lf.start_date, lf.end_date
	   FROM loan_fee lf
	   LEFT JOIN v_dealer vd ON vd.id = lf.dealer_id
	   LEFT JOIN partners pt ON pt.partner_id = lf.installer
	   LEFT JOIN states st ON st.state_id = lf.state_id
	   LEFT JOIN loan_type lt ON lt.id = lf.loan_type`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Dealer_name
		Dealer_name, ok := item["dealer_name"].(string)
		if !ok || Dealer_name == "" {
			// log.FuncErrorTrace(0, "Failed to get dealer_name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer_name = ""
		}

		// Installer
		Installer, ok := item["installer"].(string)
		if !ok || Installer == "" {
			// log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// state_name
		State_name, ok := item["state_name"].(string)
		if !ok || State_name == "" {
			// log.FuncErrorTrace(0, "Failed to get state_name for Record ID %v. Item: %+v\n", RecordId, item)
			State_name = ""
		}

		// Loan_type
		Loan_type, ok := item["loan_type"].(string)
		if !ok || Loan_type == "" {
			// log.FuncErrorTrace(0, "Failed to get loan type for Record ID %v. Item: %+v\n", RecordId, item)
			Loan_type = ""
		}

		// Owe_cost
		Owe_cost, ok := item["owe_cost"].(float64)
		if !ok || Owe_cost == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			Owe_cost = 0.0
		}

		// Dlr_Mu
		Dlr_Mu, ok := item["dlr_mu"].(float64)
		if !ok || Dlr_Mu == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get dlr mu for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Mu = 0.0
		}

		// Dlr_Cost
		Dlr_Cost, ok := item["dlr_cost"].(float64)
		if !ok || Dlr_Cost == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			Dlr_Cost = 0.0
		}

		// start_date
		Start_date, ok := item["start_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		StartDateStr := Start_date.Format("01-02-2006")
		EndDateStr := EndDate.Format("01-02-2006")

		LoanFeeData := models.GetLoanFee{
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
		pLoanFee.LoanFeeCfg.LoanFeeList = append(pLoanFee.LoanFeeCfg.LoanFeeList, LoanFeeData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateDlrCost
* DESCRIPTION:     calculates the dlr cost value based on the provided data
* RETURNS:         dlrcost float64
*****************************************************************************/
func (pLoanFee *LoanFeeCfgStruct) CalculateDlrCost(uniqueId, dealer, installer, state, Type string, date time.Time) (dlrcost float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)

	dlrTier := DealerTierCfg.CalculateDlrTier(uniqueId, dealer, date)
	if dlrTier == "OLD" {
		for _, data := range pLoanFee.LoanFeeCfg.LoanFeeList {
			if len(data.StartDate) > 0 {
				startDate, err = time.Parse("01-02-2006", data.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
				continue
			}

			if len(data.EndDate) > 0 {
				endDate, err = time.Parse("01-02-2006", data.EndDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.EndDate:%+v to time.Time err: %+v", data.EndDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty EndDate Received in data.EndDate config")
				continue
			}

			var st string
			if len(state) > 0 {
				st = state[6:]
			}

			if data.Dealer == dealer && data.Installer == installer && data.State == st &&
				data.LoanType == Type &&
				startDate.Before(date) && endDate.After(date) {
				dlrcost += data.DlrCost
			}
		}
	} else {
		dlrcost = TierLoanFeeCfg.CalculateDlrCost(dlrTier, installer, state, Type, date)
	}
	return dlrcost
}
