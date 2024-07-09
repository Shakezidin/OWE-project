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

	log.FuncErrorTrace(0, "autoadder data : %v", data[0])
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

/******************************************************************************
* FUNCTION:        CalculateExactAmount
* DESCRIPTION:     calculates the "exact amount" value based on the provided data
* RETURNS:         ExactAmount
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateExactAmount(uniqueId string) (ExactAmount float64) {
	log.EnterFn(0, "CalculateExactAmount")
	defer func() { log.ExitFn(0, "CalculateExactAmount", nil) }()
	ExactAmount = 0.0
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
* FUNCTION:        CalculateRepRAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         float64
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRAutoAddr(rep1, rep2, uniqueId, state, types string, sysSize float64, wc time.Time, r1r2check bool) float64 {
	log.EnterFn(0, "CalculateRepRAutoAddr")
	defer func() { log.ExitFn(0, "CalculateRepRAutoAddr", nil) }()
	if r1r2check {
		return AutoAdderCfg.CalculateRep1AddrResp(rep1, rep2, uniqueId, state, types, sysSize, wc, r1r2check)
	} else {
		return AutoAdderCfg.CalculateRep2AddrResp(rep1, rep2, uniqueId, state, types, sysSize, wc, r1r2check)
	}
}

/******************************************************************************
* FUNCTION:        CalculateRep1AddrResp
* DESCRIPTION:     calculates the "rep1 addr resp" value based on the provided data
* RETURNS:         r1AddrResp
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRep1AddrResp(rep1, rep2, uniqueId, state, types string, sysSize float64, wc time.Time, r1r2check bool) (r1AddrResp float64) {
	log.EnterFn(0, "CalculateRep1AddrResp")
	defer func() { log.ExitFn(0, "CalculateRep1AddrResp", nil) }()

	rep := rep1
	if !r1r2check {
		rep = rep2
	}

	r1AddrResp = 0.0

	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			perRepOvrdShare := AutoAdderCfg.CalculateRepPerRepOvrdShare(rep1, rep2, uniqueId, types)

			if perRepOvrdShare > 0 {
				r1AddrResp = perRepOvrdShare
			} else if len(rep) > 0 {
				perRepAddrShare := AutoAdderCfg.CalculateRepPerRepAddrShare(rep1, rep2, uniqueId, state, types, sysSize, wc)
				rep1DefResp := AutoAdderCfg.CalculateRepRep1DefResp(rep, uniqueId, state, wc)

				if len(data.Type1) >= 2 && data.Type1[:2] == "MK" {
					r1AddrResp = perRepAddrShare
				} else {
					r1AddrResp = perRepAddrShare * rep1DefResp
				}
			}
			break
		}
	}

	return r1AddrResp
}

/******************************************************************************
* FUNCTION:        CalculateRep2AddrResp
* DESCRIPTION:     calculates the "rep 2 adder resp" value based on the provided data
* RETURNS:         r1AddrResp
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRep2AddrResp(rep1, rep2, uniqueId, state, types string, sysSize float64, wc time.Time, r1r2check bool) (r1AddrResp float64) {
	log.EnterFn(0, "CalculateRep2AddrResp")
	defer func() { log.ExitFn(0, "CalculateRep2AddrResp", nil) }()
	rep := rep1
	if !r1r2check {
		rep = rep2
	}

	r1AddrResp = 0.0
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			perRepOvrdShare := AutoAdderCfg.CalculateRepPerRepOvrdShare(rep1, rep2, uniqueId, types)

			if perRepOvrdShare > 0 {
				r1AddrResp = perRepOvrdShare
			} else if len(rep) > 0 {
				perRepAddrShare := AutoAdderCfg.CalculateRepPerRepAddrShare(rep1, rep2, uniqueId, state, types, sysSize, wc)
				rep2DefResp := AutoAdderCfg.CalculateRepRep1DefResp(rep, uniqueId, state, wc)

				if len(data.Type1) >= 2 && data.Type1[:2] == "MK" {
					r1AddrResp = perRepAddrShare
				} else {
					r1AddrResp = perRepAddrShare * rep2DefResp
				}
			}
			break
		}
	}
	return r1AddrResp
}

/******************************************************************************
* FUNCTION:        CalculateRepPerRepOvrdShare
* DESCRIPTION:     calculates the "per rep ovrd share" value based on the provided data
* RETURNS:         perRepOvrdShare
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerRepOvrdShare(rep1, rep2, uniqueId, types string) (perRepOvrdShare float64) {
	log.EnterFn(0, "CalculateRepPerRepOvrdShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepOvrdShare", nil) }()
	var repPercent float64
	for _, data := range AutoAdderCfg.AutoAdderList {
		if uniqueId == data.UniqueId {
			repPercent = data.RepPercent / 100
			if repPercent > 0 {
				exactAmt := AutoAdderCfg.CalculateRepExactAmount(uniqueId, types)
				repCount := AutoAdderCfg.CalculateRepRepCount(rep1, rep2, uniqueId)
				if data.RepPercent <= 1 {
					return (exactAmt * repPercent) / repCount
				} else if data.RepPercent > 1 {
					return repPercent / repCount
				}
			} else {
				return perRepOvrdShare
			}
		}
	}
	return perRepOvrdShare
}

/******************************************************************************
* FUNCTION:        CalculateRepExactAmount
* DESCRIPTION:     calculates the "rep exact amount" value based on the provided data
* RETURNS:         ExactAmount
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepExactAmount(uniqueId, types string) (ExactAmount float64) {
	log.EnterFn(0, "CalculateRepExactAmount")
	defer func() { log.ExitFn(0, "CalculateRepExactAmount", nil) }()

	if len(types) > 10 && types[10:] == "BPN: SETTER" {
		ExactAmount = 500
	} else if len(types) >= 2 && types[:2] == "MK" {
		ExactAmount = 0
	} else if types == "SM-UNI2" {
		ExactAmount = 1200
	} else if types == "SM-UNI3" {
		ExactAmount = 600
	} else if types == "SM-CA2" {
		ExactAmount = 600
	} else {
		ExactAmount = 0
	}

	return ExactAmount
}

/******************************************************************************
* FUNCTION:        CalculateRepRepCount
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         float64
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRepCount(rep1, rep2, uniqueId string) float64 {
	log.EnterFn(0, "CalculateRepRepCount")
	defer func() { log.ExitFn(0, "CalculateRepRepCount", nil) }()
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			if len(rep1) > 0 && len(rep2) > 0 {
				return 2
			} else if len(rep1) > 0 {
				return 1
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateRepPerRepAddrShare
* DESCRIPTION:     calculates the "per rep addr share" value based on the provided data
* RETURNS:         perRepAddrShare
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerRepAddrShare(rep1, rep2, uniqueId, state, types string, sysSize float64, wc time.Time) (perRepAddrShare float64) {
	log.EnterFn(0, "CalculateRepPerRepAddrShare")
	defer func() { log.ExitFn(0, "CalculateRepPerRepAddrShare", nil) }()

	perRepAddrShare = 0.0

	for _, data := range AutoAdderCfg.AutoAdderList {
		if uniqueId == data.UniqueId {

			exactAmnt := AutoAdderCfg.CalculateRepExactAmount(uniqueId, types)
			repCount := AutoAdderCfg.CalculateRepRepCount(rep1, rep2, uniqueId)
			perKwAmt := AutoAdderCfg.CalculateRepPerKwAmount(rep1, uniqueId)

			if repCount == 0 {
				log.FuncErrorTrace(0, "repCount is zero, cannot divide by zero")
				continue
			}

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
* FUNCTION:        CalculateRepPerKwAmount
* DESCRIPTION:     calculates the "rep per kw amount" value based on the provided data
* RETURNS:         PerKwAmount
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepPerKwAmount(rep1, uniqueId string) (PerKwAmount float64) {
	log.EnterFn(0, "CalculateRepPerKwAmount")
	defer func() { log.ExitFn(0, "CalculateRepPerKwAmount", nil) }()
	PerKwAmount = 0.0
	for _, data := range AutoAdderCfg.AutoAdderList {

		if data.UniqueId == uniqueId {
			switch {
			case len(data.Type1) >= 2 && data.Type1[:2] == "MK":
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
* FUNCTION:        CalculateRepRep1DefResp
* DESCRIPTION:     calculates the "rep1 def resp" value based on the provided data
* RETURNS:         defResp
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepRep1DefResp(rep1, uniqueId, state string, wc time.Time) (defResp float64) {
	log.EnterFn(0, "CalculateRepRep1DefResp")
	defer func() { log.ExitFn(0, "CalculateRepRep1DefResp", nil) }()

	defResp = 0.0
	for _, data := range AutoAdderCfg.AutoAdderList {
		if data.UniqueId == uniqueId {
			payscale, _ := RepPayCfg.CalculateRPayScale(rep1, state, wc)
			if len(payscale) > 0 {
				defResp = adderRespCfg.CalculateAdderResp(payscale)
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
// func (AutoAdderCfg *AutoAdderCfgStruct) CalculateRepR1PayScale(rep1, uniqueId, state string, wc time.Time) (payscale string) {
// 	log.EnterFn(0, "CalculateRepR1PayScale")
// 	defer func() { log.ExitFn(0, "CalculateRepR1PayScale", nil) }()
// 	for _, data := range AutoAdderCfg.AutoAdderList {
// 		if data.UniqueId == uniqueId {
// 			if len(rep1) > 0 {
// 				payscale, _ = RepPayCfg.CalculateRPayScale(rep1, state, wc)
// 			}
// 		}
// 	}
// 	return payscale
// }
