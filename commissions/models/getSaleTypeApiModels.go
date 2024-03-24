/**************************************************************************
 *	Function	: getSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetSaleTypeData struct {
	TypeName    string `json:"type_name"`
	Description string `json:"description"`
}

type GetSaleTypeList struct {
	SaleTypeList []GetSaleTypeData `json:"saletype_list"`
}
