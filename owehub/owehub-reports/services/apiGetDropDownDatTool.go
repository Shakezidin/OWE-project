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
	//
	if dataReq.RoofType == "flat" && dataReq.Structure != "Ground Mount 1" && dataReq.Structure != "Ground Mount 2" && dataReq.Structure != "Ground Mount 3" && dataReq.RackingMethod != "ballast" && dataReq.RackingMethod != "tilt with attachment" && dataReq.RackingMethod != "flush with attachment" {
		log.FuncErrorTrace(0, "Invalid Racking method %v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid Racking method", http.StatusInternalServerError, nil)
		return
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// for roof type = pitched only
	if dataReq.Structure == "" && dataReq.Structure != "Ground Mount 1" && dataReq.Structure != "Ground Mount 2" && dataReq.Structure != "Ground Mount 3" {
		log.FuncErrorTrace(0, "Fill the value of structure: %v", err)
		appserver.FormAndSendHttpResp(resp, "Fill the value of structure:", http.StatusInternalServerError, nil)
		return
	}

	if dataReq.RoofType == "" && dataReq.Structure != "Ground Mount 1" && dataReq.Structure != "Ground Mount 2" && dataReq.Structure != "Ground Mount 3" {
		log.FuncErrorTrace(0, "Fill the value of roof type: %v", err)
		appserver.FormAndSendHttpResp(resp, "Fill the value of roof type:", http.StatusInternalServerError, nil)
		return
	}

	if dataReq.Structure != "Ground Mount 1" && dataReq.Structure != "Ground Mount 2" && dataReq.Structure != "Ground Mount 3" && dataReq.RoofType == "pitched" {
		allDropdowns := map[string][]interface{}{
			// "structure":       {"Main Home", "Detached 1", "Detached 2", "Detached 3", "GM 1", "GM 2", "GM 3"},
			// "roof_type":       {"Flat", "Pitched"},
			//structural dropdowns
			"framing_type":        {"Manufactured Truss", "Rafter", "TJI Rafter", "Metal Truss"},
			"sheathing_type":      {"OSB", "Plywood", "Horizontal Purlins", "Skip Sheathing", "Tongue and groove"},
			"framing_size":        {"2x4", "2x6", "2x8", "2x10", "2x12", "4x4", "4x12"},
			"framing_spacing":     {12, 16, 24, 32, 36, 48},
			"roof_material":       {"Comp Shingle", "S-Tile", "Flat Tile", "Trapezoidal Metal", "Standing Seam Metal", "Corrugated Metal", "Rolled Comp", "Mod Bitumen", "Tar and Gravel", "TPO/EPDM", "SPF (foam)"},
			"structural_upgrades": {"Blocking", "Sistering", "Purlins"},
			"reroof_required":     {"Yes", "No"},
			"attachment_type": {"K2 Flex Foot", "K2 Splice Foot XL", "K2 Big Foot 6\" w/ 3\" E-Curb", "K2 Tile Hook",
				"S-5! ProteaBracket", "S-5! SolarFoot",
				"S-5! CorruBracket", "S-5! CorruBracket 100T", "S-5! S-5-S Clamp", "S-5! S-5-U Clamp",
				"S-5! S-5-N 1.5 Clamp", "S-5! S-5-N Clamp", "S-5! S-5-H90 Clamp",
				"S-5! VersaBracket", "EcoFasten SimpleGrip-SQ", "Unirac FlashLoc RM"},
			"attachment_pattern": {"Staggered", "Stacked"},
			// below feild added extra from excel sheet.
			"attachment_method": {"Rafter Mount", "Deck Mount"},
			"racking_type":      {"K2 CrossRail", "Snap n' Rack"},

			// "mount":           {"Flush", "Tilt", "Ballast"},
			// "gm_support_type": {"Ground Screws", "Concrete Piers"},
			// ///////////////////// above is real data //////////////////////////////////
			// //for attachment section
			// "attachment_spacing": {"portrait", "landscape"},
			// //for racking section
			// "racking_mount_type":          {"Top-Clamp", "Mid-Clamp"},
			// "racking_max_rail_cantilever": {"top", "bottom"},
		}

		// Prepare JSON response
		apiResponse = models.DropdownResponse{
			Data: allDropdowns,
		}

		appserver.FormAndSendHttpResp(resp, "Drop down Data", http.StatusOK, apiResponse, 0)
	}

	//////////////////////////////////////////////////////////////////////////////////////////////////////////
	// for roof type = flat only
	if dataReq.Structure != "" && dataReq.RoofType == "flat" && dataReq.RackingMethod == "" {
		log.FuncErrorTrace(0, "Fill the value of racking method: %v", err)
		appserver.FormAndSendHttpResp(resp, "Fill the value of racking method:", http.StatusInternalServerError, nil)
		return
	}

	if dataReq.Structure != "Ground Mount 1" && dataReq.Structure != "Ground Mount 2" && dataReq.Structure != "Ground Mount 3" && dataReq.RoofType == "flat" {
		allDropdowns := map[string][]interface{}{}

		// Append flat roof-specific dropdowns
		allDropdowns["framing_type"] = []interface{}{"Manufactured Truss", "Rafter", "TJI Rafter", "Metal Truss"}
		allDropdowns["sheathing_type"] = []interface{}{"OSB", "Plywood", "Horizontal Purlins", "Skip Sheathing", "Tongue and groove"}
		allDropdowns["framing_size"] = []interface{}{"2x4", "2x6", "2x8", "2x10", "2x12", "4x4", "4x12"}
		allDropdowns["framing_spacing"] = []interface{}{12, 16, 24, 32, 36, 48}
		allDropdowns["roof_material"] = []interface{}{"Comp Shingle", "S-Tile", "Flat Tile", "Trapezoidal Metal", "Standing Seam Metal", "Corrugated Metal", "Rolled Comp", "Mod Bitumen", "Tar and Gravel", "TPO/EPDM", "SPF (foam)"}
		allDropdowns["reroof_required"] = []interface{}{"Yes", "No"}

		// in case of ballast only
		if dataReq.RackingMethod == "ballast" {
			allDropdowns["ballast_type"] = []interface{}{"Unirac RM10EVO", "Unirac RMDT", "IronRidge BX Ballast"}
		}

		// Append tilt with attachment dropdowns
		if dataReq.RackingMethod == "tilt with attachment" {
			allDropdowns["racking_type"] = []interface{}{"K2 CrossRail", "Snap n' Rack"}
			allDropdowns["attachment_type"] = []interface{}{"K2 Flex Foot", "K2 Splice Foot XL", "K2 Big Foot 6\" w/ 3\" E-Curb", "K2 Tile Hook",
				"S-5! ProteaBracket", "S-5! SolarFoot",
				"S-5! CorruBracket", "S-5! CorruBracket 100T", "S-5! S-5-S Clamp", "S-5! S-5-U Clamp",
				"S-5! S-5-N 1.5 Clamp", "S-5! S-5-N Clamp", "S-5! S-5-H90 Clamp",
				"S-5! VersaBracket", "EcoFasten SimpleGrip-SQ", "Unirac FlashLoc RM"}
			allDropdowns["attachment_pattern"] = []interface{}{"Staggered", "Stacked"}
			allDropdowns["attachment_method"] = []interface{}{"Rafter Mount", "Deck Mount"}
		}

		// Append flush with attachment dropdowns
		if dataReq.RackingMethod == "flush with attachment" {
			allDropdowns["racking_type"] = []interface{}{"K2 CrossRail", "Snap n' Rack"}
			allDropdowns["attachment_type"] = []interface{}{"K2 Flex Foot", "K2 Splice Foot XL", "K2 Big Foot 6\" w/ 3\" E-Curb", "K2 Tile Hook",
				"S-5! ProteaBracket", "S-5! SolarFoot",
				"S-5! CorruBracket", "S-5! CorruBracket 100T", "S-5! S-5-S Clamp", "S-5! S-5-U Clamp",
				"S-5! S-5-N 1.5 Clamp", "S-5! S-5-N Clamp", "S-5! S-5-H90 Clamp",
				"S-5! VersaBracket", "EcoFasten SimpleGrip-SQ", "Unirac FlashLoc RM"}
			allDropdowns["attachment_pattern"] = []interface{}{"Staggered", "Stacked"}
			allDropdowns["attachment_method"] = []interface{}{"Rafter Mount", "Deck Mount"}
		}

		// Prepare JSON response
		apiResponse = models.DropdownResponse{
			Data: allDropdowns,
		}

		appserver.FormAndSendHttpResp(resp, "Drop down Data", http.StatusOK, apiResponse, 0)

	}

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	// for ground mount only
	if (dataReq.Structure == "Ground Mount 1" || dataReq.Structure == "Ground Mount 2" || dataReq.Structure == "Ground Mount 3") && (dataReq.RoofType != "" || dataReq.RackingMethod != "") {
		log.FuncErrorTrace(0, "Fill only structure key value: %v", err)
		appserver.FormAndSendHttpResp(resp, "Fill only structure key value", http.StatusInternalServerError, nil)
		return
	}

	if (dataReq.Structure == "Ground Mount 1" || dataReq.Structure == "Ground Mount 2" || dataReq.Structure == "Ground Mount 3") && dataReq.RoofType == "" {
		allDropdowns := map[string][]interface{}{
			"foundation_type": {"Piers", "Grade Beam", "Ground Screw"},
		}
		// Prepare JSON response
		apiResponse = models.DropdownResponse{
			Data: allDropdowns,
		}

		appserver.FormAndSendHttpResp(resp, "Drop down Data", http.StatusOK, apiResponse, 0)
	}
}
