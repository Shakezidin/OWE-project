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

	/* 	Autoadder is reterived from sale data,
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

func (AutoAdderCfg *AutoAdderCfgStruct) LoadAutoAdderCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadAutoAdderCfg")
	defer func() { log.ExitFn(0, "LoadAutoAdderCfg", err) }()

	query = `
	 SELECT oa.id as record_id, oa.unique_id as uniqueId, oa.date, oa.type,
	oa.gc, oa.exact_amt, oa.Per_KW_Amt, oa.rep_percentage, oa.Description_Repvisibale, oa.Notes_No_Repvisibale,
	oa.Adder_Type
	 FROM ` + db.TableName_auto_adder + ` oa`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		log.FuncErrorTrace(0, "Failed to get reconcile from DB err: %v", err)
		err = fmt.Errorf("Failed to get AutoAdder cfg data from DB")
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
			log.ConfWarnTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		date, ok := item["date"].(string)
		if !ok || date == "" {
			log.ConfWarnTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			date = ""
		}

		type1, ok := item["type"].(string)
		if !ok || type1 == "" {
			log.ConfWarnTrace(0, "Failed to get type name for Record ID %v. Item: %+v\n", RecordId, item)
			type1 = ""
		}

		gc, ok := item["gc"].(string)
		if !ok || gc == "" {
			log.ConfWarnTrace(0, "Failed to get gc name for Record ID %v. Item: %+v\n", RecordId, item)
			gc = ""
		}

		exactAmt, ok := item["exact_amt"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get exact_amt for Record ID %v. Item: %+v\n", RecordId, item)
			exactAmt = 0.0 // Default sys size value of 0.0
		} else {
			log.ConfDebugTrace(0, "Exact amount fetched %v", exactAmt)
		}

		perKwAmt, ok := item["Per_KW_Amt"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get Per_KW_Amt for Record ID %v. Item: %+v\n", RecordId, item)
			perKwAmt = 0.0
		} else {
			log.ConfDebugTrace(0, "per kw  amount fetched %v", perKwAmt)
		}

		repPercentage, ok := item["rep_percentage"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get rep_percentage for Unique ID %v. Item: %+v\n", UniqueId, item)
			repPercentage = 0.0
		} else {
			log.ConfDebugTrace(0, "rep_percentage fetched %v", repPercentage)
		}

		descRepvisibale, ok := item["Description_Repvisibale"].(string)
		if !ok && descRepvisibale == "" {
			log.ConfWarnTrace(0, "Failed to get Description_Repvisibale for Record ID %v. Item: %+v\n", RecordId, item)
			descRepvisibale = ""
		}

		NotesRepvisibale, ok := item["Notes_No_Repvisibale"].(string)
		if !ok || NotesRepvisibale == "" {
			log.ConfWarnTrace(0, "Failed to get NotesRepvisibale for Record ID %v. Item: %+v\n", RecordId, item)
			NotesRepvisibale = ""
		}
		AdderType, ok := item["Adder_Type"].(string)
		if !ok || AdderType == "" {
			log.ConfWarnTrace(0, "Failed to get AdderType for Record ID %v. Item: %+v\n", RecordId, item)
			AdderType = ""
		}

		autoAdderData := AutoAdder{
			RecordId:               RecordId,
			UniqueId:               UniqueId,
			Date:                   date,
			Type1:                  type1,
			Gc:                     gc,
			ExactAmt:               exactAmt,
			PerKwAmt:               perKwAmt,
			RepPercentage:          repPercentage,
			DescriptionRepvisibale: descRepvisibale,
			NotesNoRepvisibale:     NotesRepvisibale,
			AdderType:              AdderType,
		}
		AutoAdderCfg.AutoAdderList = append(AutoAdderCfg.AutoAdderList, autoAdderData)
	}

	return err
}
