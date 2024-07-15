/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strings"
	"time"
)

type ApPdaCfg struct {
	AmntOverdue float64
	UniqueId    string
	Payee       string
	Date        time.Time
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

	query = `
		 SELECT * FROM ap_pda`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		// log.ConfWarnTrace(0, "Failed to get ar import config from DB err: %v", err)
		return err
	}

	pApPdaData.ApPdaList = pApPdaData.ApPdaList[:0]
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

		ApPdaDatas := ApPdaCfg{
			Payee:       Payee,
			Date:        date,
			AmntOverdue: amount,
			UniqueId:    uniqueId,
		}

		pApPdaData.ApPdaList = append(pApPdaData.ApPdaList, ApPdaDatas)
	}

	return err
}

/******************************************************************************
* FUNCTION:        GetApPdaBalance
* DESCRIPTION:     calculates the ap pda balance, dba value based on the provided data
* RETURNS:         balance, dba
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaBalance(UniqueId string, paidAmount, amount, clawAmnt float64) (balance float64, dba string) {
	log.EnterFn(0, "GetApPdaBalance")
	defer func() { log.ExitFn(0, "GetApPdaBalance", nil) }()
	for _, data := range pApPdaData.ApPdaList {
		if UniqueId == data.UniqueId {
			dba = DBACfg.CalculateReprepDba(data.Payee)
			if paidAmount < amount {
				balance = amount - paidAmount
			} else {
				balance = 0 - paidAmount - clawAmnt
			}
		}
	}
	return balance, dba
}

/******************************************************************************
* FUNCTION:        GetApPdaPaidAmount
* DESCRIPTION:     calculates the ap pda paid amount, clawamnt value based on the provided data
* RETURNS:         PaidAmnt, clawAmnt
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaPaidAmount(UniqueId string) (PaidAmnt, clawAmnt float64) {
	log.EnterFn(0, "GetApPdaPaidAmount")
	defer func() { log.ExitFn(0, "GetApPdaPaidAmount", nil) }()
	for _, data := range pApPdaData.ApPdaList {
		if UniqueId == data.UniqueId {
			PaidAmnt, clawAmnt = ApRepCfg.CalculateApPdaTotalPaid(UniqueId, data.Payee)
		}
	}
	return PaidAmnt, clawAmnt
}

/******************************************************************************
* FUNCTION:        GetApPdaAmount
* DESCRIPTION:     calculates the pda amount value based on the provided data
* RETURNS:         pda amount
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaAmount(UniqueId string, rcmdAmnt float64) (balance float64) {
	log.EnterFn(0, "GetApPdaAmount")
	defer func() { log.ExitFn(0, "GetApPdaAmount", nil) }()
	for _, data := range pApPdaData.ApPdaList {
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
* FUNCTION:        GetApPdaRcmdAmount
* DESCRIPTION:     calculates the pda rcm amount value based on the provided data
* RETURNS:         pda rcm amount
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaRcmdAmount(UniqueId, rep1, rep2 string, r1DrawAmt, r2DrawAmount float64) (balance float64) {
	log.EnterFn(0, "GetApPdaRcmdAmount")
	defer func() { log.ExitFn(0, "GetApPdaRcmdAmount", nil) }()
	for _, data := range pApPdaData.ApPdaList {
		if data.UniqueId == UniqueId {
			if UniqueId[:3] == "PDA" {
				return 0
			} else if ConvertToLower(rep1) == ConvertToLower(data.Payee) {
				return r1DrawAmt
			} else if ConvertToLower(rep2) == ConvertToLower(data.Payee) {
				return r2DrawAmount
			}
		}
	}
	return 0
}

func ConvertToLower(str1 string) (result string) {
	return strings.ToLower(str1)
}

/******************************************************************************
 * FUNCTION:        getPayee
 * DESCRIPTION:     calculates the payee value based on the unique Id
 * RETURNS:         payee
 *****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetPayee(uniqueId string) (payee string) {
	log.EnterFn(0, "GetPayee")
	defer func() { log.ExitFn(0, "GetPayee", nil) }()
	for _, data := range pApPdaData.ApPdaList {
		if data.UniqueId == uniqueId {
			return data.Payee
		}
	}
	return payee
}

/******************************************************************************
 * FUNCTION:        GetDate
 * DESCRIPTION:     calculates the date value based on the unique Id
 * RETURNS:         date
 *****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetDate(uniqueId string) (date time.Time) {
	log.EnterFn(0, "GetDate")
	defer func() { log.ExitFn(0, "GetDate", nil) }()
	for _, data := range pApPdaData.ApPdaList {
		if data.UniqueId == uniqueId {
			return data.Date
		}
	}
	return date
}
