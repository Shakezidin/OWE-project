/**************************************************************************
* File            : MarketingFeeCfg.go
* DESCRIPTION     : This file contains the model and data form MarketingFee
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"
	"strconv"
	"time"
)

type MarketingFeeCfgStruct struct {
	MarketingFeeCfg models.GetMarketingFeesList
}

var (
	MarketingFeeCfg MarketingFeeCfgStruct
)

func (pMarketingFee *MarketingFeeCfgStruct) LoadMarketingFeeCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT mf.id as record_id, mf.dba, mf.fee_rate, mf.chg_dlr, mf.pay_src, mf.start_date, mf.end_date, mf.description, st.name as state_name, sr.name as source_name
	FROM marketing_fees mf
	JOIN states st ON st.state_id = mf.state_id
	JOIN source sr ON sr.id = mf.source_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get loan fee data from DB err: %v", err)
		return
	}

	// Assuming you have data as a slice of maps, as in your previous code
	pMarketingFee.MarketingFeeCfg.MarketingFeesList = pMarketingFee.MarketingFeeCfg.MarketingFeesList[:0]
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// Source
		Source, ok := item["source_name"].(string)
		if !ok || Source == "" {
			log.FuncErrorTrace(0, "Failed to get source name for Record ID %v. Item: %+v\n", RecordId, item)
			Source = ""
		}

		// Dba
		Dba, ok := item["dba"].(string)
		if !ok || Dba == "" {
			log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			Dba = ""
		}

		// State
		State, ok := item["state_name"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// FeeRate
		FeeRate, ok := item["fee_rate"].(string)
		if !ok || FeeRate == "" {
			log.FuncErrorTrace(0, "Failed to get fee rate for Record ID %v. Item: %+v\n", RecordId, item)
			FeeRate = ""
		}

		// ChgDlr
		ChgDlr, ok := item["chg_dlr"].(bool)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get chg dlr for Record ID %v. Item: %+v\n", RecordId, item)
			ChgDlr = false // Default ChgDlr value of false
		}

		// PaySrc
		PaySrc, ok := item["pay_src"].(bool)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get pay src for Record ID %v. Item: %+v\n", RecordId, item)
			PaySrc = false // Default PaySrc value of false
		}

		// StartDate
		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = time.Time{}
		}

		// EndDate
		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = time.Time{}
		}

		// Description
		Description, descOk := item["description"].(string)
		if !descOk || Description == "" {
			log.FuncErrorTrace(0, "Failed to get description for Record ID %v. Item: %+v\n", RecordId, item)
			Description = ""
		}

		startDate := StartDate.Format("01-02-2006")
		endDate := EndDate.Format("01-02-2006")
		MarketingFeeData := models.GetMarketingFeesData{
			RecordId:    RecordId,
			Source:      Source,
			Dba:         Dba,
			State:       State,
			FeeRate:     FeeRate,
			ChgDlr:      ChgDlr,
			PaySrc:      PaySrc,
			StartDate:   startDate,
			EndDate:     endDate,
			Description: Description,
		}
		pMarketingFee.MarketingFeeCfg.MarketingFeesList = append(pMarketingFee.MarketingFeeCfg.MarketingFeesList, MarketingFeeData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateChgDlr
* DESCRIPTION:     calculates the chgDlr value based on the provided data
* RETURNS:         chgdlr bool
*****************************************************************************/
func (pMarketingFee *MarketingFeeCfgStruct) CalculateChgDlr(Type string) (chgDlr bool) {
	var (
		err           error
		startDate     time.Time
		marketingCode string
	)

	for _, data := range pMarketingFee.MarketingFeeCfg.MarketingFeesList {
		if len(data.Source) > 0 {
			if len(data.StartDate) > 0 {
				startDate, err = time.Parse("01-02-2006", data.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert data.StartDate:%+v to time.Time err: %+v", data.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in data.StartDate config")
				continue
			}
			dateInt := excelDateFromTime(startDate)
			dateIntStr := strconv.Itoa(dateInt)
			marketingCode = fmt.Sprintf("MK-%v%v%v", data.State, dateIntStr, data.Source)
		}
		if marketingCode == Type {
			return data.ChgDlr
		}
	}
	return chgDlr
}

/******************************************************************************
* FUNCTION:        excelDateFromTime
* DESCRIPTION:     calculates the date time.time to integer format in excel on the provided data
* RETURNS:         Int
*****************************************************************************/
func excelDateFromTime(t time.Time) int {
	const excelEpoch = "1899-12-30"
	excelEpochDate, _ := time.Parse("2006-01-02", excelEpoch)
	duration := t.Sub(excelEpochDate)
	return int(duration.Hours() / 24)
}
