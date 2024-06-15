/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type ApPdaCfg struct {
	AmntOverdue float64
	UniqueId    string
	Payee       string
}

type ApPdaCfgStruct struct {
	ApPdaList []ApPdaCfg
}

var (
	ApPdaData ApPdaCfgStruct
)

func (pApPdaData *ApPdaCfgStruct) LoadApPdaCfg() (err error) {
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

		ApPdaDatas := ApPdaCfg{
			Payee: Payee,
		}

		pApPdaData.ApPdaList = append(pApPdaData.ApPdaList, ApPdaDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaBalance(UniqueId, payee string, paidAmount, amount, clawAmnt float64) (balance float64, dba string) {
	// for _, data := range pApPdaData.ApPdaList {
	if len(UniqueId) > 0 {
		dba = DBACfg.CalculateReprepDba(payee)
		if paidAmount < amount {
			balance = amount - paidAmount
		} else {
			balance = 0 - paidAmount - clawAmnt
		}
	}
	return balance, dba
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaPaidAmount(UniqueId, payee string) (PaidAmnt, clawAmnt float64) {
	if len(UniqueId) > 0 {
		PaidAmnt, clawAmnt = ApRepCfg.CalculateApPdaTotalPaid(UniqueId, payee)
	}
	return PaidAmnt, clawAmnt
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaAmount(UniqueId, payee string, rcmdAmnt float64) (balance float64) {
	for _, data := range pApPdaData.ApPdaList {
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
func (pApPdaData *ApPdaCfgStruct) GetApPdaRcmdAmount(UniqueId, payee, rep1, rep2 string, r1DrawAmt, r2DrawAmount float64) (balance float64) {
	for _, data := range pApPdaData.ApPdaList {
		if data.UniqueId == UniqueId && (rep1 == data.Payee || rep2 == data.Payee) {
			if UniqueId[:3] == "PDA" {
				return 0
			} else if data.Payee == rep1 {
				return r1DrawAmt
			} else if data.Payee == rep2 {
				return r2DrawAmount
			}
		}
	}
	return 0
}
