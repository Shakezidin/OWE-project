/**************************************************************************
 *	Function	: getStateApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetStatesData struct {
	Record_id int64  `json:"record_id"`
	Abbr      string `json:"abbr"`
	Name      string `json:"name"`
}

type GetStatesList struct {
	StatesList []GetStatesData `json:"states_list"`
}
