/**************************************************************************
 *	Function	: updateSetterSalesRepModel.go
 *	DESCRIPTION : Files contains struct for update sales rep API
 *	DATE        : 06-march-2025
 **************************************************************************/

package models

type UpdateSetterSalesRepReq struct {
	ProjectRecordId string   `json:"project_record_id"`
	UpdatedRecordid []string `json:"updated_record_id"`
	Field           string   `json:"field"` //primar_sale_rep, setter
}
