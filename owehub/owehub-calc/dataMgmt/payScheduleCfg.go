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
	models "OWEApp/shared/models"
	"strings"
	"time"
)

type PayScheduleCfgStruct struct {
	PayScheduleList []models.CreatePaymentSchedule
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

	query = `SELECT ps.id as record_id, vd.dealer_code as dealer, pt1.partner_name AS partner_name, pt2.partner_name AS installer_name,
    st.name AS state, sl.type_name AS sale_type, ps.rl, ps.draw, ps.draw_max, ps.rep_draw, ps.rep_draw_max, ps.rep_pay, ps.start_date, ps.end_date, commission_model
    FROM payment_schedule ps
    JOIN states st ON st.state_id = ps.state_id
    JOIN partners pt1 ON pt1.partner_id = ps.partner_id
    JOIN partners pt2 ON pt2.partner_id = ps.installer_id
    JOIN sale_type sl ON sl.id = ps.sale_type_id
    JOIN v_dealer vd ON vd.id = ps.dealer_id`

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

		// Dealer
		Dealer, ok := item["dealer"].(string)
		if !ok || Dealer == "" {
			log.FuncErrorTrace(0, "Failed to get partner for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
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

		// CommissionModel
		CommissionModel, ok := item["commission_model"].(string)
		if !ok || CommissionModel == "" {
			// log.FuncErrorTrace(0, "Failed to get CommissionModel for Record ID %v. Item: %+v\n", RecordId, item)
			CommissionModel = ""
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

		// CommissionModels
		CommissionModels, ok := item["commission_models"].(string)
		if !ok || CommissionModels == "" {
			// log.FuncErrorTrace(0, "Failed to get commission models for Record ID %v. Item: %+v\n", RecordId, item)
			CommissionModels = ""
		}

		paySchData := models.CreatePaymentSchedule{
			Dealer:        Dealer,
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
* DESCRIPTION:     calculates the rl value based on the provided data
* RETURNS:         rl
*****************************************************************************/
func (PayScheduleCfg *PayScheduleCfgStruct) CalculateRL(dealer, partner, installer, state string, wc time.Time) float64 {

	log.EnterFn(0, "CalculateRL")
	defer func() { log.ExitFn(0, "CalculateRL", nil) }()

	if len(dealer) > 0 {
		for _, data := range PayScheduleCfg.PayScheduleList {
			dateLayout := "01-02-06"
			startDate, errStart := time.Parse(dateLayout, data.StartDate)
			endDate, errEnd := time.Parse(dateLayout, data.EndDate)

			// Log any parsing errors
			if errStart != nil {
				log.FuncErrorTrace(0, "Error parsing start date:", errStart)
				continue
			}
			if errEnd != nil {
				log.FuncErrorTrace(0, "Error parsing end date:", errEnd)
				continue
			}

			if installer == "OWE" {
				installer = "One World Energy"
			}

			var st string
			if len(state) > 0 {
				st = state[6:]
			}

			if data.Dealer == dealer && data.PartnerName == partner && data.InstallerName == installer && data.State == st &&
				startDate.Before(wc) && endDate.After(wc) {
				return data.Rl
			}
		}
	}
	return 0
}

/******************************************************************************
* FUNCTION:        CalculateDlrDrawPerc
* DESCRIPTION:     calculates the addr value based on the provided data
* RETURNS:         drawPerc,dlrDrawMax,commission_models
*****************************************************************************/
func (PayScheduleCfg *PayScheduleCfgStruct) CalculateDlrDrawPerc(dealer, partner, installer, Type, state string, wc time.Time) (drawPerc, dlrDrawMax float64, commission_models string) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)

	log.EnterFn(0, "CalculateDlrDrawPerc")
	defer func() { log.ExitFn(0, "CalculateDlrDrawPerc", nil) }()

	if len(dealer) > 0 {
		for _, data := range PayScheduleCfg.PayScheduleList {
			if len(data.StartDate) > 0 {
				startDate, err = time.Parse("01-02-06", data.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
				continue
			}

			if len(data.EndDate) > 0 {
				endDate, err = time.Parse("01-02-06", data.EndDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.EndDate:%+v to time.Time err: %+v", data.EndDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty EndDate Received in data.EndDate config")
				continue
			}

			var st string
			if len(state) > 0 {
				st = state[6:]
			}

			if data.Dealer == dealer &&
				strings.EqualFold(data.PartnerName, partner) &&
				strings.EqualFold(data.InstallerName, installer) &&
				// data.SaleType == Type &&
				data.State == st &&
				!startDate.After(wc) &&
				!endDate.Before(wc) {

				drawPerc = data.Draw / 100
				dlrDrawMax = data.DrawMax
				commission_models = data.CommissionModel
			}
		}
	}
	return drawPerc, dlrDrawMax, commission_models
}

/******************************************************************************
* FUNCTION:        CalculateRepDrawPerc
* DESCRIPTION:     calculates the addr value based on the provided data
* RETURNS:         drawPerc,dlrDrawMax,commission_models
*****************************************************************************/
func (PayScheduleCfg *PayScheduleCfgStruct) CalculateRepDrawPerc(uniqueId, dealer, partner, installer, types, state string, wc time.Time) (RepDrawPercentage, repDrawMax float64, repPay string) {
	log.EnterFn(0, "CalculateRepDrawPerc")
	defer func() { log.ExitFn(0, "CalculateRepDrawPerc", nil) }()
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)

	if len(uniqueId) > 0 {
		for _, data := range PayScheduleCfg.PayScheduleList {
			if len(data.StartDate) > 0 {
				startDate, err = time.Parse("01-02-06", data.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
				continue
			}

			if len(data.EndDate) > 0 {
				endDate, err = time.Parse("01-02-06", data.EndDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.EndDate:%+v to time.Time err: %+v", data.EndDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty EndDate Received in data.EndDate config")
				continue
			}
			var st string
			if len(state) > 0 {
				st = state[6:]
			}
			if data.Dealer == dealer {
				log.FuncErrorTrace(0, "data.Dealer: %v ============== dealer %v", data.Dealer, dealer)
				log.FuncErrorTrace(0, "data.partner: %v ============== partner %v", data.PartnerName, partner)
				log.FuncErrorTrace(0, "data.installer: %v ============== installer %v", data.InstallerName, installer)
				log.FuncErrorTrace(0, "data.saleType: %v ============== type %v", data.SaleType, types)
				log.FuncErrorTrace(0, "data.state: %v ============== state %v", data.State, st)
				log.FuncErrorTrace(0, "data.startDate: %v ============== wc %v", data.StartDate, wc)
				log.FuncErrorTrace(0, "data.endDate: %v ============== wc %v", data.EndDate, wc)
			}
			if data.Dealer == dealer && data.PartnerName == partner && data.InstallerName == installer &&
				// data.SaleType == types &&
				data.State == st &&
				!startDate.After(wc) &&
				!endDate.Before(wc) {
				RepDrawPercentage = data.RepDraw
				repDrawMax = data.RepDrawMax
				repPay = data.RepPay
			}
		}
	}
	return RepDrawPercentage, repDrawMax, repPay
}
