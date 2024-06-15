/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type ApAdvCfg struct {
	AmntOverdue float64
	UniqueId    string
	Payee       string
}

type ApAdvCfgStruct struct {
	ApAdvList []ApAdvCfg
}

var (
	ApAdvData ApAdvCfgStruct
)

func (pApAdvData *ApAdvCfgStruct) LoadApAdvCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	// log.EnterFn(0, "LoadARCfg")
	// defer func() { log.ExitFn(0, "LoadARCfg", err) }()

	query = `
		 SELECT ai.id as record_id, ai.unique_id, ai.customer, ai.date, ai.amount
		 FROM ar as ai`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		// log.ConfWarnTrace(0, "Failed to get ar import config from DB err: %v", err)
		return err
	}

	for _, item := range data {

		Payee, ok := item["payee"].(string)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		ApAdvDatas := ApAdvCfg{
			Payee: Payee,
		}

		pApAdvData.ApAdvList = append(pApAdvData.ApAdvList, ApAdvDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvPaidAmount(UniqueId, payee string) (PaidAmnt float64) {
	if len(UniqueId) > 0 {
		PaidAmnt = ApRepCfg.CalculateApAdvTotalPaid(UniqueId, payee)
	}
	return PaidAmnt
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvAmount(UniqueId, payee string, rcmdAmnt float64) (balance float64) {
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == UniqueId && payee == data.Payee {
			if data.AmntOverdue > 0 {
				return data.AmntOverdue
			} else if rcmdAmnt > 0 {
				return rcmdAmnt
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvRcmdAmount(UniqueId, payee, rep1, rep2 string, r1DrawAmt, r2DrawAmount float64) (rcmdAmnt float64) {
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == UniqueId && (rep1 == data.Payee || rep2 == data.Payee) {
			if data.Payee == rep1 {
				return r1DrawAmt
			} else if data.Payee == rep2 {
				return r2DrawAmount
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvBalance(UniqueId, payee string, paidAmount, amount float64) (balance float64, dba string) {
	for _, data := range pApAdvData.ApAdvList {
		if UniqueId == data.UniqueId && data.Payee == payee {
			dba = DBACfg.CalculateReprepDba(payee)
			balance = amount - paidAmount
			return balance, dba
		}
	}
	return balance, dba
}
