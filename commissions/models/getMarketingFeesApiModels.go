/**************************************************************************
 *	Function	: getMarketingFeesApiModels.go.go
 *	DESCRIPTION : Files contains struct for get Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetMarketingFeesData struct {
	Source      string `json:"source"`
	Dba         string `json:"dba"`
	State       string `json:"state"`
	FeeRate     string `json:"fee_rate"`
	ChgDlr      int    `json:"chg_dlr"`
	PaySrc      int    `json:"pay_src"`
	StartDate   string `json:"start_date" sql:"NOT NULL"`
	EndDate     string `json:"end_date"`
	Description string `json:"description"`
}

type GetMarketingFeesList struct {
	MarketingFeesList []GetMarketingFeesData `json:"Marketing_fees_list"`
}
