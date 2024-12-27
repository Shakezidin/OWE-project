package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

/******************************************************************************
 * FUNCTION:        HandleTriggerRowDataUpdateRequest
 * DESCRIPTION:     This function will trigger row data update
 * INPUT:			resp, req
 * RETURNS:    		err
 ******************************************************************************/
func HandleTriggerRowDataUpdateRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err          error
		reqBodyBytes []byte
		reqBody      models.TriggerRowDataUpdateRequest
	)
	log.EnterFn(0, "HandleTriggerRowDataUpdateRequest")
	defer func() { log.ExitFn(0, "HandleTriggerRowDataUpdateRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("request body is null in trigger row data update request")
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBodyBytes, err = io.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "failed to read HTTP Request body from trigger row data update request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBodyBytes, &reqBody)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal trigger row data update request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal trigger row data update request", http.StatusBadRequest, nil)
		return
	}

	// validate secret key to prevent api abuse
	if reqBody.SecretKey != db.RowDataApiSecret {
		err = fmt.Errorf("invalid secret key in trigger row data update request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid secret key", http.StatusUnauthorized, nil)
		return
	}

	// validate reqBody.Action
	if reqBody.Action != "insert" && reqBody.Action != "update" &&
		reqBody.Action != "delete" && reqBody.Action != "refresh" {
		err = fmt.Errorf("invalid action \"%s\" in trigger row data update request", reqBody.Action)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid action", http.StatusBadRequest, nil)
		return
	}

	// validate reqBody.RecordIds (not applicable for refresh)
	if reqBody.Action != "refresh" && len(reqBody.RecordIds) <= 0 {
		err = fmt.Errorf("empty record ids in trigger row data update request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Empty record ids", http.StatusBadRequest, nil)
		return
	}

	// switch on table name to prevent sql injection
	switch reqBody.TableName {
	case "sales_partner_dbhub_schema":

		// upsert
		if reqBody.Action == "update" || reqBody.Action == "create" {
			err = UpsertSalesPartnersFromOweDb(reqBody.RecordIds...)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to upsert: %v", err)
				appserver.FormAndSendHttpResp(resp, "Internal server error", http.StatusInternalServerError, nil)
				return
			}
		}

		// refresh
		if reqBody.Action == "refresh" {
			query := fmt.Sprintf("TRUNCATE TABLE %s", reqBody.TableName)
			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to truncate table: %v", err)
				appserver.FormAndSendHttpResp(resp, "Internal server error", http.StatusInternalServerError, nil)
				return
			}

			err = UpsertSalesPartnersFromOweDb()
			if err != nil {
				log.FuncErrorTrace(0, "Failed to refresh: %v", err)
				appserver.FormAndSendHttpResp(resp, "Internal server error", http.StatusInternalServerError, nil)
				return
			}
		}

		// delete
		if reqBody.Action == "delete" {
			wherePlaceholders := make([]string, len(reqBody.RecordIds))
			whereEleList := make([]interface{}, len(reqBody.RecordIds))
			for i, recordId := range reqBody.RecordIds {
				whereEleList[i] = recordId
				wherePlaceholders[i] = fmt.Sprintf("$%d", i+1)
			}

			query := fmt.Sprintf("DELETE FROM %s WHERE item_id IN (%s)", reqBody.TableName, strings.Join(wherePlaceholders, ", "))
			err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to delete: %v", err)
				appserver.FormAndSendHttpResp(resp, "Internal server error", http.StatusInternalServerError, nil)
				return
			}
		}

	// Support more tables as needed here

	default:
		err = fmt.Errorf("invalid table name in trigger row data update request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Table not supported", http.StatusBadRequest, nil)
		return
	}

	appserver.FormAndSendHttpResp(resp, "Success", http.StatusOK, nil)
}
