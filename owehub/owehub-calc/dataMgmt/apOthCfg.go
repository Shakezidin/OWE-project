/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type ApOthCfg struct {
	Payee     string
	ShortCode string
	UniqueId  string
	Dealer    string
	Amount    float64
}

type ApOthCfgStruct struct {
	ApOthList []ApOthCfg
}

var (
	ApOthData ApOthCfgStruct
)

func (pApOthData *ApOthCfgStruct) LoadApOthCfg() (err error) {
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

		ApOthDatas := ApOthCfg{
			Payee: Payee,
		}

		pApOthData.ApOthList = append(pApOthData.ApOthList, ApOthDatas)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculatePaidAmount
 * DESCRIPTION:     calculates the Paid amount value based on the unique Id
 * RETURNS:         apRep
 *****************************************************************************/
func (pApOthData *ApOthCfgStruct) CalculatePaidAmount(UniqueId, payee string) (totalPaid float64) {
	for _, data := range pApOthData.ApOthList {
		if UniqueId == data.UniqueId && payee == data.Payee {
			totalPaid = ApRepCfg.CalculateAmountApOth(data.UniqueId, data.Payee)
		}
	}
	return totalPaid
}

/******************************************************************************
 * FUNCTION:        CalculatePaidAmount
 * DESCRIPTION:     calculates the Paid amount value based on the unique Id
 * RETURNS:         apRep
 *****************************************************************************/
func (pApOthData *ApOthCfgStruct) CalculateBalance(UniqueId, payee string, totalPaid float64) (balance float64) {
	for _, data := range pApOthData.ApOthList {
		if UniqueId == data.UniqueId && payee == data.Payee {
			balance = data.Amount - totalPaid
		}
	}
	return balance
}
