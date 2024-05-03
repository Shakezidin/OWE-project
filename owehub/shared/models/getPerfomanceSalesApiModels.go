/**************************************************************************
 *	Function	: getMarketingFeesApiModels.go
 *	DESCRIPTION : Files contains struct for get Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

 package models

 type GetPerfomanceSales struct {
	 StartDate   string `json:"start_date"`
	 EndDate     string `json:"end_date"`
 }