/**************************************************************************
 * File       	   : apiFilterOperationMapping.go
 * DESCRIPTION     : This file contains Filter Operation Mapping handler
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	"fmt"
	"strings"
)

/******************************************************************************
* FUNCTION:		GetFilterDBMappedOperator
* DESCRIPTION:     handler for mapping of filter operations to SQL operators
* INPUT:			string
* RETURNS:    		string
******************************************************************************/
 func GetFilterDBMappedOperator(operation string) string {
	 switch operation {
	 case "eqs":
		 return "="
	 case "lst":
		 return "<"
	 case "lsteqs":
		 return "<="
	 case "grt":
		 return ">"
	 case "grteqs":
		 return ">="
	 case "stw", "edw", "cont":
		 return "ILIKE"
	 default:
		 return "="
	 }
 }
 
 /******************************************************************************
	* FUNCTION:		GetFilterModifiedValue
	* DESCRIPTION:     handler to modifies the filter value based on the filter operation
	* INPUT:			string
	* RETURNS:    		string
	******************************************************************************/
 func GetFilterModifiedValue(operation, data string) string {
	 switch operation {
	 case "stw":
		 return fmt.Sprintf("%s%%", strings.ToLower(data))
	 case "edw":
		 return fmt.Sprintf("%%%s", strings.ToLower(data))
	 case "cont":
		 return fmt.Sprintf("%%%s%%", strings.ToLower(data))
	 default:
		 return data
	 }
 }
 