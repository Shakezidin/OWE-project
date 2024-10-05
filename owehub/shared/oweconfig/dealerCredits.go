/**************************************************************************
 *	Function	: dealerCredits.go
 *	DESCRIPTION : Files contains functions for dealer credits config
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

type DealerCreditsStruct struct {
	ItemID       int64     `json:"item_id"`
	PodioLink    string    `json:"podio_link"`
	Customer     string    `json:"customer"`
	UniqueId     string    `json:"unique_id"`
	CreditDate   time.Time `json:"credit_date"`
	CreditAmount string    `json:"credit_amount"`
	ApprovedBy   string    `json:"approved-by"`
	Notes        string    `json:"notes"`
}

type DealerCredits struct {
	DealerCreditsData []DealerCreditsStruct
}

var (
	DlrCreditRespCfg DealerCredits
)

func (dlrCreds *DealerCredits) LoadDealerCreditsConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_DealerCreditsCommisionsDbhub
	)
	log.EnterFn(0, "LoadDealerCreditsConfigFromDB")
	defer func() { log.ExitFn(0, "LoadDealerCreditsConfigFromDB", err) }()

	query = `SELECT * FROM ` + tableName

	filter, whereEleList = prepareConfigFilters(tableName, dataFilter, true)
	if filter != "" {
		query = query + filter
	}

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	if len(data) == 0 {
		err = fmt.Errorf("No Data found in DB for DealerCredits Configuration.")
		return err
	}

	/* Reset the DealerCreditsData slice */
	dlrCreds.DealerCreditsData = dlrCreds.DealerCreditsData[:0]

	for _, item := range data {
		DealerCreditsStructList := DealerCreditsStruct{

			ItemID:       getInt64(item, "item_id"),
			PodioLink:    getString(item, "podio_link"),
			Customer:     getString(item, "customer"),
			UniqueId:     getString(item, "unique_id"),
			CreditDate:   getTime(item, "credit_date"),
			CreditAmount: getString(item, "credit_amount"),
			ApprovedBy:   getString(item, "approved_by"),
			Notes:        getString(item, "notes"),
		}

		dlrCreds.DealerCreditsData = append(dlrCreds.DealerCreditsData, DealerCreditsStructList)
	}

	return err
}
