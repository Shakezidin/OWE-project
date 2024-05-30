/**************************************************************************
* File            : dealerOverrideCfg.go
* DESCRIPTION     : This file contains the model and data form dealer override
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type DealerOverrideStruct struct {
	DealerOverrideList models.GetDealersList
}

var (
	DealerOverrideConfig DealerOverrideStruct
)

func (pDealer *DealerOverrideStruct) LoadRDealerOverrideCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadRDealerOverrideCfg")
	defer func() { log.ExitFn(0, "LoadRDealerOverrideCfg", err) }()

	query = `
  SELECT dor.id as record_id, dor.sub_dealer, vd.dealer_name, dor.pay_rate, dor.start_date, dor.end_date, st.name AS state_name  
  FROM dealer_override dor
  JOIN v_dealer vd ON vd.id = dor.dealer_id
  JOIN states st ON st.state_id = dor.state`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// SubDealer
		SubDealer, ok := item["sub_dealer"].(string)
		if !ok || SubDealer == "" {
			// log.FuncErrorTrace(0, "Failed to get sub dealer for Record ID %v. Item: %+v\n", RecordId, item)
			SubDealer = ""
		}

		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			// log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		// Dealer
		Dealer, ok := item["dealer_name"].(string)
		if !ok || Dealer == "" {
			// log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
		}

		// PayRate
		PayRate, ok := item["pay_rate"].(string)
		if !ok || PayRate == "" {
			// log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		start := StartDate.Format("2006-01-02")
		end := EndDate.Format("2006-01-02")

		dealerData := models.GetDealerData{
			RecordId:  RecordId,
			SubDealer: SubDealer,
			Dealer:    Dealer,
			State:     StateName,
			PayRate:   PayRate,
			StartDate: start,
			EndDate:   end,
		}
		pDealer.DealerOverrideList.DealersList = append(pDealer.DealerOverrideList.DealersList, dealerData)
	}
	return err
}

func (pDealer *DealerOverrideStruct) CalculateParentDealer(dealer string, wc string) (respdealer string) {
	log.EnterFn(0, "LoadDlrCreditCfg")
	defer func() { log.ExitFn(0, "LoadDlrCreditCfg", nil) }()

	respdealer = ""
	if len(dealer) > 0 {
		for _, data := range pDealer.DealerOverrideList.DealersList {
			if data.Dealer == dealer {
				if data.StartDate <= wc && data.EndDate >= wc {
					respdealer = data.Dealer
				}
			}
		}
	}
	return respdealer
}
