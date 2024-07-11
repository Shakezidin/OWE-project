/**************************************************************************
 *	Function	: createSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for create sale type user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateSaleType struct {
	TypeName    string `json:"type_name"`
	Description string `json:"description"`
}
