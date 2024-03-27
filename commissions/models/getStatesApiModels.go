/**************************************************************************
 *	Function	: getSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetStatesData struct {
	Abbr string `json:"abbr"`
	Name string `json:"name"`
}

type GetStatesList struct {
	StatesList []GetStatesData `json:"states_list"`
}
