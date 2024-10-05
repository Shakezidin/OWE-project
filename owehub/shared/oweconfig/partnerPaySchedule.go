/**************************************************************************
 *	Function	: partnerPaySchedule.go
 *	DESCRIPTION : Files contains functions for partner pay schedule config
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

type PartnerPayScheduleStruct struct {
	ItemID                       int64     `json:"item_id"`
	PodioLink                    string    `json:"podio_link"`
	SppsRef                      string    `json:"spps_ref"`
	Sug                          string    `json:"sug"`
	Sales_partner                string    `json:"sales_partner"`
	Finance_partner              string    `json:"finance_partner"`
	State                        string    `json:"state"`
	Redline                      string    `json:"redline"`
	M1SalesPartnerDrawPercentage string    `json:"m1_sales_partner_draw_percentage"`
	M1SalesPartnerNotToExceed    string    `json:"m1_sales_partner_not_to_exceed"`
	M1SalesRepDrawPercentage     string    `json:"m1_sales_rep_draw_percentage"`
	M1SalesRepNotToExceed        string    `json:"m1_sales_rep_not_to_exceed"`
	RepPay                       string    `json:"rep_pay"`
	ActiveDateStart              time.Time `json:"active_date_start"`
	ActiveDateEnd                time.Time `json:"active_date_end"`
}

type PartnerPaySchedule struct {
	PartnerPayScheduleData []PartnerPayScheduleStruct
}

var (
	PartnerPaySchedRespCfg PartnerPaySchedule
)

func (partnerPaySched *PartnerPaySchedule) LoadPartnerPayScheduleConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_SalesPartnerPayScheduleCommisionsDbhub
	)
	log.EnterFn(0, "LoadPartnerPayScheduleConfigFromDB")
	defer func() { log.ExitFn(0, "LoadPartnerPayScheduleConfigFromDB", err) }()

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

	/* Reset the PartnerPayScheduleData slice */
	partnerPaySched.PartnerPayScheduleData = partnerPaySched.PartnerPayScheduleData[:0]

	for _, item := range data {
		PartnerPayScheduleStructList := PartnerPayScheduleStruct{

			ItemID:                       getInt64(item, "item_id"),
			PodioLink:                    getString(item, "podio_link"),
			SppsRef:                      getString(item, "spps_ref"),
			Sug:                          getString(item, "sug"),
			Sales_partner:                getString(item, "sales_partner"),
			Finance_partner:              getString(item, "finance_partner"),
			State:                        getString(item, "state"),
			Redline:                      getString(item, "redline"),
			M1SalesPartnerDrawPercentage: getString(item, "m1_sales_partner_draw_percentage"),
			M1SalesPartnerNotToExceed:    getString(item, "m1_sales_partner_not_to_exceed"),
			M1SalesRepDrawPercentage:     getString(item, "m1_sales_rep_draw_percentage"),
			M1SalesRepNotToExceed:        getString(item, "m1_sales_rep_not_to_exceed"),
			RepPay:                       getString(item, "rep_pay"),
			ActiveDateStart:              getTime(item, "active_date_start"),
			ActiveDateEnd:                getTime(item, "active_date_end"),
		}

		partnerPaySched.PartnerPayScheduleData = append(partnerPaySched.PartnerPayScheduleData, PartnerPayScheduleStructList)
	}

	return err
}
