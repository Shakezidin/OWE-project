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

type GetLoanFeeAdder struct {
	UniqueID        string
	PerKwAmount     float64
	RepDollDivbyPer float64
	Type            string
	ContractDolDol  float64
	Date            time.Time
}

type LoanFeeAdderCfgStruct struct {
	LoanFeeAdderList []GetLoanFeeAdder
}

var (
	LoanFeeAdderCfg LoanFeeAdderCfgStruct
)

func (pLoanFee *LoanFeeAdderCfgStruct) LoadLoanFeeAdderCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadRebateCfg")
	defer func() { log.ExitFn(0, "LoadRebateCfg", err) }()

	query = 
		 ` SELECT *
			FROM loan_fee_adder lfa`
	// SELECT lfa.id as record_id, lfa.unique_id, lfa.type_mktg, vd.dealer_name, pt.partner_name AS installer_name, st.name AS state_name, lfa.contract_dol_dol, tr.tier_name AS dealer_tier_name,
	// lfa.owe_cost, lfa.addr_amount, lfa.per_kw_amount, lfa.rep_doll_divby_per, lfa.description_rep_visible, lfa.notes_not_rep_visible, lfa.type, ud1.name as rep_1_name, ud2.name as rep_2_name, lfa.sys_size,
	// lfa.rep_count, lfa.per_rep_addr_share, lfa.per_rep_ovrd_share, lfa.r1_pay_scale, lfa.rep_1_def_resp, lfa.r1_addr_resp, lfa.r2_pay_scale, lfa.rep_2_def_resp, lfa.r2_addr_resp, 
	// lfa.start_date, lfa.end_date
	// JOIN states st ON st.state_id = lfa.state_id
	// JOIN user_details ud1 ON ud1.user_id = lfa.rep_1
	// JOIN user_details ud2 ON ud2.user_id = lfa.rep_2
	// JOIN v_dealer vd ON vd.id = lfa.dealer_id
	// JOIN partners pt ON pt.partner_id = lfa.installer_id
	// JOIN tier tr ON tr.id = lfa.dealer_tier`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee adder from DB err: %v", err)
		return
	}

	for _, item := range data {
		// unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// per_kw_amount
		Per_kw_amount, ok := item["per_kw_amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get Per kw amount for Record ID %v. Item: %+v\n", RecordId, item)
			Per_kw_amount = 0.0
		}

		// rep_doll_divby_per
		Rep_doll_divby_per, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_doll_divby_per = 0.0
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		contractDolDol, ok := item["contract_dol_dol"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get r1_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			contractDolDol = 0.0
		}

		// start_date
		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		LoanFeeAdderData := GetLoanFeeAdder{
			UniqueID:        Unique_id,
			PerKwAmount:     Per_kw_amount,
			RepDollDivbyPer: Rep_doll_divby_per,
			Type:            Type,
			Date:            Date,
			ContractDolDol:  contractDolDol,
		}

		pLoanFee.LoanFeeAdderList = append(pLoanFee.LoanFeeAdderList, LoanFeeAdderData)
	}
	return err
}

// ******************************************************************************
// * FUNCTION:        CalculateLoanFee
// * DESCRIPTION:     calculates the "loanFee" value based on the provided data
// * RETURNS:         loanFee
// *****************************************************************************/

func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculateRepPerRepOvrdShare(uniqueId, dealer, installer, state, Type string, date time.Time, contractDolDol, repDolDivByPer, repCount float64) (perRepOvrdShare float64) {
	log.EnterFn(0, "CalculateRepPerRepOvrdShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepOvrdShare", nil) }()
	if repDolDivByPer <= 1 {
		oweCost := LoanFeeCfg.CalculateDlrCost(uniqueId, dealer, installer, state, Type, date)
		adderAmount := contractDolDol * oweCost
		return (adderAmount * repDolDivByPer) / repCount
	} else {
		return repDolDivByPer / repCount
	}
}

func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculaterepRep1DefResp(r1PayScale string) (rep1DefResp float64) {
	log.EnterFn(0, "CalculaterepRep1DefResp")
	defer func() { log.ExitFn(0, "CalculaterepRep1DefResp", nil) }()
	if len(r1PayScale) > 0 {
		return adderRespCfg.CalculateAdderResp(r1PayScale)
	}
	return rep1DefResp
}

func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculateRepPerRepAddrShare(adderAmount, repCount, PerKwAmt, sysSize float64) (perRepAddrShare float64) {
	log.EnterFn(0, "CalculateRepPerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepAddrShare", nil) }()
	if adderAmount > 0 {
		return adderAmount / repCount
	} else if PerKwAmt > 0 {
		return (PerKwAmt * sysSize) / repCount
	}
	return perRepAddrShare
}

func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculaterepR1AdderResp(rep1, uniqueId, dealer, installer, state, Type string, date time.Time, contractDolDol, repDolDivByPer, repCount, adderAmount, PerKwAmt, sysSize float64) (r1AdderResp float64) {
	log.EnterFn(0, "CalculaterepR1AdderResp")
	defer func() { log.ExitFn(0, "CalculaterepR1AdderResp", nil) }()
	perRepOvrdShare := LoanFeeAdderCfg.CalculateRepPerRepOvrdShare(uniqueId, dealer, installer, state, Type, date, contractDolDol, repDolDivByPer, repCount)
	if perRepOvrdShare > 0 {
		return perRepOvrdShare
	} else if len(rep1) > 0 {
		if Type[:2] == "LF" {
			return LoanFeeAdderCfg.CalculateRepPerRepAddrShare(adderAmount, repCount, PerKwAmt, sysSize)
		} else {
			r1PayScale, _ := RepPayCfg.CalculateRPayScale(rep1, state, date)
			return LoanFeeAdderCfg.CalculateRepPerRepAddrShare(adderAmount, repCount, PerKwAmt, sysSize) * LoanFeeAdderCfg.CalculaterepRep1DefResp(r1PayScale)
		}
	} else {
		return r1AdderResp
	}
}

/******************************************************************************
* FUNCTION:        CalculateRepR1LoanFee
* DESCRIPTION:     calculates the "R1LoanFee" value based on the provided data
* RETURNS:         r1loanFee
*****************************************************************************/
func (LoanFeeAdderCfg *LoanFeeAdderCfgStruct) CalculateRepRLoanFee(rep, uniqueId, dealer, installer, state string) (r1LoanFee float64) {
	log.EnterFn(0, "CalculateRepRLoanFee")
	defer func() { log.ExitFn(0, "CalculateRepRLoanFee", nil) }()
	if len(rep) > 0 {
		for _, data := range LoanFeeAdderCfg.LoanFeeAdderList {
			if data.UniqueID == uniqueId {
				addrAmount := 0.0
				SysSize := 0.0
				repCount := 0.0
				r1AdderResp := LoanFeeAdderCfg.CalculaterepR1AdderResp(rep, uniqueId, dealer, installer, state, data.Type, data.Date, data.ContractDolDol, data.RepDollDivbyPer, repCount, addrAmount, data.PerKwAmount, SysSize)
				r1LoanFee += r1AdderResp
			}
		}
	}
	return r1LoanFee
}
