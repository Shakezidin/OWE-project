/**************************************************************************
 *	Function	: dealerOverride.go
 *	DESCRIPTION : Files contains functions for dealer override config
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

type DealerOverrideStruct struct {
	ItemID    int64     `json:"item_id"`
	PodioLink string    `json:"podio_link"`
	SubDealer string    `json:"sub_dealer"`
	Dealer    string    `json:"dealer"`
	PayRate   float64   `json:"pay_rate"`
	State     string    `json:"state"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type DealerOverride struct {
	DealerOverrideData []DealerOverrideStruct
}

func GetDealerOverrideConfigFromDB(dataFilter models.DataRequestBody) (dlrOverrideRespCfg DealerOverride, err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_DealerOverrideCommisionsDbhub
	)
	log.EnterFn(0, "GetDealerOverrideConfigFromDB")
	defer func() { log.ExitFn(0, "GetDealerOverrideConfigFromDB", err) }()

	/* Reset the DealerOverrideData slice */
	dlrOverrideRespCfg.DealerOverrideData = dlrOverrideRespCfg.DealerOverrideData[:0]

	query = `SELECT * FROM ` + tableName

	filter, whereEleList = prepareConfigFilters(tableName, dataFilter, true)
	if filter != "" {
		query = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		log.FuncErrorTrace(0, "Failed to get dealer override data from DB err: %v", err)
		return dlrOverrideRespCfg, err
	}

	if len(data) == 0 {
		err = fmt.Errorf("no data found in db for dealeroverride configuration")
		return dlrOverrideRespCfg, err
	}

	for _, item := range data {
		DealerOverrideStructList := DealerOverrideStruct{
			ItemID:    getInt64(item, "item_id"),
			PodioLink: getString(item, "podio_link"),
			SubDealer: getString(item, "sub_dealer"),
			Dealer:    getString(item, "dealer"),
			PayRate:   getFloat64(item, "pay_rate"),
			State:     getString(item, "state"),
			StartDate: getTime(item, "start_date"),
			EndDate:   getTime(item, "end_date"),
		}

		dlrOverrideRespCfg.DealerOverrideData = append(dlrOverrideRespCfg.DealerOverrideData, DealerOverrideStructList)
	}

	return dlrOverrideRespCfg, err
}
