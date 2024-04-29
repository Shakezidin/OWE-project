/**************************************************************************
 *	Function	: updatePaymentSchedulesApiModels.go
 *	DESCRIPTION : Files contains struct for create payment schedule user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdatePaymentSchedule struct {
	RecordId      int64  `json:"record_id"`
	Partner       string `json:"partner"`
	PartnerName   string `json:"partner_name"`
	InstallerName string `json:"installer_name"`
	SaleType      string `json:"sale_type"`
	State         string `json:"state"`
	Rl            string `json:"rl"`
	Draw          string `json:"draw"`
	DrawMax       string `json:"draw_max"`
	RepDraw       string `json:"rep_draw"`
	RepDrawMax    string `json:"rep_draw_max"`
	RepPay        string `json:"rep_pay"`
	StartDate     string `json:"start_date"`
	EndDate       string `json:"end_date"`
}

type UpdatePaymentScheduleArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
