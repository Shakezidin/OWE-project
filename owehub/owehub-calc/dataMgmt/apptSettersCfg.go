/**************************************************************************
 * File            : ApptSetters.go
 * DESCRIPTION     : This file contains the model and data form ApptSetters config
 * DATE            : 23-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"strconv"
	"time"
)

type ApptSettersCfgStruct struct {
	ApptSettersList models.GetApptSettersList
}

var (
	ApptSettersCfg ApptSettersCfgStruct
)

func (pApptSettersCfg *ApptSettersCfgStruct) LoadApptSettersCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT ap.id as record_id, ap.unique_id, ap.name, tm.team_name, ap.pay_rate, ap.start_date, ap.end_date, ap.is_archived
	FROM appt_setters ap
	JOIN teams tm ON tm.team_id = ap.team_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ap Dealer data from DB err: %v", err)
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// UniqueId
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.FuncErrorTrace(0, "Failed to get Unique_Id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Name
		Name, ok := item["name"].(string)
		if !ok || Name == "" {
			log.FuncErrorTrace(0, "Failed to get name for Record ID %v. Item: %+v\n", RecordId, item)
			Name = ""
		}

		// Team_name
		Team_name, ok := item["team_name"].(string)
		if !ok || Team_name == "" {
			log.FuncErrorTrace(0, "Failed to get team_name for Record ID %v. Item: %+v\n", RecordId, item)
			Team_name = ""
		}

		// PayRate
		PayRate, ok := item["pay_rate"].(string)
		if !ok || PayRate == "" {
			log.FuncErrorTrace(0, "Failed to get pay rate for Record ID %v. Item: %+v\n", RecordId, item)
			PayRate = ""
		}

		// StartDate
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		ApptSettersData := models.GetApptSettersReq{
			RecordId:  RecordId,
			UniqueId:  UniqueId,
			Name:      Name,
			TeamName:  Team_name,
			PayRate:   PayRate,
			StartDate: StartDate,
			EndDate:   EndDate,
		}
		pApptSettersCfg.ApptSettersList.ApptSettersList = append(pApptSettersCfg.ApptSettersList.ApptSettersList, ApptSettersData)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculatePayRate
 * DESCRIPTION:     calculates the pay rate based on the unique Id
 * RETURNS:         payRate
 *****************************************************************************/
func (pApptSettersCfg *ApptSettersCfgStruct) CalculatePayRate(apptSetter string, wc time.Time) (payRate float64) {
	log.EnterFn(0, "CalculatePayRate")
	defer func() { log.ExitFn(0, "CalculatePayRate", nil) }()
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(apptSetter) > 0 {
		for _, data := range pApptSettersCfg.ApptSettersList.ApptSettersList {
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

			if data.Name == apptSetter && startDate.Before(wc) && endDate.After(wc) {
				payRateflt, _ := strconv.Atoi(data.PayRate)
				payRate += float64(payRateflt)
			}
		}
	}
	return payRate
}
