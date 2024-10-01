/**************************************************************************
 *	Function	: dealerCredits.go
 *	DESCRIPTION : Files contains functions for dealer credits config
 *	DATE        : 20-June-2024
 **************************************************************************/

package oweconfig

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"fmt"
	"time"
)

type DealerCreditsStruct struct {
	ItemID       int64     `json:"item_id"`
	PodioLink    string    `json:"podio_link"`
	Customer     string    `json:"customer"`
	UniqueId     string    `json:"unique-id"`
	CreditDate   time.Time `json:"credit_date"`
	CreditAmount string    `json:"credit-amount"`
	ApprovedBy   string    `json:"approved-by"`
	Notes        string    `json:"notes"`
}

type DealerCredits struct {
	DealerCreditsData []DealerCreditsStruct
}

var (
	dlrCreditRespCfg DealerCredits
)

func (dlrCreds *DealerCredits) LoadDealerCreditsConfigFromDB() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadDealerCreditsConfigFromDB")
	defer func() { log.ExitFn(0, "LoadDealerCreditsConfigFromDB", err) }()

	query = `SELECT * FROM ` + db.TableName_DealerCreditsCommisionsDbhub

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
	dlrCreditRespCfg.DealerCreditsData = dlrCreditRespCfg.DealerCreditsData[:0]

	for _, item := range data {
		DealerCreditsStructList := DealerCreditsStruct{

			ItemID:       getInt64(item, "item_id"),
			PodioLink:    getString(item, "podio_link"),
			Customer:     getString(item, "customer"),
			UniqueId:     getString(item, "unique-id"),
			CreditDate:   getTime(item, "credit_date"),
			CreditAmount: getString(item, "credit-amount"),
			ApprovedBy:   getString(item, "approved_by"),
			Notes:        getString(item, "notes"),
		}

		dlrCreditRespCfg.DealerCreditsData = append(dlrCreditRespCfg.DealerCreditsData, DealerCreditsStructList)
	}

	return err
}
