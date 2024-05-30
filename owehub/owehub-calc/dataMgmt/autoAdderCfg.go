/**************************************************************************
* File            : autoAdderCfg.go
* DESCRIPTION     : This file contains the model and data form autoAdder
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"strings"
	"time"
)

type AutoAdder struct {
	RecordId               int64
	UniqueId               string
	Date                   string
	Type1                  string
	Gc                     string
	ExactAmt               float64
	PerKwAmt               float64
	RepPercentage          float64
	SysSize                float64
	DescriptionRepvisibale string
	NotesNoRepvisibale     string
	AdderType              string
}

type AutoAdderCfgStruct struct {
	AutoAdderList []AutoAdder
}

var (
	AutoAdderCfg AutoAdderCfgStruct
)

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
		err                   error
		data                  []map[string]interface{}
		whereEleList          []interface{}
		query                 string
		DescriptionRepVisible string
		ExactAmount           float64
		AdderType             string
		PerKWAmount           float64
	)
	log.EnterFn(0, "LoadAutoAdderCfg")
	defer func() { log.ExitFn(0, "LoadAutoAdderCfg", err) }()

	query = `
			SELECT 
			ad.unique_id, 
			ad.wc_1 AS date, 
			ad.installer AS gc, 
			ad.system_size as sys_size,
			ad.net_epc as rep_percentage,
			ad.primary_sales_rep as notes_no_repvisible,
			(SELECT 
				CASE 
					WHEN system_size <= 3 THEN 
						CASE 
							WHEN state ILIKE 'CA' THEN 'SM-CA2' 
							ELSE 'SM-UNI2' 
						END
					WHEN system_size > 3 AND system_size <= 4 THEN
						CASE
							WHEN state NOT ILIKE 'CA' THEN 'SM-UNI3' 
							ELSE NULL
						END
					ELSE NULL 
				END 
			FROM consolidated_data_view cdv 
			WHERE cdv.unique_id = ad.unique_id) AS type
		FROM consolidated_data_view ad`

	// for _, filtr := range dataReq.Filters {
	// 	if filtr.Column == "per_kw_amount" {
	// 		filter, whereEleList = PrepareAutoAdderFilters(tableName, dataReq, false)
	// 		if filter != "" {
	// 			queryWithFiler = query + filter
	// 		}
	// 	}
	// }

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
		return
	}

	autoAdderList := AutoAdderCfg.AutoAdderList
	for _, item := range data {
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
			Unique_id = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", Unique_id, item)
			Date = time.Time{}
		}

		Gc, ok := item["gc"].(string)
		if !ok || Gc == "" {
			// log.FuncErrorTrace(0, "Failed to get gc for Record ID %v. Item: %+v\n", Unique_id, item)
			Gc = ""
		}

		RepPercentage, ok := item["rep_percentage"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", Unique_id, item)
			RepPercentage = 0.0
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get system size for Record ID %v. Item: %+v\n", Unique_id, item)
			RepPercentage = 0.0
		}

		// notes_not_rep_visible
		NotesNoRepVisible, ok := item["notes_no_repvisible"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get notes_no_repvisible for Record ID %v. Item: %+v\n", Unique_id, item)
			NotesNoRepVisible = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", Unique_id, item)
			Type = ""
		}

		if strings.HasPrefix(Type, "MK") {
			ExactAmount = 0.0
		} else {
			switch Type {
			case "SM-UNI2":
				ExactAmount = 1200
			case "SM-UNI3":
				ExactAmount = 600
			case "SM-CA2":
				ExactAmount = 600
			}
		}

		if strings.HasPrefix(Type, "MK") {
			qry := `select fee_rate from marketing fee where state ilike 'MK'`
			data3, err := db.ReteriveFromDB(db.OweHubDbIndex, qry, whereEleList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to get auto adder data from DB err: %v", err)
				return
			}
			PerKWAmount, ok = data3[0]["fee_rate"].(float64)
			if !ok || Unique_id == "" {
				log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", Unique_id, item)
				Unique_id = ""
			}
		} else {
			switch Type {
			case "SM-UNI2":
				PerKWAmount = 0.0
			case "SM-UNI3":
				PerKWAmount = 0.0
			case "SM-CA2":
				PerKWAmount = 0.0
			}
		}

		if strings.HasPrefix(Type, "MK") {
			DescriptionRepVisible = fmt.Sprintf("Marketing Fee %s", Type[11:18])
		} else {
			switch Type {
			case "SM-UNI2":
				DescriptionRepVisible = "Small System Size"
			case "SM-UNI3":
				DescriptionRepVisible = "Small System Size"
			case "SM-CA2":
				DescriptionRepVisible = "Small System Size"
			}
		}

		AdderType = "Adder"

		DateStr := Date.Format("2006-01-02")

		AutoAdderData := AutoAdder{
			UniqueId:               Unique_id,
			Date:                   DateStr,
			Type1:                  Type,
			Gc:                     Gc,
			ExactAmt:               ExactAmount,
			PerKwAmt:               PerKWAmount,
			RepPercentage:          RepPercentage,
			DescriptionRepvisibale: DescriptionRepVisible,
			NotesNoRepvisibale:     NotesNoRepVisible,
			AdderType:              AdderType,
			SysSize:                SysSize,
		}

		autoAdderList = append(autoAdderList, AutoAdderData)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateAutoAddr
* DESCRIPTION:     calculates the "autoaddr" value based on the provided data
* RETURNS:         autoAdder
*****************************************************************************/
func (AutoAdderCfg *AutoAdderCfgStruct) CalculateAutoAddr(dealer string, uniqueId string, chargeDlr string) (autoAdder float64) {
	log.EnterFn(0, "CalculateAutoAddr")
	defer func() { log.ExitFn(0, "CalculateAutoAddr", nil) }()

	if len(dealer) > 0 {
		if chargeDlr == "true" {
			for _, data := range AutoAdderCfg.AutoAdderList {
				if data.UniqueId == uniqueId {
					addramount := AutoAdderCfg.CalculateExactAmount(data.UniqueId)
					if addramount > 0 {
						autoAdder = addramount
					} else if data.PerKwAmt > 0 {
						autoAdder = data.PerKwAmt * data.SysSize
					}
				}
			}
		} else {
			autoAdder = 0
		}
	}
	return autoAdder
}

func (AutoAdderCfg *AutoAdderCfgStruct) CalculateExactAmount(uniqueId string) (ExactAmount float64) {
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
