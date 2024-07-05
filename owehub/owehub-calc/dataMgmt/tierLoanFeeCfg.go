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
	"errors"
	"time"
)

type TierLoanFeeCfgStruct struct {
	TierLoanFeeList models.GetTierLoanFeeList
}

var TierLoanFeeCfg TierLoanFeeCfgStruct

func (pTierLoanFee *TierLoanFeeCfgStruct) LoadTierLoanFeeCfg() error {
	query := `
	SELECT tlf.id as record_id, tr.tier_name as dealer_tier, ptr.partner_name as installer, st.name as state, lnt.product_code as loan_type, tlf.owe_cost, tlf.dlr_mu, tlf.dlr_cost, tlf.start_date, tlf.end_date
	FROM tier_loan_fee tlf
	JOIN tier tr ON tlf.dealer_tier = tr.id
	JOIN partners ptr ON tlf.installer_id = ptr.partner_id
	JOIN states st ON tlf.state_id = st.state_id
	JOIN loan_type lnt ON tlf.loan_type = lnt.id
	`

	data, err := db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return err
	}

	pTierLoanFee.TierLoanFeeList.TierLoanFeeList = make([]models.GetTierLoanFeeData, 0, len(data))

	for _, item := range data {
		tierLoanFeeData, err := parseTierLoanFeeData(item)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to parse tier loan fee data: %v", err)
			continue
		}
		pTierLoanFee.TierLoanFeeList.TierLoanFeeList = append(pTierLoanFee.TierLoanFeeList.TierLoanFeeList, tierLoanFeeData)
	}

	return nil
}

func parseTierLoanFeeData(item map[string]interface{}) (models.GetTierLoanFeeData, error) {
	recordID, ok := item["record_id"].(int64)
	if !ok {
		return models.GetTierLoanFeeData{}, errors.New("invalid record_id")
	}

	dealerTier := getString(item, "dealer_tier")
	installer := getString(item, "installer")
	state := getString(item, "state")
	loanType := getString(item, "loan_type")
	oweCost := getFloat64(item, "owe_cost")
	dlrMu := getFloat64(item, "dlr_mu")
	dlrCost := getFloat64(item, "dlr_cost")

	startDate := getTimeString(item, "start_date")
	endDate := getTimeString(item, "end_date")

	return models.GetTierLoanFeeData{
		RecordId:   recordID,
		DealerTier: dealerTier,
		Installer:  installer,
		State:      state,
		LoanType:   loanType,
		OweCost:    oweCost,
		DlrMu:      dlrMu,
		DlrCost:    dlrCost,
		StartDate:  startDate,
		EndDate:    endDate,
	}, nil
}

/******************************************************************************
* FUNCTION:        CalculateDlrCost
* DESCRIPTION:     calculates the dlrcost value based on the provided data
* RETURNS:         dlrcost float64
*****************************************************************************/
func (pTierLoanFee *TierLoanFeeCfgStruct) CalculateDlrCost(dlrTier, installer, state, LoanType string, date time.Time) float64 {
	log.EnterFn(0, "CalculateDlrCost")
	defer func() { log.ExitFn(0, "CalculateDlrCost", nil) }()

	truncatedDate := truncateToDay(date)
	st := getStateAbbreviation(state)
	if st == "" {
		return 0
	}

	var dlrCost float64
	for _, data := range pTierLoanFee.TierLoanFeeList.TierLoanFeeList {
		startDate, endDate, err := parseDate(data.StartDate, data.EndDate)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to parse dates: %v", err)
			continue
		}

		if matchesCriteria(data, dlrTier, installer, st, LoanType, truncatedDate, startDate, endDate) {
			dlrCost += data.DlrCost
		}
	}

	return dlrCost
}

func parseDate(startDateStr, endDateStr string) (time.Time, time.Time, error) {
	startDate, err := time.Parse("01-02-2006", startDateStr)
	if err != nil {
		return time.Time{}, time.Time{}, err
	}

	endDate, err := time.Parse("01-02-2006", endDateStr)
	if err != nil {
		return time.Time{}, time.Time{}, err
	}

	return truncateToDay(startDate), truncateToDay(endDate), nil
}

func matchesCriteria(data models.GetTierLoanFeeData, dlrTier, installer, state, loanType string, date, startDate, endDate time.Time) bool {
	if data.Installer == "One World Energy" {
		data.Installer = "OWE"
	}

	return data.DealerTier == dlrTier &&
		data.Installer == installer &&
		data.State == state &&
		data.LoanType == loanType &&
		(startDate.Before(date) || startDate.Equal(date)) &&
		(endDate.After(date) || endDate.Equal(date))
}
