/**************************************************************************
 * File            : adderDataCfg.go
 * DESCRIPTION     : This file contains the model and data form adderData
 * DATE            : 05-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"
)

type AdderDataCfgStruct struct {
	AdderDataList models.GetAdderDataList
}

var (
	AdderDataCfg AdderDataCfgStruct
)

func (AdderDataCfg *AdderDataCfgStruct) LoadAdderDataCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadAdderDataCfg")
	defer func() { log.ExitFn(0, "LoadAdderDataCfg", err) }()

	query = `
		SELECT ad.id AS record_id, ad.unique_id, ad.date, ad.type_ad_mktg, ad.type, ad.gc, ad.exact_amount, ad.per_kw_amt, ad.rep_percent, ad.description, ad.notes, ad.sys_size, ad.adder_cal
		FROM ` + db.TableName_adder_data + ` ad`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder data Condif from DB err: %v", err)
		err = fmt.Errorf("Failed to get Adder data Condif from DB")
		return err
	}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.ConfWarnTrace(0, "Failed to get UniqueId for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		Date, ok := item["date"].(string)
		if !ok || Date == "" {
			log.ConfWarnTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = ""
		}

		TypeAdMktg, ok := item["type_ad_mktg"].(string)
		if !ok || TypeAdMktg == "" {
			log.ConfWarnTrace(0, "Failed to get TypeAdMktg for Record ID %v. Item: %+v\n", RecordId, item)
			TypeAdMktg = ""
		}

		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.ConfWarnTrace(0, "Failed to get Type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			log.ConfWarnTrace(0, "Failed to get Gc for Record ID %v. Item: %+v\n", RecordId, item)
			Gc = ""
		}

		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok || ExactAmount <= 0.0 {
			log.ConfWarnTrace(0, "Failed to get ExactAmount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		Description, ok := item["description"].(string)
		if !ok || Description == "" {
			log.ConfWarnTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.ConfWarnTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		PerKwAmt, ok := item["per_kw_amt"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get PerKwAmt for Record ID %v. Item: %+v\n", RecordId, item)
			PerKwAmt = 0.0
		}

		RepPercent, ok := item["rep_percent"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
			RepPercent = 0.0
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get SysSize for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		AdderCal, ok := item["adder_cal"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
			AdderCal = 0.0
		}

		AdderData := models.GetAdderData{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Date:        Date,
			TypeAdMktg:  TypeAdMktg,
			Type:        Type,
			Gc:          Gc,
			ExactAmount: ExactAmount,
			Description: Description,
			Notes:       Notes,
			PerKwAmt:    PerKwAmt,
			RepPercent:  RepPercent,
			SysSize:     SysSize,
			AdderCal:    AdderCal,
		}

		AdderDataCfg.AdderDataList.AdderDataList = append(AdderDataCfg.AdderDataList.AdderDataList, AdderData)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculateAddrPtr
 * DESCRIPTION:     calculates the "addr_ptr" value based on the provided data
 * RETURNS:         addrPtr
 *****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateAddrPtr(dealer string, uniqueId string) (addrPtrSum float64) {
	log.EnterFn(0, "CalculateAddrPtr")
	defer func() { log.ExitFn(0, "CalculateAddrPtr", nil) }()

	if len(dealer) > 0 {
		for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
			if (data.UniqueId + data.Gc) == (uniqueId + "Partner") {
				addrPtrSum += data.AdderCal
			}
		}
	}
	return addrPtrSum
}
