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
	"strconv"
	"time"
)

type GetmktgFeeData struct {
	Source    string
	StartDate time.Time
	State     string
	MktgCode  string
	FeeRate   float64
}

type mktgFeeCfgStruct struct {
	mktgFeeList []GetmktgFeeData
}

var (
	mktgFeeCfg mktgFeeCfgStruct
)

func (mktgFeeCfg *mktgFeeCfgStruct) LoadmktgFeeCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadmktgFeeCfg")
	defer func() { log.ExitFn(0, "LoadmktgFeeCfg", err) }()

	query = ` SELECT *
	FROM mktg rs`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	mktgFeeCfg.mktgFeeList = mktgFeeCfg.mktgFeeList[:0]
	for _, item := range data {

		Source, ok := item["source"].(string)
		if !ok || Source == "" {
			Source = ""
		}

		State, ok := item["state"].(string)
		if !ok || State == "" {
			State = ""
		}

		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			StartDate = time.Time{}
		}

		FeeRate, ok := item["fee_rate"].(float64)
		if !ok {
			FeeRate = 0.0
		}

		mktgCode := calculateMktgCode(Source, State, StartDate)

		// Create a new GetSaleTypeData object
		mktgFeeData := GetmktgFeeData{
			Source:    Source,
			State:     State,
			StartDate: StartDate,
			MktgCode:  mktgCode,
			FeeRate:   FeeRate,
		}

		mktgFeeCfg.mktgFeeList = append(mktgFeeCfg.mktgFeeList, mktgFeeData)
	}

	return err
}

func calculateMktgCode(Source, State string, StartDate time.Time) (mktgCode string) {
	if len(Source) > 0 {
		timeParsed := strconv.Itoa(excelDateFromTime(StartDate))
		mktgCode = "MK-" + State[:2] + timeParsed + Source
	}
	return mktgCode
}

func (mktgFeeCfg *mktgFeeCfgStruct) CalculateRepFeeRate(types string) (incentive float64) {
	for _, data := range mktgFeeCfg.mktgFeeList {
		if types == data.MktgCode {
			return data.FeeRate
		}
	}
	return 0
}
