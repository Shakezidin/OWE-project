/**************************************************************************
 *	Function	: createPartnerApiModels.go
 *	DESCRIPTION : Files contains struct for create states user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateStates struct {
	Abbr string `json:"abbr"`
	Name string `json:"name"`
}
