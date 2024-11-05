/**************************************************************************
 *	Function	: getMilestoneDataRequest.go
 *	DESCRIPTION : Files contains struct for get sale milestone models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetMilestoneDataReq struct {
	DealerNames []string `json:"dealer_names"`
	StartDate   string   `json:"start_date"`
	EndDate     string   `json:"end_date"`
	DateBy      string   `json:"date_by"`
	State       string   `json:"state"`
}

type GetMilestoneDataResp struct {
	TotalSale              int            `json:"total_sale"`
	TotalNtp               int            `json:"total_ntp"`
	TotalInstall           int            `json:"total_install"`
	InstallIncreasePercent float64        `json:"install_increase_percent"`
	NtpIncreasePercent     float64        `json:"ntp_increase_percent"`
	SaleIncreasePercent    float64        `json:"sale_increase_percent"`
	NtpData                map[string]int `json:"ntp_data"`
	SaleData               map[string]int `json:"sale_data"`
	InstallData            map[string]int `json:"install_data"`
}
