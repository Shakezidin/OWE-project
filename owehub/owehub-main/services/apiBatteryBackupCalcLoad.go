/**************************************************************************
 * File       	   : apiBatteryBackupCalcLoad.go
 * DESCRIPTION     : This file contains API to set get prospect Load
 * DATE            : 22-June-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"reflect"

	"github.com/jackc/pgtype"
)

/******************************************************************************
 * FUNCTION:		HandleSetProspectLoad
 * DESCRIPTION:     handler for set prospect load
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleSetProspectLoad(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		prospectLoadInfo models.ProspectLoadInfo
		queryParameters  []interface{}
		breakersJSONB    pgtype.JSONB
	)

	log.EnterFn(0, "HandleSetProspectLoad")
	defer func() { log.ExitFn(0, "HandleSetProspectLoad", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in set prospect load request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from set prospect load request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &prospectLoadInfo)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal set prospect load request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal set prospect load request", http.StatusBadRequest, nil)
		return
	}

	if prospectLoadInfo.ProspectId <= 0 ||
		len(prospectLoadInfo.ProspectName) <= 0 ||
		len(prospectLoadInfo.Breakers) <= 0 {

		log.FuncErrorTrace(0, "Empty Mandatory Parameter Received")
		appserver.FormAndSendHttpResp(resp, "Empty Mandatory Parameter Received", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, prospectLoadInfo.ProspectId)
	queryParameters = append(queryParameters, prospectLoadInfo.LRA)
	queryParameters = append(queryParameters, prospectLoadInfo.AverageCapacity)
	queryParameters = append(queryParameters, prospectLoadInfo.ContinousCurrent)
	queryParameters = append(queryParameters, prospectLoadInfo.MissingLabels)

	breakersJSON, err := json.Marshal(prospectLoadInfo.Breakers)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Parse Breaker to JSON with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Parse Breaker to JSON", http.StatusInternalServerError, nil)
		return
	}

	err = breakersJSONB.Set(breakersJSON)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Parse Breaker to JSON with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Parse Breaker to JSON", http.StatusInternalServerError, nil)
		return
	}
	queryParameters = append(queryParameters, breakersJSONB)

	// Call the database function
	_, err = db.CallDBFunction(db.OweHubDbIndex, db.InsertBatteryBackupCalcProspectLoad, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Insert Prospect Load in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Prospect Load", http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "Prospect Load created Sucessfully")
	appserver.FormAndSendHttpResp(resp, "Prospect Load created Successfully", http.StatusOK, nil)
}

/******************************************************************************
 * FUNCTION:		HandleGetProspectLoad
 * DESCRIPTION:     handler for get prospect load
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProspectLoad(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		prospectInfoId   models.ProspectInfoId
		prospectLoadInfo models.GetProspectLoadInfo
		whereEleList     []interface{}
		data             []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetProspectLoad")
	defer func() { log.ExitFn(0, "HandleGetProspectLoad", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get prospect load request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get prospect load request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &prospectInfoId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get prospect load request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get prospect load request", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, prospectInfoId.ProspectId)
	query := `SELECT
            pl.prospect_load_id,
            pl.prospect_id,
						pl.missing_labels,
						pi.prospect_name,
						pi.address,
						pi.house_square::numeric::float8,
						pi.sys_size::numeric::float8,
            pl.lra::numeric::float8,
            pl.average_capacity::numeric::float8,
            pl.continous_current::numeric::float8,
            json_agg(json_build_object(
                'breaker_id', bi.breaker_id,
                'ampere', bi.ampere,
								'note', bi.note,
                'category_name', bi.category_name,
								'category_ampere', bi.category_ampere
            )) AS breakers
        FROM
            ` + db.TableName_Prospect_Load + ` pl
        JOIN
            ` + db.TableName_Prospect_LoadBreaker_Map + ` plb ON pl.prospect_load_id = plb.prospect_load_id
        JOIN
            ` + db.TableName_Breaker_Info + ` bi ON plb.breaker_id = bi.breaker_id
				LEFT JOIN
            ` + db.TableName_Prospect_Info + ` pi ON pi.prospect_id = pl.prospect_id
		WHERE
			pl.prospect_id = $1
		GROUP BY
            pl.prospect_load_id, pl.prospect_id, pi.prospect_name, pi.address,pi.house_square, pi.sys_size, pl.lra, pl.average_capacity, pl.continous_current
	`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get prospect load data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get prospect load data from DB", http.StatusInternalServerError, nil)
		return
	}

	if len(data) <= 0 {
		log.FuncErrorTrace(0, "Prospects load for Prospects Id %v not present in DB", prospectInfoId.ProspectId)
		appserver.FormAndSendHttpResp(resp, "Prospects load for Prospects Id not present in DB", http.StatusInternalServerError, nil)
		return
	}

	log.FuncErrorTrace(0, "++ %+v", reflect.TypeOf(data[0]["prospect_id"]))

	prospectLoadInfo.LRA = data[0]["lra"].(float64)
	prospectLoadInfo.AverageCapacity = data[0]["average_capacity"].(float64)
	prospectLoadInfo.ContinousCurrent = data[0]["continous_current"].(float64)
	prospectLoadInfo.ProspectId = int(data[0]["prospect_id"].(int64))
	prospectLoadInfo.ProspectName = data[0]["prospect_name"].(string)
	prospectLoadInfo.Address = data[0]["address"].(string)
	prospectLoadInfo.HouseSquare = data[0]["house_square"].(float64)
	prospectLoadInfo.SysSize = data[0]["sys_size"].(float64)
	prospectLoadInfo.MissingLabels = data[0]["missing_labels"].(bool)

	if err := json.Unmarshal(data[0]["breakers"].([]uint8), &prospectLoadInfo.Breakers); err != nil {
		log.FuncErrorTrace(0, "Failed to Unmarshal Breakers Info from Prospect Load err: %+v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Unmarshal Breakers Info from Prospect Load", http.StatusInternalServerError, nil)
		return
	}

	totalAmpere := 0.0
	for _, breaker := range prospectLoadInfo.Breakers {
		totalAmpere += breaker.CategoryAmpere
	}

	prospectLoadInfo.TotalCategoryAmperes = totalAmpere
	log.FuncDebugTrace(0, "prospect load reterived: %+v", prospectLoadInfo)
	appserver.FormAndSendHttpResp(resp, "prospect load reterived Successfully", http.StatusOK, prospectLoadInfo)
}
