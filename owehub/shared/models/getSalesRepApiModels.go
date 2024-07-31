/**************************************************************************
 *	Function	: getUsersSaleRepApiModels.go
 *	DESCRIPTION : Files contains struct for get users detail models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetSalesRep struct {
	TeamId     int64  `json:"team_id"`
	DealerName string `json:"dealer_name"`
	Email      string
}

type SaleReps struct {
	UserRoles string `json:"user_roles"`
	RepId     int64  `json:"rep_id"`
	RepCode   string `json:"rep_code"`
	Name      string `json:"name"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
}

type GetSaleRepList struct {
	SaleRepList []SaleReps `json:"sale_rep_list"`
}
