/**************************************************************************
 * File       	   : apiPrepareFilters.go
 * DESCRIPTION     : This file contains functions for Prepare filters
 * DATE            : 22-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/logger"
	models "OWEApp/models"
	"strings"

	"fmt"
)

/******************************************************************************
 * FUNCTION:		PrepareFilters
 * DESCRIPTION:     handler for create select query
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func PrepareFilters(tableName string, dataFilter models.DataRequestBody) (filters string, whereEleList []interface{}) {
	log.EnterFn(0, "PrepareFilters")
	defer func() { log.ExitFn(0, "PrepareFilters", nil) }()
	var filtersBuilder strings.Builder

	// Check if there are filters
	if len(dataFilter.Filters) > 0 {
		filtersBuilder.WriteString(" WHERE ")
		for i, filter := range dataFilter.Filters {
			if i > 0 {
				filtersBuilder.WriteString(" AND ")
			}
			filtersBuilder.WriteString("LOWER(")
			filtersBuilder.WriteString(filter.Column)
			filtersBuilder.WriteString(") ")
			filtersBuilder.WriteString(filter.Operation)
			filtersBuilder.WriteString(" LOWER($")
			filtersBuilder.WriteString(fmt.Sprintf("%d", i+1))
			filtersBuilder.WriteString(")")
			whereEleList = append(whereEleList, strings.ToLower(filter.Data))
		}
	}

	// Add pagination
	if (dataFilter.PageSize > 0) && (dataFilter.PageNumber > 0) {
		filtersBuilder.WriteString(fmt.Sprintf(" LIMIT %d OFFSET %d", dataFilter.PageSize, (dataFilter.PageNumber-1)*dataFilter.PageSize))
	}
	filters = filtersBuilder.String()
	log.FuncDebugTrace(0, "filters for table name : %s : %s", tableName, filtersBuilder.String())
	return filters, whereEleList
}
