/**************************************************************************
 *	Function	: financeTypes.go
 *	DESCRIPTION : Files contains functions for finance Types config
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

type FinanceTypesStruct struct {
	ItemID                   int64     `json:"item_id"`
	PodioLink                string    `json:"podio_link"`
	FinanceTypeName          string    `json:"  finance_type_name"`
	FType                    string    `json:"f_type"`
	FinanceCompany           string    `json:"finance_company"`
	SubBrand                 string    `json:"sub_brand"`
	ProductCode              string    `json:"product_code"`
	Status                   string    `json:"  status   "`
	Relationship             string    `json:"relationship"`
	Installer                string    `json:"installer"`
	State                    string    `json:"state"`
	Type                     string    `json:"type"`
	TermRears                float64   `json:"term_years"`
	ArRate                   float64   `json:"ar_rate"`
	DealerFee                float64   `json:"dealer_fee"`
	FinanceFee               float64   `json:"finance_fee"`
	ActiveDateStart          time.Time `json:"active_date_start"`
	ActiveDateEnd            time.Time `json:"active_date_end"`
	PaymentStartDateDays     float64   `json:"payment_start_date_days"`
	PaymentStartDateBasedOn  string    `json:"payment_start_date_based_on"`
	FinanceCompanyForSearch  string    `json:"finance_company_for_search"`
	FinanceTypeSlugPortion_H string    `json:"finance_type_slug_portion_h"`
	SubRecord                string    `json:"sub_record"`
	FinanceTypeUidForImport  string    `json:"finance_type_uid_for_import"`
	FinanceTypeUid           string    `json:"finance_type_uid"`
}

type FinanceTypes struct {
	FinanceTypesData []FinanceTypesStruct
}

var (
	FinanceTypesRespCfg FinanceTypes
)

func (finType *FinanceTypes) LoadFinanceTypesConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_FinanceTypesCommisionsDbhub
	)
	log.EnterFn(0, "LoadFinanceTypesConfigFromDB")
	defer func() { log.ExitFn(0, "LoadFinanceTypesConfigFromDB", err) }()

	query = `SELECT * FROM ` + tableName

	filter, whereEleList = prepareConfigFilters(tableName, dataFilter, true)
	if filter != "" {
		query = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		log.FuncErrorTrace(0, "Failed to get  Partnet Pay Types data from DB err: %v", err)
		return err
	}

	if len(data) == 0 {
		err = fmt.Errorf("No Data found in DB for PartnerPayTypes Configuration.")
		return err
	}

	/* Reset the FinanceTypesData slice */
	finType.FinanceTypesData = finType.FinanceTypesData[:0]

	for _, item := range data {
		FinanceTypesStructList := FinanceTypesStruct{
			ItemID:                   getInt64(item, "item_id"),
			PodioLink:                getString(item, "podio_link"),
			FinanceTypeName:          getString(item, "finance_type_name"),
			FType:                    getString(item, "f_type	"),
			FinanceCompany:           getString(item, "finance_company"),
			SubBrand:                 getString(item, "sub_brand"),
			ProductCode:              getString(item, "product_code"),
			Status:                   getString(item, "status"),
			Relationship:             getString(item, "relationship"),
			Installer:                getString(item, "installer"),
			State:                    getString(item, "state"),
			Type:                     getString(item, "type"),
			TermRears:                getFloat64(item, "term_years"),
			ArRate:                   getFloat64(item, "ar_rate"),
			DealerFee:                getFloat64(item, "dealer_fee"),
			FinanceFee:               getFloat64(item, "finance_fee"),
			ActiveDateStart:          getTime(item, "active_date_start"),
			ActiveDateEnd:            getTime(item, "active_date_end"),
			PaymentStartDateDays:     getFloat64(item, "payment_start_date_days"),
			PaymentStartDateBasedOn:  getString(item, "payment_start_date_based_on"),
			FinanceCompanyForSearch:  getString(item, "finance_company_for_search"),
			FinanceTypeSlugPortion_H: getString(item, "finance_type_slug_portion_h"),
			SubRecord:                getString(item, "sub_record"),
			FinanceTypeUidForImport:  getString(item, "finance_type_uid_for_import"),
			FinanceTypeUid:           getString(item, "finance_type_uid"),
		}

		finType.FinanceTypesData = append(finType.FinanceTypesData, FinanceTypesStructList)
	}

	return err
}
