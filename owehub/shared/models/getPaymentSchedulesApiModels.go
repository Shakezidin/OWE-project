/**************************************************************************
 *	Function	: createPaymentScheduleApiModels.go
 *	DESCRIPTION : Files contains struct for create payment schedule user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPaymentScheduleData struct {
	RecordId      int64   `json:"record_id"`
	Dealer        string  `json:"dealer"`
	PartnerName   string  `json:"partner_name"`
	InstallerName string  `json:"installer_name"`
	SaleType      string  `json:"sale_type"`
	State         string  `json:"state"`
	Rl            float64 `json:"rl"`
	Draw          float64 `json:"draw"`
	DrawMax       float64 `json:"draw_max"`
	RepDraw       float64 `json:"rep_draw"`
	RepDrawMax    float64 `json:"rep_draw_max"`
	RepPay        string  `json:"rep_pay"`
	StartDate     string  `json:"start_date"`
	EndDate       string  `json:"end_date"`
}

type GetPaymentScheduleList struct {
	PaymentScheduleList []GetPaymentScheduleData `json:"payment_schedule_list"`
}
