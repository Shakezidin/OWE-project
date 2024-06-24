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

type GetRebateDataTemp struct {
	UniqueId        string    `json:"unique_id"`
	Amount          float64   `json:"amount"`
	RepDollDivbyPer float64   `json:"rep_doll_divby_per"`
	Date            time.Time `json:"end_date"`
	Types           string
}

type RebateCfgStruct struct {
	RebateList []GetRebateDataTemp
}

var (
	RebateCfg RebateCfgStruct
)

func (RebateCfg *RebateCfgStruct) LoadRebateCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadAdderDataCfg")
	defer func() { log.ExitFn(0, "LoadAdderDataCfg", err) }()

	query = `
      SELECT unique_id, rep_doll_divby_per, amount, type, date
      FROM rebate_data`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rebate data from DB err: %v", err)
		return
	}
	for _, item := range data {
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		Types, ok := item["type"].(string)
		if !ok || Types == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Types = ""
		}
		// amount
		Amount, ok := item["amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0
		}

		Rep_doll_divby_per, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_doll_divby_per = 0.0
		}

		// EndDate
		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		RebateData := GetRebateDataTemp{
			UniqueId:        Unique_id,
			Amount:          Amount,
			RepDollDivbyPer: Rep_doll_divby_per,
			Date:            Date,
			Types:           Types,
		}

		RebateCfg.RebateList = append(RebateCfg.RebateList, RebateData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateRebate
* DESCRIPTION:     calculates the ap rep value based on the unique Id
* RETURNS:         rebate float64
*****************************************************************************/
func (RebateCfg *RebateCfgStruct) CalculateRebate(dealer string, uniqueId string) (rebate float64) {

	log.EnterFn(0, "CalculateRebate")
	defer func() { log.ExitFn(0, "CalculateRebate", nil) }()

	if len(dealer) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				if data.Amount > 0 { //need to change amoun of type string to float64
					if len(data.Types) >= 9 && data.Types[:9] == "Retention" {
						rebate += 0
					} else {
						rebate += data.Amount
					}
				}
			}
		}
	}
	return rebate
}
func (RebateCfg *RebateCfgStruct) CalculateRepCount(rep1, rep2 string) (repCount float64) {
	log.EnterFn(0, "CalculateRepCount 3")
	defer func() { log.ExitFn(0, "CalculateRepCount", nil) }()
	if len(rep1) > 0 && len(rep2) > 0 {
		return 2
	}
	return 1
}

func (RebateCfg *RebateCfgStruct) CalculatePerRepOvrdShare(uniqueId string, repCount float64) (PerRepOvrdShare float64) {
	log.EnterFn(0, "CalculatePerRepOvrdShare")
	defer func() { log.ExitFn(0, "CalculatePerRepOvrdShare", nil) }()
	if len(uniqueId) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				if (data.RepDollDivbyPer / 100) <= 1 {
					return (data.Amount * (data.RepDollDivbyPer / 100)) / repCount
				} else if (data.RepDollDivbyPer / 100) > 1 {
					return (data.RepDollDivbyPer / 100) / repCount
				} else {
					return 0.0
				}
			}
		}
	}
	return PerRepOvrdShare
}

func (RebateCfg *RebateCfgStruct) CalculatePerRepDefOvrd(uniqueId string) (PerRepOvrdDed float64) {
	log.EnterFn(0, "CalculatePerRepDefOvrd")
	defer func() { log.ExitFn(0, "CalculatePerRepDefOvrd", nil) }()

	if len(uniqueId) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				if len(data.Types) >= 9 && data.Types[:9] == "Retention" {
					return 0
				} else if data.Types == "Promo" {
					return 0
				} else {
					return 0
				}
			}
		}
	}
	return PerRepOvrdDed
}

func (RebateCfg *RebateCfgStruct) CalculatePerRepAddrShare(uniqueId string, repCount float64) (perRepAddrShare float64) {
	log.EnterFn(0, "CalculatePerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculatePerRepAddrShare", nil) }()
	if len(uniqueId) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				if data.Amount > 0 {
					log.FuncErrorTrace(0, "AMOUNT 1+++++++=====================%v", data.Amount)
					return data.Amount / repCount
				} else {
					log.FuncErrorTrace(0, "AMOUNT 1+++++++=====================%v", data.Amount)
					return perRepAddrShare
				}
			}
		}
	}
	return perRepAddrShare
}

func (RebateCfg *RebateCfgStruct) CalculateR1AddrResp(uniqueId, rep1, rep2, state, Type string, date time.Time, r1r2check bool) (R1AddrResp float64) {
	log.EnterFn(0, "CalculateR1AddrResp")
	defer func() { log.ExitFn(0, "CalculateR1AddrResp", nil) }()
	var repCount float64

	rep := rep1
	if !r1r2check {
		rep = rep2
	}

	if len(rep) > 0 {
		repCount = RebateCfg.CalculateRepCount(rep1, rep2)
	}

	PerRepOverSHare := RebateCfg.CalculatePerRepOvrdShare(uniqueId, repCount)

	PerRepDefOvrd := RebateCfg.CalculatePerRepDefOvrd(uniqueId)
	log.FuncErrorTrace(0, "PerRepDefOvrd+++++++=====================%v count- > %v", PerRepDefOvrd)

	PerRepAddrShare := RebateCfg.CalculatePerRepAddrShare(uniqueId, repCount)
	log.FuncErrorTrace(0, "PerRepAddrShare+++++++=====================%v count -> %v", PerRepAddrShare)

	R1PayScale, _ := RepPayCfg.CalculateRPayScale(rep, state, date)
	log.FuncErrorTrace(0, "R1PayScale+++++++=====================%v count -> %v rep -> %v", R1PayScale, rep)
	R1RebateCreditPercentage := AdderCreditCfg.CalculateR1RebateCreditPercentage(R1PayScale, Type)
	log.FuncErrorTrace(0, ",R1RebateCreditPercentage+++++++++++++++++++%v", R1RebateCreditPercentage)
	R1RebateCreditDol := R1RebateCreditPercentage / repCount
	if PerRepOverSHare > 0 {
		return PerRepOverSHare
	} else if PerRepDefOvrd > 0 {
		return PerRepDefOvrd
	} else if len(rep) > 0 {
		if (PerRepAddrShare * R1RebateCreditPercentage) < R1RebateCreditDol {
			PerRepAddrShare -= PerRepAddrShare * R1RebateCreditPercentage
		} else {
			return PerRepAddrShare - R1RebateCreditDol
		}

	} else {
		return R1AddrResp
	}
	return R1AddrResp
}

func (RebateCfg *RebateCfgStruct) CalculateRRebate(rep1, rep2, state, uniqueId string, r1r2check bool) (R1Rebate float64) {
	log.EnterFn(0, "CalculateR1Rebate")
	defer func() { log.ExitFn(0, "CalculateR1Rebate", nil) }()

	rep := rep1
	if !r1r2check {
		rep = rep2
	}

	if len(rep) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				R1Rebate += RebateCfg.CalculateR1AddrResp(data.UniqueId, rep1, rep2, state, data.Types, data.Date, r1r2check)
			}
		}
	}
	return R1Rebate
}
