/*
*************************************************************************
  - File       	   	: filterPaginationUtils.go
  - DESCRIPTION     : This file can be used to paginate or add filter to
    apis in general. Please make sure to use only the
    structs that are used here.
  - DATE            : 03-Feb-2024

*************************************************************************
*/
package services

import (
	"fmt"
	"math"
	"strings"
)

type FilterOperator string
type DataType string

const (
	Equal            FilterOperator = "eq"   // equals
	NotEqual         FilterOperator = "neq"  // not equals
	LessThan         FilterOperator = "lt"   // less than
	LessThanEqual    FilterOperator = "lte"  // less than or equal
	GreaterThan      FilterOperator = "gt"   // greater than
	GreaterThanEqual FilterOperator = "gte"  // greater than or equal
	StartsWith       FilterOperator = "sw"   // starts with
	EndsWith         FilterOperator = "ew"   // ends with
	Contain          FilterOperator = "cont" // Contain
	Between          FilterOperator = "btw"  // between (for date ranges)
)

const (
	TypeString  DataType = "string"
	TypeInteger DataType = "integer"
	TypeFloat   DataType = "float"
	TypeBoolean DataType = "boolean"
	TypeDate    DataType = "date"
	TypeTime    DataType = "time"
)

type ColumnInfo struct {
	TableAlias string   // Database table alias
	DataType   DataType // Column data type
}
type Filter struct {
	Column    string         `json:"column"`
	Operation FilterOperator `json:"operation"`
	Data      interface{}    `json:"data"`
	StartDate string         `json:"start_date,omitempty"`
	EndDate   string         `json:"end_date,omitempty"`
}

type RequestParams struct {
	PageNumber int      `json:"page_number"`
	PageSize   int      `json:"page_size"`
	Filters    []Filter `json:"filters"`
	SortBy     string   `json:"sort_by,omitempty"`
	SortOrder  string   `json:"sort_order,omitempty"`
}

type FilterBuilder struct {
	ColumnMap map[string]ColumnInfo
}

func NewFilterBuilder(columnMap map[string]ColumnInfo) *FilterBuilder {
	return &FilterBuilder{
		ColumnMap: columnMap,
	}
}

var operatorMap = map[FilterOperator]string{
	Equal:            "=",
	NotEqual:         "!=",
	LessThan:         "<",
	LessThanEqual:    "<=",
	GreaterThan:      ">",
	GreaterThanEqual: ">=",
	StartsWith:       "ILIKE",
	EndsWith:         "ILIKE",
	Contain:          "ILIKE",
}

/*
This is the main function that is to be called to create filter
But to use this we need to create a FilterBuilder calling funciton NewFilterBuilder
and passing column map which contains the table alias and data type
*/
func (fb *FilterBuilder) BuildFilters(req RequestParams, distincOnColumn string, includeGroupBy, whereAdded bool) (string, []interface{}) {
	var builder strings.Builder
	var params []interface{}

	if len(req.Filters) > 0 {
		if whereAdded {
			builder.WriteString(" AND ")
		} else {
			builder.WriteString(" WHERE ")
		}

		for i, filter := range req.Filters {
			if i > 0 {
				builder.WriteString(" AND ")
			}

			columnInfo, exists := fb.ColumnMap[filter.Column]
			if !exists {
				continue
			}

			if columnInfo.DataType == TypeDate && filter.Operation == Between {
				if filter.StartDate != "" && filter.EndDate != "" {
					builder.WriteString(fb.buildDateRangeCondition(columnInfo, filter.Column, len(params)+1))
					params = append(params, filter.StartDate, filter.EndDate)
				}
				continue
			}

			operator := operatorMap[filter.Operation]
			value := fb.modifyFilterValue(filter.Operation, filter.Data)

			builder.WriteString(fb.buildCondition(columnInfo, filter.Column, operator, len(params)+1))
			params = append(params, value)
		}
	}

	if includeGroupBy {
		builder.WriteString(fb.buildGroupBy())
	}

	orderBy := fb.buildOrderBy(req, distincOnColumn)
	if orderBy != "" {
		builder.WriteString(orderBy)
	}

	return builder.String(), params
}

