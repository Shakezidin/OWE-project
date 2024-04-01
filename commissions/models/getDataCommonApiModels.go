/**************************************************************************
 *	Function	: getDataCommonApiModels.go
 *	DESCRIPTION : Files contains struct for get data request
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

// Filter represents a single filter with Column, operation, and data
type Filter struct {
	Column    string `json:"Column"`
	Operation string `json:"operation"`
	Data      string `json:"data"`
}

// Parse the request body to extract parameters
type DataRequestBody struct {
	PageNumber int      `json:"page_number"`
	PageSize   int      `json:"page_size"`
	Filters    []Filter `json:"filters"`
}

