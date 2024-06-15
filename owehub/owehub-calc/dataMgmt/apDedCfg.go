/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type ApDedCfg struct {
	Amount float64
	UniqueId    string
	Payee       string
}

type ApDedCfgStruct struct {
	ApDedList []ApDedCfg
}

var (
	ApDedData ApDedCfgStruct
)

func (pApDedData *ApDedCfgStruct) LoadApDedCfg() (err error) {
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

		ApDedDatas := ApDedCfg{
			Payee: Payee,
		}

		pApDedData.ApDedList = append(pApDedData.ApDedList, ApDedDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (ApDedData *ApDedCfgStruct) GetApDedPaidAmount(UniqueId, payee string) (PaidAmnt float64) {
	if len(UniqueId) > 0 {
		PaidAmnt = ApRepCfg.CalculateApDedTotalPaid(UniqueId, payee)
	}
	return PaidAmnt
}

/******************************************************************************
 * FUNCTION:        CalculatePaidAmount
 * DESCRIPTION:     calculates the Paid amount value based on the unique Id
 * RETURNS:         apRep
 *****************************************************************************/
func (ApDedData *ApDedCfgStruct) CalculateBalance(UniqueId, payee string, totalPaid float64) (balance float64) {
	for _, data := range ApDedData.ApDedList {
		if UniqueId == data.UniqueId && payee == data.Payee {
			balance = data.Amount - totalPaid
		}
	}
	return balance
}
