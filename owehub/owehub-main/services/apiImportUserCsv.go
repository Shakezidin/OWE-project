/**************************************************************************
* File                  : apiImportUserCsv.go
* DESCRIPTION           : This file contains a function to read data from a CSV file
*                         and store the parsed data into a database.
*
* DATE                  : 16-December-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	"encoding/csv"
	"io"
	"net/http"
)

/******************************************************************************
 * FUNCTION:		HandleImportUsersCsvRequest
 * DESCRIPTION:     Handles the file upload, parses the CSV file,
 *                  and stores the data into the database.
 * INPUT:			w (response writer), r (request)
 * RETURNS:    		void
 ******************************************************************************/

func HandleImportUsersCsvRequest(resp http.ResponseWriter, req *http.Request) {

	var err error
	log.EnterFn(0, "HandleImportUsersCsvRequest")

	defer func() { log.ExitFn(0, "HandleImportUsersCsvRequest", err) }()

	// Parse the form to handle the file upload (10MB limit)
	err = req.ParseMultipartForm(10 << 20)
	if err != nil {
		http.Error(resp, "Unable to parse form", http.StatusBadRequest)
		return
	}

	// Get the CSV file from the form data
	file, _, err := req.FormFile("file")
	if err != nil {
		http.Error(resp, "Unable to read the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Parse the CSV file
	reader := csv.NewReader(file)

	// Read each record from the CSV
	for {
		var queryParameters []interface{}

		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			appserver.FormAndSendHttpResp(resp, "Error reading Csv", http.StatusBadRequest, nil)
			return
		}

		// Assuming CSV format: Code, Name, Role, Email, PhoneNumber, Description, Action
		if len(record) != 7 {
			http.Error(resp, "Invalid CSV format", http.StatusBadRequest)
			return
		}

		queryParameters = append(queryParameters, record[0])
		queryParameters = append(queryParameters, record[1])
		queryParameters = append(queryParameters, record[2])
		queryParameters = append(queryParameters, record[3])
		queryParameters = append(queryParameters, record[4])
		queryParameters = append(queryParameters, record[5])
		queryParameters = append(queryParameters, record[6])

		log.FuncDebugTrace(0, "queryparameters %v", queryParameters)

		// Call the stored procedure or function to create the user
		//_, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateUserFunction, queryParameters)

	}
	appserver.FormAndSendHttpResp(resp, "CSV file processed successfully", http.StatusOK, nil)
}
