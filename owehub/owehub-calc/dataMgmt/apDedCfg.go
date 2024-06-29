/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type ApDedCfg struct {
	Amount   float64
	UniqueId string
	Payee    string
	Date     time.Time
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
		 SELECT * FROM ap_ded`

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

		date, ok := item["date"].(time.Time)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		uniqueId, ok := item["unique_id"].(string)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		amount, ok := item["amount"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		ApDedDatas := ApDedCfg{
			Payee:    Payee,
			Amount:   amount,
			UniqueId: uniqueId,
			Date:     date,
		}

		pApDedData.ApDedList = append(pApDedData.ApDedList, ApDedDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        GetApDedPaidAmount
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         PaidAmnt
*****************************************************************************/
func (ApDedData *ApDedCfgStruct) GetApDedPaidAmount(UniqueId, payee string) (PaidAmnt float64) {
	log.EnterFn(0, "GetApDedPaidAmount")
	defer func() { log.ExitFn(0, "GetApDedPaidAmount", nil) }()
	for _, data := range ApDedData.ApDedList {
		if UniqueId == data.UniqueId {
			PaidAmnt = ApRepCfg.CalculateAmountApOth(data.UniqueId, data.Payee)
		}
	}
	return PaidAmnt
}

/******************************************************************************
 * FUNCTION:        CalculateBalance
 * DESCRIPTION:     calculates the Paid amount value based on the unique Id
 * RETURNS:         balance
 *****************************************************************************/
func (ApDedData *ApDedCfgStruct) CalculateBalance(UniqueId, payee string, totalPaid float64) (balance float64) {
	log.EnterFn(0, "CalculateBalance")
	defer func() { log.ExitFn(0, "CalculateBalance", nil) }()
	for _, data := range ApDedData.ApDedList {
		if UniqueId == data.UniqueId {
			balance = data.Amount - totalPaid
		}
	}
	return balance
}

/******************************************************************************
 * FUNCTION:        getPayee
 * DESCRIPTION:     calculates the payee  value based on the unique Id
 * RETURNS:         payee
 *****************************************************************************/
func (ApDedData *ApDedCfgStruct) GetPayee(uniqueId string) (payee string) {
	log.EnterFn(0, "GetPayee")
	defer func() { log.ExitFn(0, "GetPayee", nil) }()
	for _, data := range ApDedData.ApDedList {
		if data.UniqueId == uniqueId {
			return data.Payee
		}
	}
	return payee
}

/******************************************************************************
 * FUNCTION:        GetDate
 * DESCRIPTION:     calculates the date based on the unique Id
 * RETURNS:         date
 *****************************************************************************/
func (ApDedData *ApDedCfgStruct) GetDate(uniqueId string) (date time.Time) {
	log.EnterFn(0, "GetDate")
	defer func() { log.ExitFn(0, "GetDate", nil) }()
	for _, data := range ApDedData.ApDedList {
		if data.UniqueId == uniqueId {
			return data.Date
		}
	}
	return date
}
