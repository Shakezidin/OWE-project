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
		// Check if the key is "state" and if the value contains "::"
		if key == "state" && strings.Contains(value, "::") {
			// Split the value by "::" and take the second part
			parts := strings.SplitN(value, "::", 2)
			if len(parts) > 1 {
				return strings.TrimSpace(parts[1])
			}
		}
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

			switch column {
			case "id":
				filtersBuilder.WriteString(fmt.Sprintf("id %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "item_id":
				filtersBuilder.WriteString(fmt.Sprintf("item_id %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "active_date_start":
				filtersBuilder.WriteString(fmt.Sprintf("active_date_start %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "active_date_end":
				filtersBuilder.WriteString(fmt.Sprintf("active_date_end %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "term_years":
				filtersBuilder.WriteString(fmt.Sprintf("term_years %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "ar_rate":
				filtersBuilder.WriteString(fmt.Sprintf("ar_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "dealer_fee":
				filtersBuilder.WriteString(fmt.Sprintf("dealer_fee %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "finance_fee":
				filtersBuilder.WriteString(fmt.Sprintf("finance_fee %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "payment_start_date_days":
				filtersBuilder.WriteString(fmt.Sprintf("payment_start_date_days %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "commissions_rate":
				filtersBuilder.WriteString(fmt.Sprintf("commissions_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "owe_finance_fee":
				filtersBuilder.WriteString(fmt.Sprintf("owe_finance_fee %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "payment_date":
				filtersBuilder.WriteString(fmt.Sprintf("payment_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "pay_rate":
				filtersBuilder.WriteString(fmt.Sprintf("pay_rate %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "start_date":
				filtersBuilder.WriteString(fmt.Sprintf("start_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "end_date":
				filtersBuilder.WriteString(fmt.Sprintf("end_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "credit_date":
				filtersBuilder.WriteString(fmt.Sprintf("credit_date %s $%d", operator, len(whereEleList)+1))
				whereEleList = append(whereEleList, value)
			case "state":
				filtersBuilder.WriteString(fmt.Sprintf(
					"LOWER(TRIM(SUBSTRING(state FROM POSITION('::' IN state) + 2 FOR LENGTH(state)))) %s $%d",
					operator,
					len(whereEleList)+1,
				))
				whereEleList = append(whereEleList, strings.ToLower(value.(string)))
			case "transaction":
				filtersBuilder.WriteString(fmt.Sprintf(
					"regexp_replace(transaction, '<[^>]*>', '', 'g') %s $%d",
					operator,
					len(whereEleList)+1,
				))
				whereEleList = append(whereEleList, value)
			case "product_code":
				filtersBuilder.WriteString(fmt.Sprintf(
					"regexp_replace(product_code, '<[^>]*>', '', 'g') %s $%d",
					operator,
					len(whereEleList)+1,
				))
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
