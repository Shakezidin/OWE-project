/**************************************************************************
* File            : autoAdderCfg.go
* DESCRIPTION     : This file contains the model and data form autoAdder
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strings"
	"time"
)

// type
// unique_id
// PerKwAmt

type AutoAdder struct {
	RecordId   int64
	UniqueId   string
	SysSize    float64 // this
	PerKwAmt   float64
	Type1      string
	RepPercent float64
}

type AutoAdderCfgStruct struct {
	AutoAdderList []AutoAdder
}

var (
	AutoAdderCfg AutoAdderCfgStruct
)

/******************************************************************************
* FUNCTION:        CalculateAddrAuto
* DESCRIPTION:     calculates the addrAuto value for ar_Calc
* RETURNS:         addrAuto
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateArAddrAuto(dealer string, uniqueId string, systemSize float64, state, installer string) (addrAuto float64) {
	systemType := calculateType(systemSize, state)
	if (installer == "OWE" || installer == "OUR WORLD ENERGY") || systemType == "" {
		return addrAuto
	}
	excatAmt := calculateExactAmount(uniqueId, systemType)
	addrAuto = excatAmt
	return addrAuto
}

/******************************************************************************
* FUNCTION:        CalculateAddrAuto
* DESCRIPTION:     calculates the addrAuto value based on the provided data
* RETURNS:         addrAuto
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateAddrAuto(dealer string, uniqueId string, systemType string) (addrAuto float64) {
	log.EnterFn(0, "CalculateAddrAuto")
	defer func() { log.ExitFn(0, "CalculateAddrAuto", nil) }()

	/*  Autoadder is reterived from sale data,
	    So there is no chance that unique_id repeat in autoadder */
	excatAmt := calculateExactAmount(uniqueId, systemType)
	addrAuto = excatAmt

	/*
	   if len(dealer) > 0 {
	       for _, data := range AutoAdderCfg.AutoAdderList {
	           if data.UniqueId == uniqueId {
	               excatAmt := calculateExactAmount(uniqueId, systemType)
	               addrAuto += excatAmt
	           }
	       }
	   }
	*/
	return addrAuto
}

/******************************************************************************
* FUNCTION:        calculateExactAmount
* DESCRIPTION:     calculates the Excat Amount value based on the provided data
* RETURNS:         excatAmount
*****************************************************************************/
func calculateExactAmount(uniqueId string, systemType string) (excatAmt float64) {

	log.EnterFn(0, "calculateExactAmount")
	defer func() { log.ExitFn(0, "calculateExactAmount", nil) }()

	if len(uniqueId) <= 0 {
		return 0.0
	}
	if len(systemType) >= 2 && strings.ToUpper(systemType[:2]) == "MK" {
		return 0.0
	}

	switch systemType {
	case "SM-UNI2":
		return 1200
	case "SM-UNI3", "SM-CA2":
		return 600
	default:
		return 0.0
	}
}

func (AutoAdderCfg *AutoAdderCfgStruct) LoadAutoAdderCfg() (errr error) {
	var (
		err          error
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		PerKWAmount  float64
		// ExactAmount  float64
	)
	log.EnterFn(0, "LoadAutoAdderCfg")
	defer func() { log.ExitFn(0, "LoadAutoAdderCfg", err) }()

	// query = `
	// 		SELECT
	// 		ad.unique_id,
	// 		ad.wc_1 AS date,
	// 		ad.installer AS gc,
	// 		ad.system_size as sys_size,
	// 		ad.net_epc as rep_percentage,
	// 		ad.primary_sales_rep as notes_no_repvisible,
	// 		(SELECT
	// 			CASE
	// 				WHEN system_size <= 3 THEN
	// 					CASE
	// 						WHEN state ILIKE 'CA' THEN 'SM-CA2'
	// 						ELSE 'SM-UNI2'
	// 					END
	// 				WHEN system_size > 3 AND system_size <= 4 THEN
	// 					CASE
	// 						WHEN state NOT ILIKE 'CA' THEN 'SM-UNI3'
	// 						ELSE NULL
	// 					END
	// 				ELSE NULL
	// 			END
	// 		FROM consolidated_data_view cdv
	// 		WHERE cdv.unique_id = ad.unique_id) AS type
	// 	FROM consolidated_data_view ad`

	query = `
			SELECT 
			ad.unique_id,
			ad.system_size as sys_size,
			ad.state as state
			FROM consolidated_data_view ad
			`

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		return
	}

	for _, item := range data {
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
			Unique_id = ""
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
			SysSize = 0
		}

		State, ok := item["sys_size"].(string)
		if !ok || State == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
			State = ""
		}
		RepPercent, ok := item["rep_percent"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
			RepPercent = 0
		}

		Type := calculateType(SysSize, State)

		switch Type {
		case "SM-UNI2":
			PerKWAmount = 0.0
		case "SM-UNI3":
			PerKWAmount = 0.0
		case "SM-CA2":
			PerKWAmount = 0.0
		}

		AutoAdderData := AutoAdder{
			UniqueId:   Unique_id,
			SysSize:    SysSize,
			PerKwAmt:   PerKWAmount,
			Type1:      Type,
			RepPercent: RepPercent,
		}

		AutoAdderCfg.AutoAdderList = append(AutoAdderCfg.AutoAdderList, AutoAdderData)

		// if strings.HasPrefix(Type, "MK") {
		// 	qry := `select fee_rate from marketing fee where state ilike 'MK'`
		// 	data3, err := db.ReteriveFromDB(db.OweHubDbIndex, qry, whereEleList)
		// 	if err != nil {
		// 		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		// 		return
		// 	}
		// 	PerKWAmount, ok = data3[0]["fee_rate"].(float64)
		// 	if !ok || Unique_id == "" {
		// 		log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
		// 		Unique_id = ""
		// 	}
		// } else {
		// 	switch Type {
		// 	case "SM-UNI2":
		// 		PerKWAmount = 0.0
		// 	case "SM-UNI3":
		// 		PerKWAmount = 0.0
		// 	case "SM-CA2":
		// 		PerKWAmount = 0.0
		// 	}
		// }

		// if strings.HasPrefix(Type, "MK") {
		// 	DescriptionRepVisible = fmt.Sprintf("Marketing Fee %s", Type[11:18])
		// } else {
		// 	switch Type {
		// 	case "SM-UNI2":
		// 		DescriptionRepVisible = "Small System Size"
		// 	case "SM-UNI3":
		// 		DescriptionRepVisible = "Small System Size"
		// 	case "SM-CA2":
		// 		DescriptionRepVisible = "Small System Size"
		// 	}
		// }

		// AdderType = "Adder"
	}

	return err
}

