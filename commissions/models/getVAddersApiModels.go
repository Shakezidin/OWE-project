/**************************************************************************
 *	Function	: getVAddersApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetVAdderData struct {
	AdderName   string `json:"adder_name"`
	AdderType   string `json:"adder_type"`
	PriceType   string `json:"price_type"`
	PriceAmount string `json:"price_amount"`
	Active      int    `json:"active"`
	Description string `json:"description"`
}

type GetVAddersList struct {
	VAddersList []GetVAdderData `json:"VAdders_list"`
}
