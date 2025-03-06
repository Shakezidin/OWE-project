/**************************************************************************
 *	Function	: updateSetterSalesRepModel.go
 *	DESCRIPTION : Files contains struct for update sales rep API
 *	DATE        : 06-march-2025
 **************************************************************************/

package models

type UpdateSetterSalesRepReq struct {
	UniqueId string `json:"unique_id"`
	Field    string `json:"field"`
	Data     string `json:"data"`
}
