/**************************************************************************
* File                  : getTabStructuralInfo.go
* DESCRIPTION           : This file contains functions to get information related to structural tab in DAT Tool

* DATE                  : 31-january-2025
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
)

/******************************************************************************
* FUNCTION:		    HandleGetTabStructuralInfoRequest
* DESCRIPTION:      handler for get structural general info request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetTabStructuralInfoRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.GetTabGeneralInfoRequest
		apiResponse models.GetTabStructuralInfoResponse
		// data        []map[string]interface{}
		// query       string
		// whereClause string
	)

	log.EnterFn(0, "HandleGetTabStructuralInfoRequest")

	defer func() { log.ExitFn(0, "HandleGetTabStructuralInfoRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get structural general info request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get structural general info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tab structural info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get tab structural info Request body", http.StatusInternalServerError, nil)
		return
	}

	// whereClause = fmt.Sprintf("WHERE (c.unique_id = '%s')", dataReq.ProjectId)

	// // query to fetch data
	// query = fmt.Sprintf(`
	// 		SELECT
	// 		--general info
	// 			c.customer_name,
	// 			c.unique_id,
	// 			c.address,
	// 			c.email_address,
	// 			c.phone_number,
	// 		-- PV Modules info
	// 			ntp.inverter,
	// 			p.battery,
	// 			fire.ac_system_size,
	// 			ntp.battery_count,
	// 		-- AHJ and Utility Info
	// 			ahj.ahj_link,
	// 			cad.install_site_capture,
	// 			utility.utility_portal,
	// 			c.record_url,
	// 		-- Contract Information
	// 			sales.contract_date,
	// 			p.pv_module_quantity,
	// 			p.pv_module_type,
	// 			p.pv_inverter_type,
	// 			p.battery_type,
	// 			prospect.annual_estimated_production

	// 		FROM customers_customers_schema as c
	// 		%s
	// 		LEFT JOIN ntp_ntp_schema AS ntp ON c.record_id = ntp.record_id
	// 		LEFT JOIN planset_cad_schema AS p ON c.record_id = p.record_id
	// 		LEFT JOIN fire_permits_permit_fin_schema AS fire ON c.record_id = fire.record_id
	// 		LEFT JOIN ahj_db_database_hub_schema AS ahj ON c.record_id = ahj.record_id
	// 		LEFT JOIN cad_cad_schema AS cad ON c.record_id = cad.record_id
	// 		LEFT JOIN utility_db_database_hub_schema AS utility ON c.record_id = utility.record_id
	// 		LEFT JOIN sales_metrics_schema AS sales ON c.record_id = sales.record_id
	// 		LEFT JOIN prospects_customers_schema AS prospect ON c.record_id = prospect.record_id
	// 		ORDER BY c.unique_id;
	// 	`, whereClause)

	// data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
	// 	return
	// }

	// if len(data) <= 0 {
	// 	err = fmt.Errorf("project info not found")
	// 	log.FuncErrorTrace(0, "%v", err)
	// 	appserver.FormAndSendHttpResp(resp, "project not found", http.StatusBadRequest, nil)
	// 	return
	// }

	// structure, ok := data[0]["structure"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get structure from db : %+v\n", data)
	// }

	// roofType, ok := data[0]["roof_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof type from db : %+v\n", data)
	// }

	// sheathingType, ok := data[0]["sheathing_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get sheathing type from db : %+v\n", data)
	// }

	// framingSize, ok := data[0]["framing_size"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get framing size from db : %+v\n", data)
	// }

	// framingType1, ok := data[0]["framing_type_1"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get framing type 1 from db : %+v\n", data)
	// }

	// framingType2, ok := data[0]["framing_type_2"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get framing type 2 from db : %+v\n", data)
	// }

	// framingSpacing, ok := data[0]["framing_spacing"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get framing spacing from db : %+v\n", data)
	// }

	// attachment, ok := data[0]["attachment"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get attachment from db : %+v\n", data)
	// }

	// racking, ok := data[0]["racking"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get racking from db : %+v\n", data)
	// }

	// pattern, ok := data[0]["pattern"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get pattern from db : %+v\n", data)
	// }

	// mount, ok := data[0]["mount"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get mount from db : %+v\n", data)
	// }

	// structuralUpgrades, ok := data[0]["structural_upgrades"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get structural upgrades from db : %+v\n", data)
	// }

	// gmSupportType, ok := data[0]["gm_support_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get GM support type from db : %+v\n", data)
	// }

	// reroofRequired, ok := data[0]["reroof_required"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get reroof required from db : %+v\n", data)
	// }

	// quantity, ok := data[0]["quantity"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get quantity from db : %+v\n", data)
	// }

	// pitch, ok := data[0]["pitch"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get pitch from db : %+v\n", data)
	// }

	// areaSqft, ok := data[0]["area_sqft"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get area sqft from db : %+v\n", data)
	// }

	// azim, ok := data[0]["azimuth"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get azimuth from db : %+v\n", data)
	// }

	// tsrf, ok := data[0]["tsrf"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get tsrf from db : %+v\n", data)
	// }

	// kwdc, ok := data[0]["kw_dc"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get kw_dc from db : %+v\n", data)
	// }

	// spacingP, ok := data[0]["spacing_p"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get spacing_p from db : %+v\n", data)
	// }

	// spacingL, ok := data[0]["spacing_l"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get spacing_l from db : %+v\n", data)
	// }

	// attachmentType, ok := data[0]["attachment_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get attachment type from db : %+v\n", data)
	// }

	// attachmentPattern, ok := data[0]["attachment_pattern"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get attachment pattern from db : %+v\n", data)
	// }

	// attachmentQty, ok := data[0]["attachment_quantity"].(int64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get attachment quantity from db : %+v\n", data)
	// }

	// attachmentSpacing, ok := data[0]["attachment_spacing"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get attachment spacing from db : %+v\n", data)
	// }

	// rackingType, ok := data[0]["racking_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get racking type from db : %+v\n", data)
	// }

	// rackingMountType, ok := data[0]["racking_mount_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get racking mount type from db : %+v\n", data)
	// }

	// rackingTiltInfo, ok := data[0]["racking_title_info"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get racking tilt info from db : %+v\n", data)
	// }

	// rackingMaxRailCantilever, ok := data[0]["racking_max_rail_cantilever"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get racking max rail cantilever from db : %+v\n", data)
	// }

	// roofFramingType, ok := data[0]["roof_framing_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof framing type from db : %+v\n", data)
	// }

	// roofSize, ok := data[0]["roof_size"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof size from db : %+v\n", data)
	// }

	// roofSpacing, ok := data[0]["roof_spacing"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof spacing from db : %+v\n", data)
	// }

	// roofSheathingType, ok := data[0]["roof_sheathing_type"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof sheathing type from db : %+v\n", data)
	// }

	// roofMaterial, ok := data[0]["roof_material"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof material from db : %+v\n", data)
	// }

	// roofStructuralUpgrade, ok := data[0]["roof_structural_upgrade"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof structural upgrade from db : %+v\n", data)
	// }

	structure := "Select"                           // string
	roofType := "Flat"                              // string
	sheathingType := "OSB"                          // string
	framingSize := "2x4"                            // string
	structuralRoofMaterial := "Standing Seam Metal" // string
	framingType := "Mfg.Truss"                      // string
	framingSpacing := 16                            // int

	attachment := "K2 Flex Foot" // string
	racking := "k2 cross rail"   // string
	pattern := "Staggered"       // string
	mount := "Flush"             // string

	structuralUpgrades := "Blocking" // string
	gmSupportType := "Ground Screws" // string
	reroofRequired := "Yes"          // string
	quantity := 10                   // int
	pitch := 30                      // int
	areaSqft := "1500 sqft"          // string
	azim := 180                      // int
	tsrf := 15                       // int
	kwdc := 200                      // int
	spacingP := 12                   // int
	spacingL := 6                    // int

	attachmentType := "Flush"         // string
	attachmentPattern := "Horizontal" // string
	attachmentSpacing := "12 inches"  // string
	attachmentQty := 12               // int

	rackingType := "Fixed"               // string
	rackingMountType := "Roof Mount"     // string
	rackingTiltInfo := "Fixed Tilt"      // string
	rackingMaxRailCantilever := "5 feet" // string

	roofFramingType := "Wooden"           // string
	roofSize := "Medium"                  // string
	roofSpacing := "24 inches"            // string
	roofSheathingType := "Plywood"        // string
	roofMaterial := "Asphalt Shingles"    // string
	roofStructuralUpgrade := "Reinforced" // string

	apiResponse = models.GetTabStructuralInfoResponse{
		Structure:                structure,
		RoofType:                 roofType,
		SheathingType:            sheathingType,
		FramingSize:              framingSize,
		StructuralRoofMaterial:   structuralRoofMaterial,
		FramingType:              framingType,
		FramingSpacing:           int64(framingSpacing),
		Attachment:               attachment,
		Racking:                  racking,
		Pattern:                  pattern,
		Mount:                    mount,
		StructuralUpgrades:       structuralUpgrades,
		GmSupportType:            gmSupportType,
		ReroofRequired:           reroofRequired,
		Quantity:                 int64(quantity),
		Pitch:                    int64(pitch),
		AreaSqft:                 areaSqft,
		Azim:                     int64(azim),
		TSRF:                     int64(tsrf),
		KWDC:                     int64(kwdc),
		SpacingP:                 int64(spacingP),
		SpacingL:                 int64(spacingL),
		AttachmentType:           attachmentType,
		AttachmentPattern:        attachmentPattern,
		AttachmentQty:            int64(attachmentQty),
		AttachmentSpacing:        attachmentSpacing,
		RackingType:              rackingType,
		RackingMountType:         rackingMountType,
		RackingTiltInfo:          rackingTiltInfo,
		RackingMaxRailCantilever: rackingMaxRailCantilever,
		RoofFramingType:          roofFramingType,
		RoofSize:                 roofSize,
		RoofSpacing:              roofSpacing,
		RoofSheathingType:        roofSheathingType,
		RoofMaterial:             roofMaterial,
		RoofStructuralUpgrade:    roofStructuralUpgrade,
	}

	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, 0)

}