func calculateType(sysSize float64, state string) string {
	if sysSize <= 3 {
		if strings.HasPrefix(strings.ToUpper(state), "CA") {
			return "SM-CA2"
		} else {
			return "SM-UNI2"
		}
	} else if sysSize > 3 && sysSize <= 4 {
		if !strings.HasPrefix(strings.ToUpper(state), "CA") {
			return "SM-UNI3"
		} else {
			return ""
		}
	} else {
		return ""
	}
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateAutoAddr(dealer string, uniqueId string, sysSize float64) float64 {
	log.EnterFn(0, "CalculateAutoAddr")
	defer func() { log.ExitFn(0, "CalculateAutoAddr", nil) }()
	var autoAdder float64

	if len(dealer) > 0 {
		for _, data := range AutoAdderCfg.AutoAdderList {
			if data.UniqueId == uniqueId {
				if len(data.Type1) == 0 {
					continue
				}

				if data.Type1[:2] == "MK" {
					if MarketingFeeCfg.CalculateChgDlr(data.Type1) {
						addramount := AutoAdderCfg.CalculateExactAmount(data.UniqueId)
						if addramount > 0 {
							autoAdder = addramount
						} else if data.PerKwAmt > 0 {
							autoAdder = data.PerKwAmt * sysSize
						}
					} else {
						continue
					}
				} else {
					Exactmount := AutoAdderCfg.CalculateExactAmount(data.UniqueId)
					if Exactmount > 0 {
						autoAdder = Exactmount
					} else if data.PerKwAmt > 0 {
						autoAdder = data.PerKwAmt * sysSize
					}
				}
			}
		}
	}
	return autoAdder
}

func (AutoAdderCfg *AutoAdderCfgStruct) CalculateExactAmount(uniqueId string) (ExactAmount float64) {
	log.EnterFn(0, "CalculateExactAmount")
	defer func() { log.ExitFn(0, "CalculateExactAmount", nil) }()
	if len(uniqueId) > 0 {
		for _, data := range AutoAdderCfg.AutoAdderList {
			if data.UniqueId == uniqueId {
				switch {
				case data.Type1[:2] == "MK":
					ExactAmount = 0
				case data.Type1 == "SM-UNI2":
					ExactAmount = 1200
				case data.Type1 == "SM-UNI3":
					ExactAmount = 600
				case data.Type1 == "SM-CA2":
					ExactAmount = 600
				default:
					ExactAmount = 0
				}
			}
		}
	}
	return ExactAmount
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRAutoAddr(rep1, rep2, uniqueId, state string, sysSize float64, wc time.Time, r1r2check bool) float64 {
	log.EnterFn(0, "CalculateRepRAutoAddr")
	defer func() { log.ExitFn(0, "CalculateRepRAutoAddr", nil) }()
	return AutoAdderCfg.CalculateRepRAddrResp(rep1, rep2, uniqueId, state, sysSize, wc, r1r2check)
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRAddrResp(rep1, rep2, uniqueId, state string, sysSize float64, wc time.Time, r1r2check bool) (r1AddrResp float64) {
	log.EnterFn(0, "CalculateRepRAddrResp")
	defer func() { log.ExitFn(0, "CalculateRepRAddrResp", nil) }()
	rep := rep1
	if !r1r2check {
		rep = rep2
	}

	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			perRepOvrdShare := AutoAdderCfg.CalculateRepPerRepOvrdShare(rep1, rep2, uniqueId)
			if perRepOvrdShare > 0 {
				if perRepOvrdShare > 0 {
					return perRepOvrdShare
				} else {
					return r1AddrResp
				}
			} else if len(rep1) > 0 {
				log.FuncErrorTrace(0, "==================================hello============================")
				perRepAddrShare := AutoAdderCfg.CalculateRepPerRepAddrShare(rep1, rep2, uniqueId, state, sysSize, wc)
				rep1DefResp := AutoAdderCfg.CalculateRepRep1DefResp(rep, uniqueId, state, wc)
				if data.Type1[:2] == "MK" {
					return perRepAddrShare
				} else {
					return perRepAddrShare * rep1DefResp
				}
			}
		}
	}
	return r1AddrResp
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerRepOvrdShare(rep1, rep2, uniqueId string) (perRepOvrdShare float64) {
	log.EnterFn(0, "CalculateRepPerRepOvrdShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepOvrdShare", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if uniqueId == data.UniqueId {
			if data.RepPercent > 0 {
				exactAmt := AutoAdderCfg.CalculateRepExactAmount(rep1, uniqueId)
				repCount := AutoAdderCfg.CalculateRepRepCount(rep1, rep2, uniqueId)
				if data.RepPercent <= 1 {
					return (exactAmt * (data.RepPercent / 100)) / repCount
				} else if data.RepPercent > 1 {
					return (data.RepPercent / 100) / repCount
				}
			} else {
				return perRepOvrdShare
			}
		}
	}
	return perRepOvrdShare
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepExactAmount(rep1, uniqueId string) (ExactAmount float64) {
	log.EnterFn(0, "CalculateRepExactAmount")
	defer func() { log.ExitFn(0, "CalculateRepExactAmount", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			switch {
			case data.Type1[10:] == "BPN: SETTER":
				ExactAmount = 500
			case data.Type1[:2] == "MK":
				ExactAmount = 0
			case data.Type1 == "SM-UNI2":
				ExactAmount = 1200
			case data.Type1 == "SM-UNI3":
				ExactAmount = 600
			case data.Type1 == "SM-CA2":
				ExactAmount = 600
			default:
				ExactAmount = 0
			}
		}
	}
	return ExactAmount
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRepCount(rep1, rep2, uniqueId string) float64 {
	log.EnterFn(0, "CalculateRepRepCount")
	defer func() { log.ExitFn(0, "CalculateRepRepCount", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			if len(rep1) > 0 && len(rep2) > 0 {
				return 2
			} else if len(rep1) > 0 || len(rep2) > 0 {
				return 1
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerRepAddrShare(rep1, rep2, uniqueId, state string, sysSize float64, wc time.Time) (perRepAddrShare float64) {
	log.EnterFn(0, "CalculateRepPerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepAddrShare", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if uniqueId == data.UniqueId {
			exactAmnt := AutoAdderCfg.CalculateRepExactAmount(rep1, uniqueId)
			log.FuncErrorTrace(0, "==================================%v", exactAmnt)
			repCount := AutoAdderCfg.CalculateRepRepCount(rep1, rep2, uniqueId)
			perKwAmt := AutoAdderCfg.CalculateRepPerKwAmount(rep1, uniqueId)
			if exactAmnt > 0 {
				perRepAddrShare = exactAmnt / repCount
			} else if strings.Contains(data.Type1, "FR SET") {
				perRepAddrShare = perKwAmt / repCount
			} else if perKwAmt > 0 {
				perRepAddrShare = (perKwAmt * sysSize) / repCount
			}
		}
	}
	return perRepAddrShare
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerKwAmount(rep1, uniqueId string) (PerKwAmount float64) {
	log.EnterFn(0, "CalculateRepPerKwAmount")
	defer func() { log.ExitFn(0, "CalculateRepPerKwAmount", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			switch {
			case data.Type1[:2] == "MK":
				PerKwAmount = mktgFeeCfg.CalculateRepFeeRate(data.Type1)
			case data.Type1 == "SM-UNI2":
				PerKwAmount = 0
			case data.Type1 == "SM-UNI3":
				PerKwAmount = 0
			case data.Type1 == "SM-CA2":
				PerKwAmount = 0
			default:
				PerKwAmount = 0
			}
		}
	}
	return PerKwAmount
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRep1DefResp(rep1, uniqueId, state string, wc time.Time) (defResp float64) {
	log.EnterFn(0, "CalculateRepRep1DefResp")
	defer func() { log.ExitFn(0, "CalculateRepRep1DefResp", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			payScale := AutoAdderCfg.CalculateRepR1PayScale(rep1, uniqueId, state, wc)
			if len(payScale) > 0 {
				defResp = adderRespCfg.CalculateAdderResp(payScale)
			}
		}
	}
	return defResp
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepR1PayScale(rep1, uniqueId, state string, wc time.Time) (payscale string) {
	log.EnterFn(0, "CalculateRepR1PayScale")
	defer func() { log.ExitFn(0, "CalculateRepR1PayScale", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			if len(rep1) > 0 {
				payscale, _ = RepPayCfg.CalculateRPayScale(rep1, state, wc)
			}
		}
	}
	return payscale
}
