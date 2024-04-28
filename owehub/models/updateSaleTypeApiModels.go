/**************************************************************************
 *	Function	: updateSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for update sale type user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateSaleType struct {
	RecordId    int64  `json:"record_id"`
	TypeName    string `json:"type_name"`
	Description string `json:"description"`
}
