/**************************************************************************
* File                  : apiGetDropDown.go
* DESCRIPTION           : This file contains functions to get all the drop downs in Dat tool

* DATE                  : 5-january-2025
**************************************************************************/

package services

import (
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	// "strings"
)

/******************************************************************************
* FUNCTION:		    HandleGetDropDownListRequest
* DESCRIPTION:      handler for get drop down list data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetDropDownListRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.DropdownRequest
		apiResponse models.DropdownResponse
		// data             []map[string]interface{}
		// query            string
		// whereEleList     []interface{}
		// whereClause      string
		// recordCount      int64
		// paginationClause string
		// sortValue        string
		filteredData map[string][]string
	)

	log.EnterFn(0, "HandleGetDropDownListRequest")

	defer func() { log.ExitFn(0, "HandleGetDropDownListRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get drop down list request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get drop down list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get drop down list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get drop down project list Request body", http.StatusInternalServerError, nil)
		return
	}

	// apiResponse = models.DropdownResponse{
	// 	Data: map[string][]string{
	// Predefined dropdown data
	allDropdowns := map[string][]string{
		"structure":       {"Main Home", "Detached 1", "Detached 2", "Detached 3", "GM 1", "GM 2", "GM 3"},
		"roof_type":       {"Flat", "Pitched"},
		"roof_material":   {"Comp Shingle", "S-Tile", "Flat Tile", "Trapezoidal Metal", "Standing Seam Metal", "Corrugated Metal", "Rolled Comp", "Mod Bitumen", "Tar and Gravel", "TPO/EPDM"},
		"sheathing_type":  {"OSB", "Plywood", "Horizontal Purlins", "Skip Sheathing", "Tongue and groove"},
		"framing_type":    {"Mfg. Truss", "Rafters", "TJI Rafter", "Metal Truss"},
		"framing_size":    {"2x4", "2x6", "2x8", "2x10", "2x12", "4x4", "4x12"},
		"framing_spacing": {"12", "16", "24", "32", "36", "48"},
		"attachment": {"K2 Flex Foot", "K2 Splice Foot XL", "K2 Splice Foot X",
			"K2 Big Foot 6\" w/ 3\" E-Curb", "K2 Tile Hook", "S-5! ProteaBracket", "S-5! SolarFoot",
			"S-5! CorruBracket", "S-5! CorruBracket 100T", "S-5! S-5-S Clamp", "S-5! S-5-U Clamp",
			"S-5! S-5-N 1.5 Clamp", "S-5! S-5-N Clamp", "S-5! S-5-H90 Clamp",
			"S-5! VersaBracket", "EcoFasten SimpleGrip-SQ", "Unirac FlashLoc RM",
		},
		"racking":             {"K2 CrossRail", "Unirac RM10EVO Ballast", "Unirac RMDT Ballast", "Unirac RM5 Ballast"},
		"pattern":             {"Staggered", "Full"},
		"mount":               {"Flush", "Tilt", "Ballast"},
		"structural_upgrades": {"Blocking", "Sistering", "Purlins"},
		"gm_support_type":     {"Ground Screws", "Concrete Piers"},
		"reroof_required":     {"Yes", "No"},
		///////////////////// above is real data //////////////////////////////////
		"attachment_type":             {"Lag Screws", "Structural Screws"},
		"attachment_pattern":          {"Standard", "Custom"},
		"attachment_spacing":          {"12", "16", "24"},
		"racking_mount_type":          {"Top-Clamp", "Mid-Clamp"},
		"racking_max_rail_cantilever": {"24", "36", "48"},
		"new_or_existing":             {"New", "Existing"},
		"panel_brand":                 {"LG", "SunPower", "Panasonic"},
		"busbar_rating":               {"100", "200", "225"},
		"main_breaker_rating":         {"100", "150", "200"},
		"system_phase":                {"Single", "Three"},
		"system_voltage":              {"120V", "240V", "480V"},
		"service_entrance":            {"Overhead", "Underground"},
		"service_rating":              {"100A", "200A", "400A"},
		"meter_enclosure_type":        {"NEMA 3R", "NEMA 4"},
		"pv_conduct_run":              {"EMT", "PVC", "Direct Burial"},
		"drywall_cut_needed":          {"Yes", "No"},
		"number_of_stories":           {"1", "2", "3+"},
		"trenching_required":          {"Yes", "No"},
		"points_of_interconnection":   {"1", "2", "3+"},
		"inverter":                    {"String", "Micro", "Hybrid"},
	}

	// Filter response based on requested fields
	filteredData = make(map[string][]string)
	for _, field := range dataReq.DropDownList {
		if values, exists := allDropdowns[field]; exists {
			filteredData[field] = values
		}
	}

	apiResponse = models.DropdownResponse{
		Data: filteredData,
	}

	appserver.FormAndSendHttpResp(resp, "Drop down Data", http.StatusOK, apiResponse, 0)
}
