/**************************************************************************
* File            : AdderCreditCfg.go
* DESCRIPTION     : This file contains the model and data form AdderCredit
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
)

type AdderCreditCfgStruct struct {
	AdderCreditCfg models.GetAdderCreditList
}

var (
	AdderCreditCfg AdderCreditCfgStruct
)

func (pAdderCredit *AdderCreditCfgStruct) LoadAdderCreditCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT ac.id as record_id, ac.unique_id, ac.pay_scale, ac.type, ac.min_rate, ac.max_rate
	FROM adder_credit ac`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// Unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// Pay_scale
		Pay_scale, ok := item["pay_scale"].(string)
		if !ok || Pay_scale == "" {
			log.FuncErrorTrace(0, "Failed to get pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			Pay_scale = ""
		}

		// Type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// Min_Rate
		Min_Rate, ok := item["min_rate"].(float64)
		if !ok || Min_Rate == 0.0 {
			log.FuncErrorTrace(0, "Failed to get min rate for Record ID %v. Item: %+v\n", RecordId, item)
			Min_Rate = 0.0
		}

		// Max_rare
		Max_rate, ok := item["max_rate"].(float64)
		if !ok || Max_rate == 0.0 {
			log.FuncErrorTrace(0, "Failed to get max rate for Record ID %v. Item: %+v\n", RecordId, item)
			Max_rate = 0.0
		}

		AdderCreditData := models.GetAdderCreditReq{
			RecordId:  RecordId,
			UniqueId:  Unique_id,
			Pay_Scale: Pay_scale,
			Type:      Type,
			Min_Rate:  Min_Rate,
			Max_Rate:  Max_rate,
		}
		pAdderCredit.AdderCreditCfg.AdderCreditList = append(pAdderCredit.AdderCreditCfg.AdderCreditList, AdderCreditData)
	}

	return err
}

func (pAdderCredit *AdderCreditCfgStruct) CalculateR1RebateCreditPercentage(R1PayScale, Type string) (R1RebateCreditPercentage float64) {
	log.EnterFn(0, "CalculateR1RebateCreditPercentage")
	defer func() { log.ExitFn(0, "CalculateR1RebateCreditPercentage", nil) }()
	if len(R1PayScale) > 0 {
		for _, data := range pAdderCredit.AdderCreditCfg.AdderCreditList {
			if R1PayScale+Type == data.Pay_Scale+data.Type {
				return data.Max_Rate
			}
		}
	}
	return R1RebateCreditPercentage
}

