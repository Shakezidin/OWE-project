/**************************************************************************
* File            : TierLoanFeeCfg.go
* DESCRIPTION     : This file contains the model and data form TierLoanFee
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type TierLoanFeeCfgStruct struct {
	TierLoanFeeList models.GetTierLoanFeeList
}

var (
	TierLoanFeeCfg TierLoanFeeCfgStruct
)

func (pTierLoanFee *TierLoanFeeCfgStruct) LoadTierLoanFeeCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT tlf.id as record_id, tr.tier_name as dealer_tier, ptr.partner_name as installer, st.name as state, lnt.product_code as loan_type, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date
	FROM tier_loan_fee tlf
	JOIN tier tr ON tlf.dealer_tier = tr.id
	JOIN partners ptr ON tlf.installer_id = ptr.partner_id
	JOIN states st ON tlf.state_id = st.state_id
	JOIN loan_type lnt ON tlf.loan_type = lnt.id
	`

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
		// DealerTierName
		DealerTierName, tierOk := item["dealer_tier"].(string)
		if !tierOk || DealerTierName == "" {
			// log.FuncErrorTrace(0, "Failed to get dealer tier for Record ID %v. Item: %+v\n", RecordId, item)
			DealerTierName = ""
		}

		// PartnerName
		PartnerName, partnerOk := item["installer"].(string)
		if !partnerOk || PartnerName == "" {
			// log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// State
		State, stateOk := item["state"].(string)
		if !stateOk || State == "" {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// LoanType
		LoanType, financeOk := item["loan_type"].(string)
		if !financeOk || LoanType == "" {
			// log.FuncErrorTrace(0, "Failed to get loan type for Record ID %v. Item: %+v\n", RecordId, item)
			LoanType = ""
		}

		// OweCost
		OweCost, oweOk := item["owe_cost"].(float64)
		if !oweOk || OweCost == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get owe cost for Record ID %v. Item: %+v\n", RecordId, item)
			OweCost = 0.0
		}

		// DlrMu
		DlrMu, muOk := item["dlr_mu"].(float64)
		if !muOk || DlrMu == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get dlr_mu for Record ID %v. Item: %+v\n", RecordId, item)
			DlrMu = 0.0
		}

		// DlrCost
		DlrCost, costOk := item["dlr_cost"].(float64)
		if !costOk || DlrCost == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get dlr cost for Record ID %v. Item: %+v\n", RecordId, item)
			DlrCost = 0.0
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

		StartDateStr := Start_date.Format("2006-01-02")
		EndDateStr := EndDate.Format("2006-01-02")

		// Create a new GetTierLoanFeeData object
		vaddersData := models.GetTierLoanFeeData{
			RecordId:   RecordId,
			DealerTier: DealerTierName,
			Installer:  PartnerName,
			State:      State,
			LoanType:   LoanType,
			OweCost:    OweCost,
			DlrMu:      DlrMu,
			DlrCost:    DlrCost,
			StartDate:  StartDateStr,
			EndDate:    EndDateStr,
		}

		pTierLoanFee.TierLoanFeeList.TierLoanFeeList = append(pTierLoanFee.TierLoanFeeList.TierLoanFeeList, vaddersData)
	}
	return err
}

func (pTierLoanFee *TierLoanFeeCfgStruct) CalculateDlrCost(dlrTier, installer, state, Type string, date time.Time) (dlrcost float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	for _, data := range pTierLoanFee.TierLoanFeeList.TierLoanFeeList {
		if len(data.StartDate) > 0 {
			startDate, err = time.Parse("2006-01-02", data.StartDate)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
			}
		} else {
			log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
			continue
		}

		if len(data.EndDate) > 0 {
			endDate, err = time.Parse("2006-01-02", data.EndDate)
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

		if dlrTier == data.DealerTier && data.Installer == installer && data.State == st && data.LoanType == Type && startDate.Before(date) && endDate.After(date) {
			dlrcost += data.DlrCost
		}
	}
	return dlrcost
}
