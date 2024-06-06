/**************************************************************************
* File            : dealerTierCfg.go
* DESCRIPTION     : This file contains the model and data form DealerTier
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type DealerTierCfgStruct struct {
	DealerTierList models.GetDealersTierList
}

var (
	DealerTierCfg DealerTierCfgStruct
)

func (pDealerTier *DealerTierCfgStruct) LoadDealerTierCfg() (err error) {
	var (
		data         []map[string]interface{}
		// whereEleList []interface{}
		query        string
	)

	query = `
	SELECT dt.id as record_id, vd.dealer_name, tr.tier_name as tier, dt.start_date, dt.end_date
	FROM dealer_tier dt
	LEFT JOIN tier tr ON dt.tier_id = tr.id
	LEFT JOIN v_dealer vd ON dt.dealer_id = vd.id
	`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// DealerName
		DealerName, nameOk := item["dealer_name"].(string)
		if !nameOk || DealerName == "" {
			// log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			DealerName = ""
		}

		// Tier
		Tier, tierOk := item["tier"].(string)
		if !tierOk || Tier == "" {
			// log.FuncErrorTrace(0, "Failed to get tier for Record ID %v. Item: %+v\n", RecordId, item)
			Tier = ""
		}

		// start_date
		Start_date, ok := item["start_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		StartDateStr := Start_date.Format("2006-01-02")
		EndDateStr := EndDate.Format("2006-01-02")

		// Create a new GetDealerTierData object
		vaddersData := models.GetDealerTierData{
			RecordId:   RecordId,
			DealerName: DealerName,
			Tier:       Tier,
			StartDate:  StartDateStr,
			EndDate:    EndDateStr,
		}

		pDealerTier.DealerTierList.DealersTierList = append(pDealerTier.DealerTierList.DealersTierList, vaddersData)
	}
	return err
}

func (pDealerTier *DealerTierCfgStruct) CalculateDlrTier(uniqueId, dealer string, date time.Time) (dlrtier string) {

	bfrDateStr := "2022/06/15"
	var (
		err       error
		startDate time.Time
		endDate   time.Time
	)


	// Parse the date string into a time.Time object
	bfrDate, err := time.Parse("2006/01/02", bfrDateStr)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to convert data.StartDate to time.Time err: %+v", err)
	}
	if len(uniqueId) > 0 {
		if date.Before(bfrDate) {
			dlrtier = "OLD"
		} else {
			for _, data := range pDealerTier.DealerTierList.DealersTierList {
				if len(data.StartDate) > 0 {
					startDate, err = time.Parse("2006-01-02", data.StartDate)
					if err != nil {
						log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
					}
				} else {
					log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
					continue
				}

				if len(data.EndDate) > 0 {
					endDate, err = time.Parse("2006-01-02", data.EndDate)
					if err != nil {
						log.FuncErrorTrace(0, "Failed to convert data.EndDate:%+v to time.Time err: %+v", data.EndDate, err)
					}
				} else {
					log.FuncWarnTrace(0, "Empty EndDate Received in data.EndDate config")
					continue
				}

				if dealer == "Energy Bros USA"{
					dealer = "Energy Bros USA Inc"
				}
				if data.DealerName == dealer {
					if data.DealerName == dealer && startDate.Before(date) && endDate.Before(date) {
						dlrtier = data.Tier
					}
				}
			}
		}
	}
	return dlrtier
}
