/**************************************************************************
 * File            : arDataCfg.go
 * DESCRIPTION     : This file contains the model and data form LoanFeeAddr
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
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
	// log.EnterFn(0, "LoadARCfg")
	// defer func() { log.ExitFn(0, "LoadARCfg", err) }()

	query = `
		 SELECT * FROM ap_pda`

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
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaBalance(UniqueId, payee string, paidAmount, amount, clawAmnt float64) (balance float64, dba string) {
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
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaPaidAmount(UniqueId, payee string) (PaidAmnt, clawAmnt float64) {
	for _, data := range pApPdaData.ApPdaList {
		if UniqueId == data.UniqueId {
			PaidAmnt, clawAmnt = ApRepCfg.CalculateApPdaTotalPaid(UniqueId, data.Payee)
		}
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
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (pApPdaData *ApPdaCfgStruct) GetApPdaRcmdAmount(UniqueId, payee, rep1, rep2 string, r1DrawAmt, r2DrawAmount float64) (balance float64) {
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
