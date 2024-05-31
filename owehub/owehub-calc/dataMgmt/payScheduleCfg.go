/**************************************************************************
* File            : payScheduleCfg.go
* DESCRIPTION     : This file contains the model and data form dealer
                    credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

type GetPaymentScheduleDataTemp struct {
	RecordId      int64   `json:"record_id"`
	Partner       string  `json:"partner"`
	PartnerName   string  `json:"partner_name"`
	InstallerName string  `json:"installer_name"`
	SaleType      string  `json:"sale_type"`
	State         string  `json:"state"`
	Rl            float64 `json:"rl"`
	Draw          float64 `json:"draw"`
	DrawMax       float64 `json:"draw_max"`
	RepDraw       float64 `json:"rep_draw"`
	RepDrawMax    float64 `json:"rep_draw_max"`
	RepPay        string  `json:"rep_pay"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
}

type PayScheduleCfgStruct struct {
	PayScheduleList []GetPaymentScheduleDataTemp
}

var (
	PayScheduleCfg PayScheduleCfgStruct
)

func (paymentScheduleCfg *PayScheduleCfgStruct) LoadPayScheduleCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadPayScheduleCfg")
	defer func() { log.ExitFn(0, "LoadPayScheduleCfg", err) }()

	query = `SELECT ps.id as record_id, ud.name as partner, pt1.partner_name AS partner_name, pt2.partner_name AS installer_name,
    st.name AS state, sl.type_name AS sale_type, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay, ps.start_date, ps.end_date
    FROM payment_schedule ps
    JOIN states st ON st.state_id = ps.state_id
    JOIN partners pt1 ON pt1.partner_id = ps.partner_id
    JOIN partners pt2 ON pt2.partner_id = ps.installer_id
    JOIN sale_type sl ON sl.id = ps.sale_type_id
    JOIN user_details ud ON ud.user_id = ps.rep_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get payment schedule data from DB err: %v", err)
		return
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Partner
		Partner, ok := item["partner"].(string)
		if !ok || Partner == "" {
			// log.FuncErrorTrace(0, "Failed to get partner for Record ID %v. Item: %+v\n", RecordId, item)
			Partner = ""
		}

		// PartnerName
		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			// log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		// Installer
		Installer, ok := item["installer_name"].(string)
		if !ok || Installer == "" {
			// log.FuncErrorTrace(0, "Failed to get installer for Record ID %v. Item: %+v\n", RecordId, item)
			Installer = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok || State == "" {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// Sale
		Sale, ok := item["sale_type"].(string)
		if !ok || Sale == "" {
			// log.FuncErrorTrace(0, "Failed to get sale for Record ID %v. Item: %+v\n", RecordId, item)
			Sale = ""
		}

		// Rl
		Rl, ok := item["rl"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get Rl for Record ID %v. Item: %+v\n", RecordId, item)
			Rl = 0
		}

		// Draw
		Draw, ok := item["draw"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get draw for Record ID %v. Item: %+v\n", RecordId, item)
			Draw = 0
		}

		// DrawMax
		DrawMax, ok := item["draw_max"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get draw max for Record ID %v. Item: %+v\n", RecordId, item)
			DrawMax = 0
		}

		// RepDraw
		RepDraw, ok := item["rep_draw"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep draw for Record ID %v. Item: %+v\n", RecordId, item)
			RepDraw = 0
		}

		// RepDrawMax
		RepDrawMax, ok := item["rep_draw_max"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_draw_max for Record ID %v. Item: %+v\n", RecordId, item)
			RepDrawMax = 0
		}

		// RepPay
		RepPay, ok := item["rep_pay"].(string)
		if !ok || RepPay == "" {
			// log.FuncErrorTrace(0, "Failed to get rep pay for Record ID %v. Item: %+v\n", RecordId, item)
			RepPay = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		paySchData := GetPaymentScheduleDataTemp{
			RecordId:      RecordId,
			Partner:       Partner,
			PartnerName:   PartnerName,
			InstallerName: Installer,
			State:         State,
			SaleType:      Sale,
			Rl:            Rl,
			Draw:          Draw,
			DrawMax:       DrawMax,
			RepDraw:       RepDraw,
			RepDrawMax:    RepDrawMax,
			RepPay:        RepPay,
			StartDate:     StartDate,
			EndDate:       EndDate,
		}

		PayScheduleCfg.PayScheduleList = append(PayScheduleCfg.PayScheduleList, paySchData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateRL
* DESCRIPTION:     calculates the addr value based on the provided data
* RETURNS:         addr value
*****************************************************************************/

func (PayScheduleCfg *PayScheduleCfgStruct) CalculateRL(dealer, partner, installer, types, state, wc string) float64 {

	log.EnterFn(0, "CalculateRL")
	defer func() { log.ExitFn(0, "CalculateRL", nil) }()

	if len(dealer) > 0 {
		for _, data := range PayScheduleCfg.PayScheduleList {
			if data.Partner == dealer && data.PartnerName == partner && data.InstallerName == installer && data.SaleType == types && data.State == state &&
				data.StartDate <= wc && data.EndDate >= wc {
				return float64(data.Rl)
			}
		}
	}

	return 0
}

/******************************************************************************
* FUNCTION:        CalculateDlrDrawPerc
* DESCRIPTION:     calculates the addr value based on the provided data
* RETURNS:         drawPerc
*****************************************************************************/

func (PayScheduleCfg *PayScheduleCfgStruct) CalculateDlrDrawPerc(dealer, partner, installer, loanType, state, startDate, endDate, wc string) (drawPerc, dlrDrawMax float64) {

	log.EnterFn(0, "CalculateDlrDrawPerc")
	defer func() { log.ExitFn(0, "CalculateDlrDrawPerc", nil) }()

	if len(dealer) > 0 {
		for _, data := range PayScheduleCfg.PayScheduleList {
			if data.Partner == dealer && data.PartnerName == partner && data.InstallerName == installer && data.SaleType == loanType && data.State == state && data.StartDate <= wc && data.EndDate >= wc {
				drawPerc = data.Draw
				dlrDrawMax = data.DrawMax
			}
		}
	}
	return drawPerc, dlrDrawMax
}
