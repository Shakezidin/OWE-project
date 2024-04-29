/**************************************************************************
 * File            : commonUtils.go
 * DESCRIPTION     : This file contains common functions required for calc
 * DATE            : 28-April-2024
 **************************************************************************/
package Common

import (
	log "OWEApp/shared/logger"
	"math"
	"strconv"
)

/******************************************************************************
 * FUNCTION:        StrToFloat
 * DESCRIPTION:     parses a string into a float64
 * RETURNS:        returns nil if parsing fails
 *****************************************************************************/
func StrToFloat(s string) *float64 {

	log.EnterFn(0, "StrToFloat")
	defer func() { log.ExitFn(0, "StrToFloat", "") }()

	value, err := strconv.ParseFloat(s, 64)
	if err != nil {
		return nil
	}
	return &value
}

/******************************************************************************
 * FUNCTION:        Round
 * DESCRIPTION:     rounds a float64 value to a specified number of decimal places
 * RETURNS:
 *****************************************************************************/
func Round(num float64, places int) float64 {
	//pow := Pow(10, places)
	pow := math.Pow(10, float64(places))
	return math.Round(num*pow) / pow
}
