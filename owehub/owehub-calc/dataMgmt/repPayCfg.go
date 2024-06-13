/**************************************************************************
* File            : dealerCredit.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type RepPaySettingsCfgStruct struct {
	RepPayList models.GetRepPaySettingsList
}

var (
	RepPayCfg RepPaySettingsCfgStruct
)

func (RepPayCfg *RepPaySettingsCfgStruct) LoadRepPayCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadRepPayCfg")
	defer func() { log.ExitFn(0, "LoadRepPayCfg", err) }()

	query = ` SELECT rs.id AS record_id, rs.unique_id, rs.name, st.name AS state_name, rs.pay_scale, rs.position,
	rs.b_e, rs.start_date, rs.end_date
	FROM rep_pay_settings rs
	JOIN states st ON st.state_id = rs.state_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {
		RecordId, Ok := item["record_id"].(int64)
		if !Ok {
			RecordId = 0.0
		}
		Unique_id, Ok := item["unique_id"].(string)
		if !Ok || Unique_id == "" {
			Unique_id = ""
		}

		Name, nameOk := item["name"].(string)
		if !nameOk || Name == "" {
			Name = ""
		}

		State_name, state_nameOk := item["state_name"].(string)
		if !state_nameOk || State_name == "" {
			State_name = ""
		}

		Pay_scale, pay_scaleOk := item["pay_scale"].(string)
		if !pay_scaleOk || Pay_scale == "" {
			Pay_scale = ""
		}

		Position, positionOk := item["position"].(string)
		if !positionOk || Position == "" {
			Position = ""
		}

		B_e, b_eOk := item["b_e"].(string)
		if !b_eOk || B_e == "" {
			B_e = ""
		}

		Start_date, start_dateOk := item["start_date"].(string)
		if !start_dateOk || Start_date == "" {
			Start_date = ""
		}

		End_date, end_dateOk := item["end_date"].(string)
		if !end_dateOk || End_date == "" {
			End_date = ""
		}

		// Create a new GetSaleTypeData object
		RepPaySettingsData := models.GetRepPaySettingsData{
			RecordId:  RecordId,
			UniqueID:  Unique_id,
			Name:      Name,
			State:     State_name,
			PayScale:  Pay_scale,
			Position:  Position,
			B_E:       B_e,
			StartDate: Start_date,
			EndDate:   End_date,
		}

		RepPayCfg.RepPayList.RepPaySettingsList = append(RepPayCfg.RepPayList.RepPaySettingsList, RepPaySettingsData)
	}

	return err
}

func (RepPayCfg *RepPaySettingsCfgStruct) CalculateR1PayScale(Rep1, state string, date time.Time) (payScale, position string) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(Rep1) > 0 {
		for _, data := range RepPayCfg.RepPayList.RepPaySettingsList {
			if len(data.StartDate) > 0 {
				startDate, err = time.Parse("01-02-2006", data.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
				continue
			}

			if len(data.EndDate) > 0 {
				endDate, err = time.Parse("01-02-2006", data.EndDate)
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
			if data.Name == Rep1 && data.State == st && startDate.Before(date) && endDate.After(date) {
				return data.PayScale, data.Position
			}
		}
	}
	return payScale, position
}
