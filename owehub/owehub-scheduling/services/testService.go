/**************************************************************************
* File			: apiApAdvArchive.go
* DESCRIPTION	: This file contains functions for  appt setters archive handler
* DATE			: 01-Apr-2024
**************************************************************************/

package services

import (
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleApAdvArchiveRequest
 * DESCRIPTION:     handler for  ApAdv Archive request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func HandleTest(resp http.ResponseWriter, req *http.Request) {
	// log.DBTransDebugTrace(0, "appt setters archive d with Id: %+v", data)
	FormAndSendHttpResp(resp, "Test Done Successfully", http.StatusOK, nil)
}
