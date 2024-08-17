/**************************************************************************
 *	Function	: getMarketingFeesApiModels.go
 *	DESCRIPTION : Files contains struct for get Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPerfomanceReq struct {
	Email      string `json:"email"`
	DealerName interface{}
	StartDate  string `json:"start_data"`
	EndDate    string `json:"end_date"`
}
