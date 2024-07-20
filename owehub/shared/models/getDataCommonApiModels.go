/**************************************************************************
 *	Function	: getDataCommonApiModels.go
 *	DESCRIPTION : Files contains struct for get data request
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

// Filter represents a single filter with Column, operation, and data
type Filter struct {
	Column    string      `json:"Column"`
	Operation string      `json:"operation"`
	Data      interface{} `json:"Data"`
}

// Parse the request body to extract parameters
type DataRequestBody struct {
	PageNumber int      `json:"page_number"`
	PageSize   int      `json:"page_size"`
	Archived   bool     `json:"archived"`
	Filters    []Filter `json:"filters"`
}

type MailRequestBody struct {
	HtmlContent string `json:"html_content"`
	Message     string `json:"message"`
	Subject     string `json:"subject"`
	ToMail      string `json:"to_mail"`
}
