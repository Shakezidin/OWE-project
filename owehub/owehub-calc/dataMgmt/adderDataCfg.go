/**************************************************************************
* File            : adderDataCfg.go
* DESCRIPTION     : This file contains the model and data form adderData
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type TempGetAdderData struct {
	RecordId    int64     `json:"record_id"`
	UniqueId    string    `json:"unique_id"`
	Date        time.Time `json:"date"`
	TypeAdMktg  string    `json:"type_ad_mktg"`
	Type        string    `json:"type"`
	Gc          string    `json:"gc"`
	ExactAmount float64   `json:"exact_amount"`
	PerKwAmt    float64   `json:"per_kw_amt"`
	RepPercent  float64   `json:"rep_percent"`
	Description string    `json:"description"`
	Notes       string    `json:"notes"`
	SysSize     float64   `json:"sys_size"`
	AdderCal    float64   `json:"adder_cal"`
}

type AdderDataCfgStruct struct {
	AdderDataList []TempGetAdderData
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

		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get Date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
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

		AdderData := TempGetAdderData{
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

		AdderDataCfg.AdderDataList = append(AdderDataCfg.AdderDataList, AdderData)
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
		for _, data := range AdderDataCfg.AdderDataList {
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
		for _, data := range AdderDataCfg.AdderDataList {
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

/******************************************************************************
* FUNCTION:        CalculateAddrAmount
* DESCRIPTION:     calculates the "CalculateAddrAmount" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateR1Addr(dealer, rep1, rep2, uniqueId, state string, sysSize float64) (r1addr float64) {
	log.EnterFn(0, "CalculateAddrAmount")
	defer func() { log.ExitFn(0, "CalculateAddrAmount", nil) }()

	if len(uniqueId) > 0 {
		return AdderDataCfg.CalculateR1AddrResp(dealer, rep1, rep2, uniqueId, state, sysSize)
	}
	return r1addr
}

/******************************************************************************
* FUNCTION:        CalculateAddrAmount
* DESCRIPTION:     calculates the "CalculateAddrAmount" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateR1AddrResp(dealer, rep1, rep2, uniqueId, state string, sysSize float64) (r1addrresp float64) {
	log.EnterFn(0, "CalculateAddrAmount")
	defer func() { log.ExitFn(0, "CalculateAddrAmount", nil) }()

	if len(uniqueId) > 0 {
		for _, data := range AdderDataCfg.AdderDataList {
			if data.UniqueId == uniqueId {
				perRepOverd := AdderDataCfg.CalculatePerRepOvrd(rep1, rep2, uniqueId) //*
				if perRepOverd > 0 {
					if perRepOverd != 0 {
						return perRepOverd
					} else {
						return 0
					}
				} else if len(rep1) > 0 {
					perRepAddrShare := AdderDataCfg.CalculatePerRepAddrShare(rep1, rep2, uniqueId, sysSize) //*
					r1DefResp := AdderDataCfg.CalculateR1DfResp(rep1, rep2, uniqueId, state, sysSize)       //*
					return perRepAddrShare * r1DefResp
				}
			}
		}
	}
	return r1addrresp
}

func (AdderDataCfg *AdderDataCfgStruct) CalculatePerRepOvrdShare(uniqueId string, repCount float64) (perRepOvrdShare float64) {
	if len(uniqueId) > 0 {
		for _, data := range AdderDataCfg.AdderDataList {
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

/******************************************************************************
* FUNCTION:        CalculatePerRepOvrd
* DESCRIPTION:     calculates the "CalculateAddrAmount" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculatePerRepOvrd(rep1, rep2, uniqueId string) (perRepOvrd float64) {
	log.EnterFn(0, "CalculatePerRepOvrd")
	defer func() { log.ExitFn(0, "CalculatePerRepOvrd", nil) }()

	for _, data := range AdderDataCfg.AdderDataList {
		if data.UniqueId == uniqueId {
			repPercent := (data.RepPercent / 100)
			repCount := AdderDataCfg.CalculateRepCount(rep1, rep2) //*
			if repPercent > 0 {
				if repPercent <= 1 {
					perRepOvrd += (data.ExactAmount * repPercent) / repCount
				} else if repPercent > 1 {
					perRepOvrd += repPercent / repCount
				}
			}
		}
	}
	return perRepOvrd
}

/******************************************************************************
* FUNCTION:        CalculateRepCount
* DESCRIPTION:     calculates the "CalculateRepCount" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateRepCount(rep1, rep2 string) (repCount float64) {
	log.EnterFn(0, "CalculateRepCount")
	defer func() { log.ExitFn(0, "CalculateRepCount", nil) }()

	if len(rep1) > 0 && len(rep2) > 0 {
		return 2
	} else if len(rep1) > 0 || len(rep2) > 0 {
		return 1
	} else {
		return 0
	}
}

/******************************************************************************
* FUNCTION:        CalculatePerRepAddrShare
* DESCRIPTION:     calculates the "CalculatePerRepAddrShare" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculatePerRepAddrShare(rep1, rep2, uniqueId string, sysSize float64) (perRepAddrShare float64) {
	log.EnterFn(0, "CalculatePerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculatePerRepAddrShare", nil) }()
	for _, data := range AdderDataCfg.AdderDataList {
		repCount := AdderDataCfg.CalculateRepCount(rep1, rep2)
		if uniqueId == data.UniqueId {
			if data.ExactAmount > 0 {
				perRepAddrShare = data.ExactAmount / repCount
			} else if data.PerKwAmt > 0 {
				perRepAddrShare = (data.PerKwAmt * sysSize) / repCount
			}
		}
	}
	return perRepAddrShare
}

/******************************************************************************
* FUNCTION:        CalculatePerRepAddrShare
* DESCRIPTION:     calculates the "CalculatePerRepAddrShare" value based on the provided data
* RETURNS:         addrPtr
*****************************************************************************/
func (AdderDataCfg *AdderDataCfgStruct) CalculateR1DfResp(rep1, rep2, uniqueId, state string, sysSize float64) (r1DfResp float64) {
	log.EnterFn(0, "CalculatePerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculatePerRepAddrShare", nil) }()
	for _, data := range AdderDataCfg.AdderDataList {
		if uniqueId != data.UniqueId {
			continue
		}
		r1PayScale, _ := RepPayCfg.CalculateR1PayScale(rep1, state, data.Date)
		if len(r1PayScale) > 0 {
			return adderRespCfg.CalculateAdderResp(r1PayScale) //*
		}
	}
	return r1DfResp
}
