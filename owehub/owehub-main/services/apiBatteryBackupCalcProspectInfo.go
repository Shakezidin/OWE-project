/**************************************************************************
 * File       	   : apiBatteryBackupCalcProspectInfo.go
 * DESCRIPTION     : This file contains API to set get prospect Info
 * DATE            : 22-June-2024
 **************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"reflect"

	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	_ "github.com/jackc/pgx/v4/stdlib"
)

/******************************************************************************
 * FUNCTION:		HandleSetProspectInfo
 * DESCRIPTION:     handler for set prospect info
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleSetProspectInfo(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		prospectInfoData models.ProspectInfoData
		response         models.ProspectInfoId
		queryParameters  []interface{}
		result           []interface{}
	)

	log.EnterFn(0, "HandleSetProspectInfo")
	defer func() { log.ExitFn(0, "HandleSetProspectInfo", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in set prospect info request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from set prospect info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &prospectInfoData)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal set prospect info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal set prospect info request", http.StatusBadRequest, nil)
		return
	}

	if len(prospectInfoData.ProspectName) <= 0 ||
		len(prospectInfoData.SREmailId) <= 0 ||
		len(prospectInfoData.MultiImages) <= 0 {
		log.FuncErrorTrace(0, "Empty Mandatory Parameter Received")
		appserver.FormAndSendHttpResp(resp, "Empty Mandatory Parameter Received", http.StatusBadRequest, nil)
		return
	}

	// Populate query parameters in the correct order
	queryParameters = append(queryParameters, prospectInfoData.ProspectName)
	queryParameters = append(queryParameters, prospectInfoData.SREmailId)
	queryParameters = append(queryParameters, prospectInfoData.MultiImages)
	queryParameters = append(queryParameters, prospectInfoData.WaterHeater)
	queryParameters = append(queryParameters, prospectInfoData.CookingAppliances)
	queryParameters = append(queryParameters, prospectInfoData.Furnace)
	queryParameters = append(queryParameters, prospectInfoData.ClothesDryer)
	queryParameters = append(queryParameters, prospectInfoData.PoolPump)
	queryParameters = append(queryParameters, prospectInfoData.WellPump)
	queryParameters = append(queryParameters, prospectInfoData.EvCharger)
	queryParameters = append(queryParameters, prospectInfoData.Spa)
	queryParameters = append(queryParameters, prospectInfoData.Address)
	queryParameters = append(queryParameters, prospectInfoData.HouseSquare)
	queryParameters = append(queryParameters, prospectInfoData.SysSize)
	queryParameters = append(queryParameters, prospectInfoData.AddedNotes)

	// Call the database function
	result, err = db.CallDBFunction(db.OweHubDbIndex, db.CreateBatteryBackupCalcProspectInfo, queryParameters)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Create Prospect info in DB with err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to Create Prospect Info", http.StatusInternalServerError, nil)
		return
	}

	data := result[0].(map[string]interface{})

	if v, ok := data["result"].(int64); ok {
		response.ProspectId = int(v)
	} else {
		log.FuncErrorTrace(0, "Error: data[result] is not of type int : %v", reflect.TypeOf(data["result"]))
		appserver.FormAndSendHttpResp(resp, "Failed to Create Prospect Info, Failed to Process Prospect Id ", http.StatusInternalServerError, nil)
		return
	}

	log.FuncDebugTrace(0, "prospect info created with Id: %+v", data["result"])
	appserver.FormAndSendHttpResp(resp, "prospect info created Successfully", http.StatusOK, response)
}

/******************************************************************************
 * FUNCTION:		HandleGetProspectInfo
 * DESCRIPTION:     handler for get prospect info
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetProspectInfo(resp http.ResponseWriter, req *http.Request) {
	var (
		err              error
		prospectInfoId   models.ProspectInfoId
		prospectInfoData models.GetProspectInfo
		whereEleList     []interface{}
		data             []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetProspectInfo")
	defer func() { log.ExitFn(0, "HandleGetProspectInfo", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get prospect info request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get prospect info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &prospectInfoId)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get prospect info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get prospect info request", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, prospectInfoId.ProspectId)
	log.FuncErrorTrace(0, "PROSPECT ID: %v", prospectInfoId.ProspectId)

	tableName := db.TableName_Prospect_Info
	query := `SELECT *
	 FROM ` + tableName +
		` WHERE prospect_id = $1`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get prospect info data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get prospect info data from DB", http.StatusInternalServerError, nil)
		return
	}

	if len(data) <= 0 {
		log.FuncErrorTrace(0, "Prospects Info for Prospects Id %v not present in DB", prospectInfoId.ProspectId)
		appserver.FormAndSendHttpResp(resp, "Prospects Info for Prospects Id not present in DB", http.StatusInternalServerError, nil)
		return
	}

	prospectInfoData.SREmailId = data[0]["sr_email_id"].(string)
	prospectInfoData.ProspectName = data[0]["prospect_name"].(string)
	prospectInfoData.MultiImages = BytesToStringArray(data[0]["panel_images_url"].([]uint8))
	prospectInfoData.Primary.WaterHeater = data[0]["water_heater"].(string)
	prospectInfoData.Primary.CookingAppliances = data[0]["cooking_appliances"].(string)
	prospectInfoData.Primary.Furnace = data[0]["furnace"].(string)
	prospectInfoData.Primary.ClothesDryer = data[0]["clothes_dryer"].(string)
	prospectInfoData.Secondary.PoolPump = data[0]["pool_pump"].(bool)
	prospectInfoData.Secondary.WellPump = data[0]["well_pump"].(bool)
	prospectInfoData.Secondary.EvCharger = data[0]["ev_charger"].(bool)
	prospectInfoData.Secondary.Spa = data[0]["spa"].(bool)
	prospectInfoData.Address = data[0]["address"].(string)
	prospectInfoData.HouseSquare = data[0]["house_square"].(float64)
	prospectInfoData.SysSize = data[0]["sys_size"].(float64)
	prospectInfoData.AddedNotes = data[0]["added_notes"].(string)

	log.FuncDebugTrace(0, "prospect info reterived: %+v", prospectInfoData)
	appserver.FormAndSendHttpResp(resp, "prospect info reterived Successfully", http.StatusOK, prospectInfoData)
}
