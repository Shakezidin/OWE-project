/**************************************************************************
 *	Function	: getUsersSaleRepApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetSalesRep struct {
	Role    string `json:"role"`
	Name    string `json:"name"`
	SubRole string `json:"sub_role"`
}

type SaleReps struct {
	RepId int64 `json:"rep_id"`
	RepCode string `json:"rep_code"`
	Name  string `json:"name"`
	Phone string `json:"phone"`
	Email string `json:"email"`
}

type GetSaleRepeList struct {
	SaleRepList []SaleReps `json:"sale_rep_list"`
}
