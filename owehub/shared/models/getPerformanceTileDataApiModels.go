/**************************************************************************
 *	Function	: getPerformanceTileDataApiModels.go
 *	DESCRIPTION : Files contains struct for get performance tile data models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPerformanceTileDataReq struct {
	Email      string `json:"email"`
	DealerName string `json:"dealer"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
}

type GetPerformanceTileData struct {
	AllSales          float64 `json:"all_sales"`
	TotalCancellation float64 `json:"total_cancellation"`
	TotalInstallation float64 `json:"total_installation"`
}
