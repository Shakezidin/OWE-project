/**************************************************************************
 *	Function	: dealerPayments.go
 *	DESCRIPTION : Files contains functions for dealer payments config
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

type DealerPaymentsStruct struct {
	ItemID        int64     `json:"item_id"`
	PodioLink     string    `json:"podio_link"`
	Customer      string    `json:"customer"`
	UniqueId      string    `json:"unique_id"`
	SalesPartner  string    `json:"sales_partner"`
	TypeOfPayment string    `json:"type_of_payment"`
	PaymentDate   time.Time `json:"payment_date"`
	PaymentAmount string    `json:"payment_amount"`
	PaymentMethod string    `json:"payment_method"`
	Transaction   string    `json:"transaction"`
	Notes         string    `json:"notes"`
}

type DealerPayments struct {
	DealerPaymentsData []DealerPaymentsStruct
}

var (
	DlrPaymentRespCfg DealerPayments
)

func (dlrPayment *DealerPayments) LoadDealerPaymentsConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
		tableName    string = db.TableName_DealerPaymentsCommisionsDbhub
	)
	log.EnterFn(0, "LoadDealerPaymentsConfigFromDB")
	defer func() { log.ExitFn(0, "LoadDealerPaymentsConfigFromDB", err) }()

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
		err = fmt.Errorf("No Data found in DB for DealerPayments Configuration.")
		return err
	}

	/* Reset the DealerPaymentsData slice */
	dlrPayment.DealerPaymentsData = dlrPayment.DealerPaymentsData[:0]

	for _, item := range data {
		DealerPaymentsStructList := DealerPaymentsStruct{

			ItemID:        getInt64(item, "item_id"),
			PodioLink:     getString(item, "podio_link"),
			Customer:      getString(item, "customer"),
			UniqueId:      getString(item, "unique_id"),
			SalesPartner:  getString(item, "sales_partner"),
			TypeOfPayment: getString(item, "type_of_payment"),
			PaymentDate:   getTime(item, "payment_date"),
			PaymentAmount: getString(item, "payment_amount"),
			PaymentMethod: getString(item, "payment_method"),
			Transaction:   getString(item, "transaction"),
			Notes:         getString(item, "notes"),
		}
		dlrPayment.DealerPaymentsData = append(dlrPayment.DealerPaymentsData, DealerPaymentsStructList)
	}

	return err
}
