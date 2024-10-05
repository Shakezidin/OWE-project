/**************************************************************************
 *	Function	: wrappers.go
 *	DESCRIPTION : Files contains utility functions for required for config
 *	DATE        : 20-June-2024
 **************************************************************************/

package oweconfig

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"fmt"
	"strings"
	"time"
)

/* Helper functions for type assertions and defaults */
func getInt64(item map[string]interface{}, key string) int64 {
	if value, ok := item[key].(int64); ok {
		return value
	}
	return 0
}

func getString(item map[string]interface{}, key string) string {
	if value, ok := item[key].(string); ok {
		return value
	}
	return ""
}

func getFloat64(item map[string]interface{}, key string) float64 {
	if value, ok := item[key].(float64); ok {
		return value
	}
	return 0
}

func getTime(item map[string]interface{}, key string) time.Time {
	if value, ok := item[key].(time.Time); ok {
		return value
	}
	return time.Time{} // Return zero value
}

/******************************************************************************
 * FUNCTION:		prepareConfigFilters
 * DESCRIPTION:     handler for prepare filter
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func prepareConfigFilters(tableName string, dataFilter models.DataRequestBody, forDataCount bool) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "prepareConfigFilters")
	defer func() { log.ExitFn(0, "prepareConfigFilters", nil) }()

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

			filtersBuilder.WriteString(fmt.Sprintf("%s %s $%d", column, operator, len(whereEleList)+1))
			whereEleList = append(whereEleList, value)
		}
	}

	filters = filtersBuilder.String()

	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filters)
	return filters, whereEleList
}
