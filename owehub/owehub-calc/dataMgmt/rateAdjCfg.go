/**************************************************************************
* File            : RateAdjustmentsCfg.go
* DESCRIPTION     : This file contains the model and data form dealer
                    credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"strconv"
)

type RateAdjustmentsCfgStruct struct {
	RateAdjustmentsList []models.GetRateAdjustments
}

var (
	RateAdjustmentsCfg RateAdjustmentsCfgStruct
)

func (RateAdjustmentsCfg *RateAdjustmentsCfgStruct) LoadRateAdjustmentsCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadRateAdjustmentsCfg")
	defer func() { log.ExitFn(0, "LoadRateAdjustmentsCfg", err) }()

	query = `SELECT ra.id as record_id, ra.unique_id, ra.pay_scale, ra.position, ra.adjustment, ra.min_rate, ra.max_rate
	FROM rate_adjustments ra`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get payment schedule data from DB err: %v", err)
		return
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		PayScale, ok := item["pay_scale"].(string)
		if !ok || PayScale == "" {
			log.FuncErrorTrace(0, "Failed to get pay scale for Record ID %v. Item: %+v\n", RecordId, item)
			PayScale = ""
		}

		Position, ok := item["position"].(string)
		if !ok || Position == "" {
			log.FuncErrorTrace(0, "Failed to get position for Record ID %v. Item: %+v\n", RecordId, item)
			Position = ""
		}

		Adjustment, ok := item["adjustment"].(string)
		if !ok || Adjustment == "" {
			log.FuncErrorTrace(0, "Failed to get adjustment for Record ID %v. Item: %+v\n", RecordId, item)
			Adjustment = ""
		}

		MinRate, ok := item["min_rate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get min rate for Record ID %v. Item: %+v\n", RecordId, item)
			MinRate = 0.0
		}

		MaxRate, ok := item["max_rate"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get max rate for Record ID %v. Item: %+v\n", RecordId, item)
			MaxRate = 0.0
		}

		rateAdjustmentData := models.GetRateAdjustments{
			RecordId:   RecordId,
			UniqueId:   UniqueId,
			PayScale:   PayScale,
			Position:   Position,
			Adjustment: Adjustment,
			MinRate:    MinRate,
			MaxRate:    MaxRate,
		}
		RateAdjustmentsCfg.RateAdjustmentsList = append(RateAdjustmentsCfg.RateAdjustmentsList, rateAdjustmentData)
	}
	return err
}

func (RateAdjustmentsCfg *RateAdjustmentsCfgStruct) CalculateAdjustmentMinRateMaxRate(payScale, Position string) (adjustment, minRate, MaxRate float64) {
	for _, data := range RateAdjustmentsCfg.RateAdjustmentsList {
		if data.PayScale+data.Position == payScale+Position {
			adjustmentNum, _ := strconv.Atoi(data.Adjustment)
			adjustment += float64(adjustmentNum)
			minRate += data.MinRate
			MaxRate += data.MaxRate
		}
	}
	return adjustment, minRate, MaxRate
}
