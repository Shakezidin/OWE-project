/**************************************************************************
 *	Function	: createPaymentScheduleApiModels.go
 *	DESCRIPTION : Files contains struct for create payment schedule user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPaymentScheduleData struct {
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
	StartDate     string `json:"start_date" sql:"NOT NULL"`
	EndDate       string `json:"end_date"`
}

type GetPaymentScheduleList struct {
	PaymentScheduleList []GetPaymentScheduleData `json:"payment_schedule_list"`
}
