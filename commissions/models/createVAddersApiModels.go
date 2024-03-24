/**************************************************************************
 *	Function	: createVAddersApiModels.go
 *	DESCRIPTION : Files contains struct for create v_adders user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateVAdders struct {
	AdderName string `json:"adder_name"`
	AdderType    string `json:"adder_type"`
	PriceType   string `json:"price_type"`
	PriceAmount string `json:"price_amount"`
	Active   int `json:"active"`
	Description string `json:"description"`
}