/**************************************************************************
 *	Function	: getCreateNewFormApiMdels.go
 *	DESCRIPTION : Files contains struct for get create new form data request
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateNewFormDataRequest struct {
	TableNames []string `json:"tableNames"`
	Dealer     string   `json:"dealer"`
}
