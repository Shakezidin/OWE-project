/**************************************************************************
* File                  : apiGetTabOtherInfo.go
* DESCRIPTION           : This file contains functions to get information related to other tab in DAT Tool

* DATE                  : 3-january-2025
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
* FUNCTION:		    HandleGetTabOtherInfoRequest
* DESCRIPTION:      handler for get other info request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetTabOtherInfoRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.GetTabGeneralInfoRequest
		apiResponse models.GetTabOtherInfoResponse
		// data        []map[string]interface{}
		// query       string
		// whereClause string
	)

	log.EnterFn(0, "HandleGetTabOtherInfoRequest")

	defer func() { log.ExitFn(0, "HandleGetTabOtherInfoRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get other info request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get other info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tab other info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get tab other info Request body", http.StatusInternalServerError, nil)
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

	// roofStructuralUpgrade, ok := data[0]["roof_structural_upgrade"].(string)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get roof structural upgrade from db : %+v\n", data)
	// }

	apiResponse = models.GetTabOtherInfoResponse{
		NewOrExisting:     "New",
		PanelBrand:        "Siemens",
		BusbarRating:      200,
		MainBreakerRating: 150,
		AvailableBackfeed: 50,
		RequiredBackfeed:  "100",

		SystemPhase:        "Single",
		SystemVoltage:      "120/240V",
		ServiceEntrance:    "Underground",
		ServiceRating:      "200A",
		MeterEnclosureType: "NEMA 3R",

		PVConductRun:            "25ft",
		DrywallCutNeeded:        "Yes",
		NumberOfStories:         2,
		TrenchingRequired:       "No",
		PointsOfInterconnection: 1,

		Type:                  "Grid-Tied",
		SupplyLoadSide:        "Load Side",
		Location:              "Garage",
		SubLocationTapDetails: "Main Panel",

		BackupType:     "Whole Home",
		TransferSwitch: "Automatic",
		FedBy:          "Main Panel",

		Inverter: "Fronius Primo",
		Max:      5000,
		Mppt1:    models.MpptInfo{S1: "10A", S2: "15A"},
		Mppt2:    models.MpptInfo{S1: "12A", S2: "14A"},
		Mppt3:    models.MpptInfo{S1: "11A", S2: "13A"},
		Mppt4:    models.MpptInfo{S1: "9A", S2: "12A"},
		Mppt5:    models.MpptInfo{S1: "10A", S2: "15A"},
		Mppt6:    models.MpptInfo{S1: "12A", S2: "14A"},
		Mppt7:    models.MpptInfo{S1: "11A", S2: "13A"},
		Mppt8:    models.MpptInfo{S1: "9A", S2: "12A"},

		TotalRoofArea:      "1000 sqft",
		AreaOfNewModules:   "500 sqft",
		AreaOfExstModules:  "300 sqft",
		CoveragePercentage: "80%",

		Length: "10m",
		Width:  "5m",
		Height: "3m",
		Other:  "N/A",

		ModuleQuantity:                       20,
		ModelNumber:                          "LG400N1C-A5",
		Wattage:                              "400W",
		ModuleArea:                           "2 sqm",
		Inverter1:                            models.InverterInfo{Quantity: 2, ModelNumber: "Sunny Boy 5.0", OutputA: "25A"},
		Inverter2:                            models.InverterInfo{Quantity: 1, ModelNumber: "Enphase IQ7+", OutputA: "15A"},
		ExistingCalculatedBackfeedWithout125: 75,
	}

	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, 0)

}
