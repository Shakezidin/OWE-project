/**************************************************************************
* File            : cmmsnRates.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type GetCommissionRatesList struct {
	RecordId  int64     `json:"record_id"`
	Partner   string    `json:"partner"`
	Installer string    `json:"installer"`
	State     string    `json:"state"`
	SaleType  string    `json:"sale_type"`
	SalePrice float64   `json:"sale_price"`
	RepType   string    `json:"rep_type"`
	RL        float64   `json:"rl"`
	Rate      float64   `json:"rate"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type cmmsnRatesCfgStruct struct {
	cmmsnRatesList []GetCommissionRatesList
}

var (
	CmmsnRatesCfg cmmsnRatesCfgStruct
)

func (cmmsnRatesCfg *cmmsnRatesCfgStruct) LoadcmmsnRatesCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT cr.id as record_id, pt1.partner_name as partner_name, pt2.partner_name as installer_name, st.name, sl.type_name as sale_type, cr.sale_price, rp.rep_type, cr.rl, cr.rate, cr.start_date, cr.end_date
	FROM commission_rates cr
	LEFT JOIN states st ON st.state_id = cr.state_id
	LEFT JOIN partners pt1 ON pt1.partner_id = cr.partner_id
	LEFT JOIN partners pt2 ON pt2.partner_id = cr.installer_id
	LEFT JOIN sale_type sl ON sl.id = cr.sale_type_id
	LEFT JOIN rep_type rp ON rp.id = cr.rep_type`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		Partner, ok := item["partner_name"].(string)
		if !ok || Partner == "" {
			// log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			Partner = ""
		}

		Installer, ok := item["installer_name"].(string)
		if !ok || Installer == "" {
			// log.FuncErrorTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		State, ok := item["name"].(string)
		if !ok || State == "" {
			// log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		SaleType, ok := item["sale_type"].(string)
		if !ok || SaleType == "" {
			// log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			SaleType = ""
		}

		SalePrice, ok := item["sale_price"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get sale price for Record ID %v. Item: %+v\n", RecordId, item)
			SalePrice = 0.0 // Default sale price of 0.0
		}

		RepType, ok := item["rep_type"].(string)
		if !ok || RepType == "" {
			// log.FuncErrorTrace(0, "Failed to get rep type for Record ID %v. Item: %+v\n", RecordId, item)
			RepType = ""
		}

		RL, ok := item["rl"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rl for Record ID %v. Item: %+v\n", RecordId, item)
			RL = 0.0 // Default RL value of 0.0
		}

		Rate, ok := item["rate"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rate for Record ID %v. Item: %+v\n", RecordId, item)
			Rate = 0.0 // Default rate value of 0.0
		}

		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = time.Time{}
		}

		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		GetcmmsnRatesList := GetCommissionRatesList{
			RecordId:  RecordId,
			Partner:   Partner,
			Installer: Installer,
			State:     State,
			SaleType:  SaleType,
			SalePrice: SalePrice,
			RepType:   RepType,
			RL:        RL,
			Rate:      Rate,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		cmmsnRatesCfg.cmmsnRatesList = append(cmmsnRatesCfg.cmmsnRatesList, GetcmmsnRatesList)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculatecmmsnRates
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (cmmsnRatesCfg *cmmsnRatesCfgStruct) CalculateRepRl(rep1, partner, installer, state, types, payScale string, kwh float64, wc time.Time) (rl, rate float64) {
	if len(rep1) > 0 {
		if installer == "Our World Energy" {
			installer = "OWE"
		}

		if len(state) > 0 {
			state = state[6:]
		}

		for _, data := range cmmsnRatesCfg.cmmsnRatesList {
			if data.Partner == partner {
				log.FuncErrorTrace(0, "data.Dealer: %v ============== dealer %v", data.Partner, partner)
				log.FuncErrorTrace(0, "data.installer: %v ============== installer %v", data.Installer, installer)
				log.FuncErrorTrace(0, "data.state: %v ============== state %v", data.State, state)
				log.FuncErrorTrace(0, "data.saleType: %v ============== type %v", data.SaleType, types)
				log.FuncErrorTrace(0, "data.salePrice: %v ============== kwh %v", data.SalePrice, kwh)
				log.FuncErrorTrace(0, "data.payScale: %v ============== repType %v", data.RepType, payScale)
				log.FuncErrorTrace(0, "data.startDate: %v ============== wc %v", data.StartDate, wc)
				log.FuncErrorTrace(0, "data.endDate: %v ============== wc %v", data.EndDate, wc)
			}
			if partner == data.Partner &&
				installer == data.Installer &&
				state == data.State &&
				types == data.SaleType &&
				payScale == data.RepType &&
				(data.StartDate.Before(wc) || data.StartDate.Equal(wc)) &&
				(data.EndDate.After(wc) || data.EndDate.Equal(wc)) {
				return data.RL, data.Rate
			}
		}
	}
	return rl, rate
}

/******************************************************************************
* FUNCTION:        CalculatecmmsnRates
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (cmmsnRatesCfg *cmmsnRatesCfgStruct) CalculateRep1Rl(commissionModels, dealer, rep1, partner, installer, state, types, payScale string, kwh float64, wc time.Time) (rl, rate float64) {
	log.EnterFn(0, "CalculateRep1Rl")
	defer func() { log.ExitFn(0, "CalculateRep1Rl", nil) }()
	if commissionModels == "standard" {
		if len(rep1) > 0 {
			for _, data := range cmmsnRatesCfg.cmmsnRatesList {
				var st string
				if len(state) > 0 {
					st = state[6:]
				}
				if data.Partner == partner {
					log.FuncErrorTrace(0, "data.Dealer: %v ============== dealer %v", data.Partner, partner)
					log.FuncErrorTrace(0, "data.installer: %v ============== installer %v", data.Installer, installer)
					log.FuncErrorTrace(0, "data.state: %v ============== state %v", data.State, st)
					log.FuncErrorTrace(0, "data.saleType: %v ============== type %v", data.SaleType, types)
					log.FuncErrorTrace(0, "data.salePrice: %v ============== kwh %v", data.SalePrice, kwh)
					log.FuncErrorTrace(0, "data.payScale: %v ============== repType %v", data.RepType, payScale)
					log.FuncErrorTrace(0, "data.startDate: %v ============== wc %v", data.StartDate, wc)
					log.FuncErrorTrace(0, "data.endDate: %v ============== wc %v", data.EndDate, wc)
				}
				if partner == data.Partner &&
					installer == data.Installer &&
					st == data.State &&
					types == data.SaleType &&
					payScale == data.RepType &&
					(data.StartDate.Before(wc) || data.StartDate.Equal(wc)) &&
					(data.EndDate.After(wc) || data.EndDate.Equal(wc)) {
					return data.RL, data.Rate
				}
			}
		}
		return rl, rate
	} else {
		rl = PayScheduleCfg.CalculateRL(dealer, partner, types, state, wc)
		if len(rep1) > 0 {
			for _, data := range cmmsnRatesCfg.cmmsnRatesList {
				if partner == data.Partner &&
					installer == data.Installer &&
					state == data.State &&
					types == data.SaleType &&
					payScale == data.RepType &&
					(data.StartDate.Before(wc) || data.StartDate.Equal(wc)) &&
					(data.EndDate.After(wc) || data.EndDate.Equal(wc)) {
					rate = data.Rate
				}
			}
		}
	}
	return rl, rate
}
