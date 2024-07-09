/**************************************************************************
 *	Function	: getArScheduleApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 29-Apr-2024
 **************************************************************************/

package models

type GetArDataReq struct {
	ReportType  string   `json:"report_type"`
	SalePartner string   `json:"sale_partner"`
	SortBy      string   `json:"sort_by"`
	Shaky       bool     `json:"shaky"`
	Cancel      bool     `json:"cancel"`
	Sold        bool     `json:"sold"`
	Permits     bool     `json:"permits"`
	NTP         bool     `json:"ntp"`
	Install     bool     `json:"install"`
	PTO         bool     `json:"pto"`
	PageNumber  int      `json:"page_number"`
	PageSize    int      `json:"page_size"`
	Filters     []Filter `json:"filters"`
}

type GetArdata struct {
	UniqueId      string  `json:"unique_id"`
	Partner       string  `json:"partner"`
	Installer     string  `json:"installer"`
	Type          string  `json:"type"`
	HomeOwner     string  `json:"home_owner"`
	StreetAddress string  `json:"street_address"`
	City          string  `json:"city"`
	ST            string  `json:"st"`
	Zip           float64 `json:"zip"`
	SysSize       float64 `json:"sys_size"`
	WC            string  `json:"wc"`
	InstSys       string  `json:"inst_sys"`
	Status        string  `json:"status"`
	StatusDate    string  `json:"status_date"`
	ContractCalc  float64 `json:"contract_calc"`
	OweAr         float64 `json:"owe_ar"`
	TotalPaid     float64 `json:"total_paid"`
	CurrentDue    float64 `json:"current_due"`
	Balance       float64 `json:"balance"`
}

type GetArDataList struct {
	ArDataList []GetArdata `json:"ar_data_list"`
}
