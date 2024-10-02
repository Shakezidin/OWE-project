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
	"strings"
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
	dlrCreditRespCfg DealerCredits
)

func (dlrCreds *DealerCredits) LoadDealerCreditsConfigFromDB(dataFilter models.DataRequestBody) (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
		filter       string
	)
	log.EnterFn(0, "LoadDealerCreditsConfigFromDB")
	defer func() { log.ExitFn(0, "LoadDealerCreditsConfigFromDB", err) }()

	query = `SELECT * FROM ` + db.TableName_DealerCreditsCommisionsDbhub

	filter, whereEleList = prepareDealerCreditFilters(db.TableName_DealerCreditsCommisionsDbhub, dataFilter, true)
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
	dlrCreditRespCfg.DealerCreditsData = dlrCreditRespCfg.DealerCreditsData[:0]

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

		dlrCreditRespCfg.DealerCreditsData = append(dlrCreditRespCfg.DealerCreditsData, DealerCreditsStructList)
	}

	return err
}

/******************************************************************************
 * FUNCTION:		prepareDealerCreditFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func prepareDealerCreditFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "prepareDealerCreditFilters")
	defer func() { log.ExitFn(0, "prepareDealerCreditFilters", nil) }()

	var filtersBuilder strings.Builder

	/* Check if there are filters */
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		for i, filter := range dataFilter.Filters {
			// Check if the column is a foreign key
			column := filter.Column

			// Determine the operator and value based on the filter operation
			operator := GetFilterDBMappedOperator(filter.Operation)
			value := filter.Data

			// For "stw" and "edw" operations, modify the value with '%'
			if filter.Operation == "stw" || filter.Operation == "edw" || filter.Operation == "cont" {
				value = GetFilterModifiedValue(filter.Operation, filter.Data.(string))
			}

			// Build the filter condition using correct db column name
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			switch column {
			case "unique_id":
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(unique_id) %s LOWER($%d)", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "customer":
				filtersBuilder.WriteString(fmt.Sprintf("customer %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "credit_amount":
				filtersBuilder.WriteString(fmt.Sprintf("credit_amount %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "approved_by":
				filtersBuilder.WriteString(fmt.Sprintf("approved_by %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "credit_date":
				filtersBuilder.WriteString(fmt.Sprintf("credit_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			default:
				filtersBuilder.WriteString(fmt.Sprintf("LOWER(%s) %s LOWER($%d)", column, operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			}
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
