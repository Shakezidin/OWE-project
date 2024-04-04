/**************************************************************************
 *	Function	: UpdateVAddersApiModels.go
 *	DESCRIPTION : Files contains struct for update Dealer models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type UpdateVAdder struct {
	RecordId    int64  `json:"record_id"`
	AdderName   string `json:"adder_name"`
	AdderType   string `json:"adder_type"`
	PriceType   string `json:"price_type"`
	PriceAmount string `json:"price_amount"`
	Active      int    `json:"active"`
	Description string `json:"description"`
}
