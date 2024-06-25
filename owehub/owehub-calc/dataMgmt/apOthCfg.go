/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	"time"
)

type ApOthCfg struct {
	Payee     string
	ShortCode string
	UniqueId  string
	Dealer    string
	Date      time.Time
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
		SELECT * FROM ap_oth`

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

		ApOthDatas := ApOthCfg{
			Payee:    Payee,
			Date:     date,
			Amount:   amount,
			UniqueId: uniqueId,
		}

		pApOthData.ApOthList = append(pApOthData.ApOthList, ApOthDatas)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculatePaidAmount
 * DESCRIPTION:     calculates the Paid amount value based on the unique Id
 *****************************************************************************/
func (pApOthData *ApOthCfgStruct) CalculatePaidAmount(UniqueId, payee string) (totalPaid float64) {
	for _, data := range pApOthData.ApOthList {
		if UniqueId == data.UniqueId {
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
func (pApOthData *ApOthCfgStruct) GetPayee(uniqueId string) (payee string) {
	for _, data := range pApOthData.ApOthList {
		if data.UniqueId == uniqueId {
			return data.Payee
		}
	}
	return payee
}

func (pApOthData *ApOthCfgStruct) GetDate(uniqueId string) (date time.Time) {
	for _, data := range pApOthData.ApOthList {
		if data.UniqueId == uniqueId {
			return data.Date
		}
	}
	return date
}
