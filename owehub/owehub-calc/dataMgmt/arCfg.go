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

type ArImportCfg struct {
	RecordId int64
	UniqueId string
	Customer string
	Date     time.Time
	Amount   float64
	Notes    string
}

type ARCfgList struct {
	arCfgList []ArImportCfg
}

var (
	ArCfgData ARCfgList
)

func (arCfgData *ARCfgList) LoadARCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	// log.EnterFn(0, "LoadARCfg")
	// defer func() { log.ExitFn(0, "LoadARCfg", err) }()

	query = `
	 SELECT ai.id as record_id, ai.unique_id, ai.customer, ai.date, ai.amount
	 FROM ` + db.TableName_Ar + ` as ai`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		// log.ConfWarnTrace(0, "Failed to get ar import config from DB err: %v", err)
		return err
	}

	/* Clean AR Config previous data before updatin new data in list */
	arCfgData.arCfgList = arCfgData.arCfgList[:0]
	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.ConfWarnTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			// log.ConfWarnTrace(0, "Failed to get customer name for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		Amount, ok := item["amount"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
			continue
		}

		arImportData := ArImportCfg{
			RecordId: RecordId,
			UniqueId: Unique_id,
			Customer: Customer,
			Date:     Date,
			Amount:   Amount,
		}

		arCfgData.arCfgList = append(arCfgData.arCfgList, arImportData)
	}

	return err
}

func (arCfgData *ARCfgList) GetTotalPaidForUniqueId(UniqueId string) (totalPaid float64, uid string) {
	var (
		err error
	)

	// log.EnterFn(0, "GetTotalPaidForUniqueId")
	// defer func() { log.ExitFn(0, "GetTotalPaidForUniqueId", err) }()

	totalPaid = 0

	if len(UniqueId) <= 0 {
		// err = fmt.Errorf("empty unique id provided")
		log.FuncErrorTrace(0, "%+v", err)
		return totalPaid, ""
	}
	for _, arCfg := range arCfgData.arCfgList {
		if arCfg.UniqueId == UniqueId {
			totalPaid += arCfg.Amount
		}
	}
	if totalPaid != 0 {
		return totalPaid, UniqueId
	}
	return totalPaid, ""
}