func (fb *FilterBuilder) buildCondition(info ColumnInfo, column, operator string, paramIndex int) string {
	fullColumn := fmt.Sprintf("%s.%s", info.TableAlias, column)

	switch info.DataType {
	case TypeString:
		return fmt.Sprintf("LOWER(%s) %s LOWER($%d)", fullColumn, operator, paramIndex)
	case TypeDate:
		return fmt.Sprintf("%s %s $%d::date", fullColumn, operator, paramIndex)
	case TypeTime:
		return fmt.Sprintf("%s %s $%d::timestamp", fullColumn, operator, paramIndex)
	case TypeBoolean:
		return fmt.Sprintf("%s %s $%d::boolean", fullColumn, operator, paramIndex)
	default:
		return fmt.Sprintf("%s %s $%d", fullColumn, operator, paramIndex)
	}
}

func (fb *FilterBuilder) buildDateRangeCondition(info ColumnInfo, column string, startParamIndex int) string {
	fullColumn := fmt.Sprintf("%s.%s", info.TableAlias, column)
	return fmt.Sprintf("(%s >= $%d::date AND %s <= $%d::date)",
		fullColumn, startParamIndex,
		fullColumn, startParamIndex+1)
}

func (fb *FilterBuilder) modifyFilterValue(op FilterOperator, data interface{}) interface{} {
	if str, ok := data.(string); ok {
		switch op {
		case StartsWith:
			return fmt.Sprintf("%s%%", strings.ToLower(str))
		case EndsWith:
			return fmt.Sprintf("%%%s", strings.ToLower(str))
		case Contain:
			return fmt.Sprintf("%%%s%%", strings.ToLower(str))
		}
	}
	return data
}

func (fb *FilterBuilder) buildGroupBy() string {
	var columns []string
	for column, info := range fb.ColumnMap {
		columns = append(columns, fmt.Sprintf("%s.%s", info.TableAlias, column))
	}
	return " GROUP BY " + strings.Join(columns, ", ")
}

func PaginateData[T any](data []T, req RequestParams) []T {
	startIndex := (req.PageNumber - 1) * req.PageSize
	endIndex := int(math.Min(float64(startIndex+req.PageSize), float64(len(data))))

	if startIndex >= len(data) || startIndex >= endIndex {
		return make([]T, 0)
	}

	return data[startIndex:endIndex]
}

/*
some queries use distinct on to filter data, in that case when you
use order by it it is important to send the distinct column as well
in the order by clause
*/
func (fb *FilterBuilder) buildOrderBy(req RequestParams, distinctOnColumn string) string {
	if req.SortBy == "" {
		return ""
	}

	columnInfo, exists := fb.ColumnMap[req.SortBy]
	if !exists {
		return ""
	}

	sortOrder := strings.ToUpper(req.SortOrder)
	if sortOrder != "DESC" {
		sortOrder = "ASC"
	}

	fullColumn := fmt.Sprintf("%s.%s", columnInfo.TableAlias, req.SortBy)

	if distinctOnColumn == "" {
		if columnInfo.DataType == TypeString {
			return fmt.Sprintf(" ORDER BY LOWER(%s) %s", fullColumn, sortOrder)
		}
		return fmt.Sprintf(" ORDER BY %s %s", fullColumn, sortOrder)
	}

	if columnInfo.DataType == TypeString {
		return fmt.Sprintf(" ORDER BY %s, LOWER(%s) %s", distinctOnColumn, fullColumn, sortOrder)
	}
	return fmt.Sprintf(" ORDER BY %s, %s %s", distinctOnColumn, fullColumn, sortOrder)
}
