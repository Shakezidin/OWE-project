/**************************************************************************
* File            : dealerOverrideCfg.go
* DESCRIPTION     : This file contains the model and data form dealer override
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

type GetDealerRepayment struct {
	RecordId                int
	UniqueId                string
	HomeOwner               string
	SysSize                 float64
	ContractDolDol          float64
	ShakyHand               bool
	RepaymentBonus          float64
	RemainingRepaymentBonus float64
}

type DealerRepaymentStruct struct {
	DealerRepaymentList []GetDealerRepayment
}

var (
	DealerRepayConfig DealerRepaymentStruct
)

func (pDealer *DealerRepaymentStruct) LoadDealerRepaymentCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadDealerRepaymentCfg")
	defer func() { log.ExitFn(0, "LoadDealerRepaymentCfg", err) }()

	query = `
  SELECT dor.id as record_id, dor.unique_id, dor.home_owner, dor.sys_size, dor.contract_$$, dor.shaky_hand, dor.repayment_bonus, dor.remaining_repayment_bonus
  FROM dealer_repayment_bonus dor`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	pDealer.DealerRepaymentList = pDealer.DealerRepaymentList[:0]
	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		HomeOwner, ok := item["home_owner"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get home_owner for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get sys_size for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		ContractDolDol, ok := item["contract_$$"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get contract_$$ for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		ShakyHand, ok := item["shaky_hand"].(bool)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get shaky_hand for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		RepaymentBonus, ok := item["repayment_bonus"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get repayment_bonus for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		RemainingRepaymentBonus, ok := item["remaining_repayment_bonus"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get remaining_repayment_bonus for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		repaymentBonus := GetDealerRepayment{
			RecordId:                int(RecordId),
			UniqueId:                UniqueId,
			HomeOwner:               HomeOwner,
			SysSize:                 SysSize,
			ContractDolDol:          ContractDolDol,
			ShakyHand:               ShakyHand,
			RepaymentBonus:          RepaymentBonus,
			RemainingRepaymentBonus: RemainingRepaymentBonus,
		}
		pDealer.DealerRepaymentList = append(pDealer.DealerRepaymentList, repaymentBonus)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateRepaymentBonus
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pDealer *DealerRepaymentStruct) CalculateRepaymentBonus(uniqueid, homeOwner string) (dlrPayBonus float64) {
	log.EnterFn(0, "CalculateRepaymentBonus")
	defer func() { log.ExitFn(0, "CalculateRepaymentBonus", nil) }()
	for _, data := range pDealer.DealerRepaymentList {
		if data.UniqueId == uniqueid && homeOwner == data.HomeOwner {
			dlrPayBonus += data.RepaymentBonus
		}
	}
	return dlrPayBonus
}
