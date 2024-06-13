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
        SELECT ad.id AS record_id, ad.unique_id, ad.date, ad.type_ad_mktg, ad.type1, ad.gc, ad.exact_amount, ad.per_kw_amt, ad.rep_percent, ad.description, ad.notes, ad.sys_size, ad.adder_cal
        FROM ` + db.TableName_adder_data + ` ad`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		// log.FuncErrorTrace(0, "Failed to get Adder data Config from DB err: %v", err)
		// err = fmt.Errorf("failed to get adder data config from db")
		return err
	}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			// log.ConfWarnTrace(0, "Failed to get UniqueId for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		Date, ok := item["date"].(string)
		if !ok || Date == "" {
			// log.ConfWarnTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = ""
		}

		TypeAdMktg, ok := item["type_ad_mktg"].(string)
		if !ok || TypeAdMktg == "" {
			// log.ConfWarnTrace(0, "Failed to get TypeAdMktg for Record ID %v. Item: %+v\n", RecordId, item)
			TypeAdMktg = ""
		}

		Type, ok := item["type1"].(string)
		if !ok || Type == "" {
			// log.ConfWarnTrace(0, "Failed to get Type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			// log.ConfWarnTrace(0, "Failed to get Gc for Record ID %v. Item: %+v\n", RecordId, item)
			Gc = ""
		}

		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok || ExactAmount <= 0.0 {
			// log.ConfWarnTrace(0, "Failed to get ExactAmount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		Description, ok := item["description"].(string)
		if !ok || Description == "" {
			// log.ConfWarnTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.ConfWarnTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		PerKwAmt, ok := item["per_kw_amt"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get PerKwAmt for Record ID %v. Item: %+v\n", RecordId, item)
			PerKwAmt = 0.0
		}

		RepPercent, ok := item["rep_percent"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
			RepPercent = 0.0
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get SysSize for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		AdderCal, ok := item["adder_cal"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get RepPercent for Record ID %v. Item: %+v\n", RecordId, item)
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
func (AdderDataCfg *AdderDataCfgStruct) CalculateAddrPtr(dealer string, uniqueId string, sysSize float64) (addrPtrSum float64) {
	// log.EnterFn(0, "CalculateAddrPtr")
	// defer func() { log.ExitFn(0, "CalculateAddrPtr", nil) }()

	if len(dealer) > 0 {
		// for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
		// if (data.UniqueId + data.Gc) == (uniqueId + "Partner") {
		addrPtrSum += AdderDataCfg.CalculateAddrPartnerExpense(dealer, uniqueId, sysSize, true)
		// }
	}
	// }
	return addrPtrSum
}

/******************************************************************************
* FUNCTION:        CalculateExpense
* DESCRIPTION:     calculates the "addr_ptr" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateExpence(dealer string, uniqueId string, sysSize float64) (Expence float64) {
	// log.EnterFn(0, "CalculateExpence")
	// defer func() { log.ExitFn(0, "CalculateExpence", nil) }()

	if len(dealer) > 0 {
		// for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
		// if (data.UniqueId + data.Gc) == (uniqueId + "Expense") {
		Expence += AdderDataCfg.CalculateAddrPartnerExpense(dealer, uniqueId, sysSize, false)
	}
	// }
	// }
	return Expence
}

/******************************************************************************
* FUNCTION:        CalculateAddrPtr
* DESCRIPTION:     calculates the "addr_ptr" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateAddrPartnerExpense(dealer string, uniqueId string, sysSize float64, check bool) (addr float64) {
	log.EnterFn(0, "CalculateAddrPtr")
	defer func() { log.ExitFn(0, "CalculateAddrPtr", nil) }()
	var compare string
	if check {
		compare = "Partner"
	} else {
		compare = "Expense"
	}

	if len(dealer) > 0 {
		for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
			if (data.UniqueId + data.Gc) == (uniqueId + compare) {
				var adderamount float64
				if data.ExactAmount > 0 {
					adderamount = data.ExactAmount
				} else if data.PerKwAmt > 0 {
					adderamount = data.PerKwAmt * sysSize
				}
				addr += adderamount
			}
		}
	}
	return addr
}

/******************************************************************************
* FUNCTION:        CalculateAddrPtr
* DESCRIPTION:     calculates the "addr_ptr" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateAddr(dealer string, uniqueId string, sysSize float64) (addr float64) {
	log.EnterFn(0, "CalculateAddrPtr")
	defer func() { log.ExitFn(0, "CalculateAddrPtr", nil) }()

	if len(dealer) > 0 {
		for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
			if (data.UniqueId) == uniqueId {
				var adderamount float64
				if data.ExactAmount > 0 {
					adderamount = data.ExactAmount
				} else if data.PerKwAmt > 0 {
					adderamount = data.PerKwAmt * sysSize
				}
				addr += adderamount
			}
		}
	}
	return addr
}

func (AdderDataCfg *AdderDataCfgStruct) CalculatePerRepOvrdShare(uniqueId string, repCount float64) (perRepOvrdShare float64) {
	if len(uniqueId) > 0 {
		for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
			if data.UniqueId == uniqueId {
				if data.RepPercent <= 1 {
					return (data.ExactAmount * data.RepPercent) / repCount
				} else if data.RepPercent > 1 {
					return data.RepPercent / repCount
				}
			}
		}
	}
	return perRepOvrdShare
}

func (AdderDataCfg *AdderDataCfgStruct) CalculatePerRepAddrShare(exactAmount, perKwAmt, sysSize, repCount float64) (perRepAddrShare float64) {
	if exactAmount > 0 {
		return exactAmount / repCount
	} else if perKwAmt > 0 {
		return (perKwAmt * sysSize) / repCount
	} else {
		return perRepAddrShare
	}
}

func (AdderDataCfg *AdderDataCfgStruct) CalculateR1AddrResp(uniqueId, rep1 string, repCount, exactAmount, perKwAmt, sysSize float64) (r1AddrResp float64) {
	var r1PayScale float64
	perRepOvrdshare := AdderDataCfg.CalculatePerRepOvrdShare(uniqueId, repCount)
	if perRepOvrdshare > 0 {
		return perRepOvrdshare
	} else if len(rep1) > 0 {
		perRepAddrShare := AdderDataCfg.CalculatePerRepAddrShare(exactAmount, perKwAmt, sysSize, repCount)
		rep1DefResp := AdderDataCfg.CalculateRep1DefResp()
		return perRepAddrShare * rep1DefResp
	} else {
		return r1AddrResp
	}
}

func (AdderDataCfg *AdderDataCfgStruct) CalculateRepCount(rep1, rep2 string) (repCount float64) {
	if len(rep1) > 0 && len(rep2) > 0 {
		return 2
	}
	return 1
}

func (AdderDataCfg *AdderDataCfgStruct) CalculateR1Addr(uniqueId, rep1, rep2 string) (R1Addr float64) {
	var repCount float64
	if len(uniqueId) > 0 {
		for _, data := range AdderDataCfg.AdderDataList.AdderDataList {
			if data.UniqueId == uniqueId {
				if len(rep1) > 0 {
					repCount = AdderDataCfg.CalculateRepCount(rep1, rep2)
				}
				R1Addr += AdderDataCfg.CalculateR1AddrResp(uniqueId, rep1, repCount, data.ExactAmount, data.PerKwAmt, data.SysSize)
			}
		}
	}
	return R1Addr
}
