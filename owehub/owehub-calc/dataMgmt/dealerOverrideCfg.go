/**************************************************************************
* File            : dealerOverrideCfg.go
* DESCRIPTION     : This file contains the model and data form dealer override
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	common "OWEApp/owehub-calc/common"
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type GetDealerDataTemp struct {
	RecordId   int64   `json:"record_id"`
	SubDealer  string  `json:"sub_dealer"`
	Dealer     string  `json:"dealer"`
	State      string  `json:"state"`
	PayRate    float64 `json:"pay_rate"`
	PayRateStr string
	StartDate  time.Time `json:"start_date"`
	EndDate    time.Time `json:"end_date"`
}

type DealerOverrideStruct struct {
	DealerOverrideList []GetDealerDataTemp
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
  SELECT dor.id as record_id, dor.sub_dealer, vd.dealer_name, dor.pay_rate, dor.start_date, dor.end_date, st.name AS state_name, vd.dealer_code as dealer_name  
  FROM dealer_override dor
  LEFT JOIN v_dealer vd ON vd.id = dor.dealer_id
  LEFT JOIN states st ON st.state_id = dor.state`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	pDealer.DealerOverrideList = pDealer.DealerOverrideList[:0]
	for _, item := range data {

		// RecordId, ok := item["record_id"].(int64)
		// if !ok {
		// 	// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
		// 	continue
		// }

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
		PayRate, ok := item["pay_rate"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = 0
		}

		PayRateStr, ok := item["pay_rate"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = 0
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

		dealerData := GetDealerDataTemp{
			// RecordId:   RecordId,
			SubDealer:  SubDealer,
			Dealer:     Dealer,
			State:      StateName,
			PayRate:    PayRate,
			StartDate:  StartDate,
			EndDate:    EndDate,
			PayRateStr: PayRateStr,
		}
		pDealer.DealerOverrideList = append(pDealer.DealerOverrideList, dealerData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateParentDealerAndPayRate
* DESCRIPTION:     calculates the parent dealer and payrate value based on the provided data
* RETURNS:         respdealer string, payRate float64
*****************************************************************************/
func (pDealer *DealerOverrideStruct) CalculateParentDealerAndPayRate(dealer string, wc time.Time) (respdealer string, payRate float64) {
	log.EnterFn(0, "CalculateParentDealerAndPayRate")
	defer func() { log.ExitFn(0, "CalculateParentDealerAndPayRate", nil) }()

	respdealer = ""
	payRate = 0.0
	if len(dealer) > 0 {
		for _, data := range pDealer.DealerOverrideList {
			if data.SubDealer == dealer {
				if (data.StartDate.Before(wc) || data.StartDate.Equal(wc)) &&
					(data.EndDate.After(wc) || data.EndDate.Equal(wc)) {
					respdealer = data.Dealer
					payRate = *common.StrToFloat(data.PayRateStr)
					break
				}
			}
		}
	}
	return respdealer, payRate
}
