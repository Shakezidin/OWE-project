/**************************************************************************
 *	Function	: updateMarketingFeesApiModels.go
 *	DESCRIPTION : Files contains struct for update Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateMarketingFee struct {
	RecordId    int64  `json:"record_id"`
	Source      string `json:"source"`
	Dba         string `json:"dba"`
	State       string `json:"state"`
	FeeRate     string `json:"fee_rate"`
	ChgDlr      int    `json:"chg_dlr"`
	PaySrc      int    `json:"pay_src"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	Description string `json:"description"`
}

type UpdateMarketingFeeArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
