/**************************************************************************
 *	Function	: financeSchedule.go
 *	DESCRIPTION : Files contains functions for finance schedule config
 *	DATE        : 20-June-2024
 **************************************************************************/

package oweconfig

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"fmt"
	"time"
)

type FinanceScheduleStruct struct {
	ItemID           int64     `json:"item_id"`
	PodioLink        string    `json:"podio_link"`
	FinanceTypeRef   string    `json:"finance_type_ref"`
	FinanceType      string    `json:" finance_type"`
	FinanceTypeUid   string    `json:" finance_type_uid"`
	CommissionsRate  float64   `json:"commissions_rate"`
	FinanceFee       float64   `json:" finance_fee"`
	OweFinanceFee    float64   `json:" owe_finance_fee"`
	State3           string    `json:" state_3"`
	ActiveDateStart  time.Time `json:"active_date_start"`
	ActiveDateEnd    time.Time `json:"active_date_end"`
	FinanceCompany   string    `json:"finance_company"`
	NoEndDateCanaryH string    `json:"no_end_date_canary_h"`
}

type FinanceSchedule struct {
	FinanceScheduleData []FinanceScheduleStruct
}

var (
	FinanceSchedRespCfg FinanceSchedule
)

func (financeSched *FinanceSchedule) LoadFinanceScheduleConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_FinanceScheduleCommisionsDbhub
	)
	log.EnterFn(0, "LoadFinanceScheduleConfigFromDB")
	defer func() { log.ExitFn(0, "LoadFinanceScheduleConfigFromDB", err) }()

	query = `SELECT * FROM ` + tableName

	filter, whereEleList = prepareConfigFilters(tableName, dataFilter, true)
	if filter != "" {
		query = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		log.FuncErrorTrace(0, "Failed to get  Partnet Pay Schedule data from DB err: %v", err)
		return err
	}

	if len(data) == 0 {
		err = fmt.Errorf("No Data found in DB for PartnerPaySchedule Configuration.")
		return err
	}

	/* Reset the FinanceScheduleData slice */
	financeSched.FinanceScheduleData = financeSched.FinanceScheduleData[:0]

	for _, item := range data {
		FinanceScheduleStructList := FinanceScheduleStruct{

			ItemID:           getInt64(item, "item_id"),
			PodioLink:        getString(item, "podio_link"),
			FinanceTypeRef:   getString(item, "finance_type_ref"),
			FinanceType:      getString(item, " finance_type"),
			FinanceTypeUid:   getString(item, " finance_type_uid"),
			CommissionsRate:  getFloat64(item, "commissions_rate"),
			FinanceFee:       getFloat64(item, "finance_fee"),
			OweFinanceFee:    getFloat64(item, "owe_finance_fee"),
			State3:           getString(item, "state_3"),
			ActiveDateStart:  getTime(item, "active_date_start"),
			ActiveDateEnd:    getTime(item, "active_date_end"),
			FinanceCompany:   getString(item, "finance_company"),
			NoEndDateCanaryH: getString(item, "no_end_date_canary_h"),
		}

		financeSched.FinanceScheduleData = append(financeSched.FinanceScheduleData, FinanceScheduleStructList)
	}

	return err
}
