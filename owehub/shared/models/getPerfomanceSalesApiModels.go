/**************************************************************************
 *	Function	: getMarketingFeesApiModels.go
 *	DESCRIPTION : Files contains struct for get Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

import "time"

type GetPerfomanceSales struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

type GetPerfomanceReq struct {
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type PerfomanceSales struct {
	Sales   int64     `json:"sales"`
	SalesKw float64 `json:"sales_kw"`
}
