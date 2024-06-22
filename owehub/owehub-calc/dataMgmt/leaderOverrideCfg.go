/**************************************************************************
* File            : LeaderOverrideCfg.go
* DESCRIPTION     : This file contains the model and data form LeaderOverride
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"strconv"
	"time"
)

type LeaderOverrideCfgStruct struct {
	LeaderOverrideList models.GetLeaderOverrideList
}

var (
	LeaderOverrideCfg LeaderOverrideCfgStruct
)

func (pLeaderOverride *LeaderOverrideCfgStruct) LoadLeaderOverrideCfg() (err error) {
	var (
		data []map[string]interface{}
		// whereEleList []interface{}
		query string
	)

	query = `
	SELECT lo.id as record_id, lo.unique_id, lo.leader_name, lo.type, lo.term, lo.qual, lo.sales_q, lo.team_kw_q, lo.pay_rate, lo.start_date, lo.end_date, ts.team_name
	FROM leader_override lo
	JOIN teams ts ON ts.team_id = lo.team_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	// Assuming you have data as a slice of maps, as in your previous code
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		UniqueID, idOk := item["unique_id"].(string)
		if !idOk || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique ID for Unique ID %v. Item: %+v\n", UniqueID, item)
			UniqueID = ""
		}
		// TeamName
		TeamName, teamOk := item["team_name"].(string)
		if !teamOk || TeamName == "" {
			log.FuncErrorTrace(0, "Failed to get team name for Unique ID %v. Item: %+v\n", UniqueID, item)
			TeamName = ""
		}

		// LeaderName
		LeaderName, leaderOk := item["leader_name"].(string)
		if !leaderOk || LeaderName == "" {
			log.FuncErrorTrace(0, "Failed to get leader name for Unique ID %v. Item: %+v\n", UniqueID, item)
			LeaderName = ""
		}

		// Type
		Type, typeOk := item["type"].(string)
		if !typeOk || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Unique ID %v. Item: %+v\n", UniqueID, item)
			Type = ""
		}

		// Term
		Term, termOk := item["term"].(string)
		if !termOk || Term == "" {
			log.FuncErrorTrace(0, "Failed to get term for Unique ID %v. Item: %+v\n", UniqueID, item)
			Term = ""
		}

		// Qual
		Qual, qualOk := item["qual"].(string)
		if !qualOk || Qual == "" {
			log.FuncErrorTrace(0, "Failed to get qual for Unique ID %v. Item: %+v\n", UniqueID, item)
			Qual = ""
		}

		// SalesQ
		SalesQ, salesOk := item["sales_q"].(float64)
		if !salesOk {
			log.FuncErrorTrace(0, "Failed to get sales Q for Unique ID %v. Item: %+v\n", UniqueID, item)
			SalesQ = 0.0
		}

		// TeamKwQ
		TeamKwQ, teamKwOk := item["team_kw_q"].(float64)
		if !teamKwOk {
			log.FuncErrorTrace(0, "Failed to get team KW Q for Unique ID %v. Item: %+v\n", UniqueID, item)
			TeamKwQ = 0.0
		}

		// PayRate
		PayRate, payOk := item["pay_rate"].(string)
		if !payOk || PayRate == "" {
			log.FuncErrorTrace(0, "Failed to get pay rate for Unique ID %v. Item: %+v\n", UniqueID, item)
			PayRate = ""
		}

		// StartDate
		StartDate, startOk := item["start_date"].(string)
		if !startOk || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Unique ID %v. Item: %+v\n", UniqueID, item)
			StartDate = ""
		}

		// EndDate
		EndDate, endOk := item["end_date"].(string)
		if !endOk || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Unique ID %v. Item: %+v\n", UniqueID, item)
			EndDate = ""
		}

		// Create a new GetMarketingFeesData object
		leaderOverrideData := models.GetLeaderOverride{
			RecordId:   RecordId,
			UniqueID:   UniqueID,
			TeamName:   TeamName,
			LeaderName: LeaderName,
			Type:       Type,
			Term:       Term,
			Qual:       Qual,
			SalesQ:     SalesQ,
			TeamKwQ:    TeamKwQ,
			PayRate:    PayRate,
			StartDate:  StartDate,
			EndDate:    EndDate,
		}

		// Append the new marketingFeesData to the marketingFeesList
		pLeaderOverride.LeaderOverrideList.LeaderOverrideList = append(pLeaderOverride.LeaderOverrideList.LeaderOverrideList, leaderOverrideData)
	}
	return err
}

func (pLeaderOverride *LeaderOverrideCfgStruct) CalculateR2Name(teamCount float64, rep2Team, types string, wc time.Time) (r2Dmname string, r2DmRate float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(rep2Team) > 0 {
		if teamCount == 1 {
			return "O1T", 0
		} else {
			for _, data := range pLeaderOverride.LeaderOverrideList.LeaderOverrideList {
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
				if data.TeamName == rep2Team && data.Type == types && startDate.Before(wc) && endDate.After(wc) {
					r2Dmname = data.LeaderName
					payRateInt, _ := strconv.Atoi(data.PayRate)
					r2DmRate = float64(payRateInt)
				}
			}
		}
	}
	return r2Dmname, r2DmRate
}

func (pLeaderOverride *LeaderOverrideCfgStruct) CalculateR2DirName(teamCount float64, rep2Team string, wc time.Time) (r2Dmname string, r2DmRate float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(rep2Team) > 0 {
		if teamCount == 1 {
			return "O1T", 0
		} else {
			for _, data := range pLeaderOverride.LeaderOverrideList.LeaderOverrideList {
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
				if data.TeamName == rep2Team && data.Type == "DIR" && startDate.Before(wc) && endDate.After(wc) {
					r2Dmname = data.LeaderName
					payRateInt, _ := strconv.Atoi(data.PayRate)
					r2DmRate = float64(payRateInt)
				}
			}
		}
	}
	return r2Dmname, r2DmRate
}

func (pLeaderOverride *LeaderOverrideCfgStruct) CalculateR1SlName(rep1Team string, wc time.Time) (r1SlName string, r1SlRate float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(rep1Team) > 0 {
		for _, data := range pLeaderOverride.LeaderOverrideList.LeaderOverrideList {
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
			if data.TeamName == rep1Team && data.Type == "SL" && startDate.Before(wc) && endDate.After(wc) {
				r1SlName = data.LeaderName
				payRateInt, _ := strconv.ParseFloat(data.PayRate, 64)
				r1SlRate = payRateInt
			}
		}
	}
	return r1SlName, r1SlRate
}

func (pLeaderOverride *LeaderOverrideCfgStruct) CalculateRName(rep1Team, types string, wc time.Time) (r1DmName string, r1DmRate float64) {
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)
	if len(rep1Team) > 0 {
		for _, data := range pLeaderOverride.LeaderOverrideList.LeaderOverrideList {
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
			if data.TeamName == rep1Team && data.Type == types && startDate.Before(wc) && endDate.After(wc) {
				r1DmName = data.LeaderName
				payRateInt, _ := strconv.Atoi(data.PayRate)
				r1DmRate = float64(payRateInt)
			}
		}
	}
	return r1DmName, r1DmRate
}

