/**************************************************************************
 *	Function	: getSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type RepPayRequest struct {
	PayRollDate string   `json:"pay_roll_start_date"`
	PayRollEndDate   string   `json:"pay_roll_end_date"`
	UseCutoff        string   `json:"use_cutoff"`
	ReportType       string   `json:"report_type"`
	SortBy           []string `json:"sort_by"`
	Include          []string `json:"includes"`
	PageNumber       int    `json:"page_number"`
	PageSize         int    `json:"page_size"`
	CommissionModel  string `json:"commission_model"`
}

//  type GetSaleTypeData struct {
// 	 RecordId    int64  `json:"record_id"`
// 	 TypeName    string `json:"type_name"`
// 	 Description string `json:"description"`
//  }

//  type GetSaleTypeList struct {
// 	 SaleTypeList []GetSaleTypeData `json:"saletype_list"`
//  }
