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

type ApAdvCfg struct {
	AmntOverdue float64
	UniqueId    string
	Payee       string
	Date        time.Time
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
		 SELECT * FROM ap_adv`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		// log.ConfWarnTrace(0, "Failed to get ar import config from DB err: %v", err)
		return err
	}

	pApAdvData.ApAdvList = pApAdvData.ApAdvList[:0]
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

		amount, ok := item["amount_ovrd"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		ApAdvDatas := ApAdvCfg{
			Payee:       Payee,
			Date:        date,
			UniqueId:    uniqueId,
			AmntOverdue: amount,
		}

		pApAdvData.ApAdvList = append(pApAdvData.ApAdvList, ApAdvDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        GetApAdvPaidAmount
* DESCRIPTION:     calculates the adv paid amount value based on the provided data
* RETURNS:         PaidAmnt float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvPaidAmount(UniqueId string) (PaidAmnt float64) {
	log.EnterFn(0, "GetApAdvPaidAmount")
	defer func() { log.ExitFn(0, "GetApAdvPaidAmount", nil) }()
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == UniqueId {
			PaidAmnt = ApRepCfg.CalculateApAdvTotalPaid(UniqueId, data.Payee)
		}
	}
	return PaidAmnt
}

/******************************************************************************
* FUNCTION:        GetApAdvAmount
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         float64
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvAmount(UniqueId string, rcmdAmnt float64) float64 {
	log.EnterFn(0, "GetApAdvAmount")
	defer func() { log.ExitFn(0, "GetApAdvAmount", nil) }()
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == UniqueId {
			if rcmdAmnt == 0 {
				return 0
			} else if data.AmntOverdue > 0 {
				return data.AmntOverdue
			} else if rcmdAmnt > 0 {
				return rcmdAmnt
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        GetApAdvRcmdAmount
* DESCRIPTION:     calculates the rc amount value based on the provided data
* RETURNS:         rcmdAmnt
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvRcmdAmount(UniqueId, rep1, rep2 string, r1DrawAmt, r2DrawAmount float64) (rcmdAmnt float64) {
	log.EnterFn(0, "GetApAdvRcmdAmount")
	defer func() { log.ExitFn(0, "GetApAdvRcmdAmount", nil) }()
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == UniqueId {
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
* FUNCTION:        GetApAdvBalance
* DESCRIPTION:     calculates the adv balance and dba value based on the provided data
* RETURNS:         balance, dba
*****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetApAdvBalance(UniqueId string, paidAmount, amount float64) (balance float64, dba string) {
	log.EnterFn(0, "GetApAdvBalance")
	defer func() { log.ExitFn(0, "GetApAdvBalance", nil) }()
	for _, data := range pApAdvData.ApAdvList {
		if UniqueId == data.UniqueId {
			dba = DBACfg.CalculateReprepDba(data.Payee)
			balance = amount - paidAmount
			return balance, dba
		}
	}
	return balance, dba
}

/******************************************************************************
 * FUNCTION:        getPayee
 * DESCRIPTION:     calculates the payee value based on the unique Id
 * RETURNS:         payee
 *****************************************************************************/
func (pApAdvData *ApAdvCfgStruct) GetPayee(uniqueId string) (payee string) {
	log.EnterFn(0, "GetPayee")
	defer func() { log.ExitFn(0, "GetPayee", nil) }()
	for _, data := range pApAdvData.ApAdvList {
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
func (pApAdvData *ApAdvCfgStruct) GetDate(uniqueId string) (date time.Time) {
	log.EnterFn(0, "GetDate")
	defer func() { log.ExitFn(0, "GetDate", nil) }()
	for _, data := range pApAdvData.ApAdvList {
		if data.UniqueId == uniqueId {
			return data.Date
		}
	}
	return date
}
