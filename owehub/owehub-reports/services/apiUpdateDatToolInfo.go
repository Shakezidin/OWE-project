/**************************************************************************
* File                  : apiUpdateDatToolInfo.go
* DESCRIPTION           : This file contains functions to update Dat tool Info request

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
	// "strings"
)

/******************************************************************************
* FUNCTION:		    HandleUpdateDatToolRequest
* DESCRIPTION:      handler for update Dat Tool data request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleUpdateDatToolRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err     error
		dataReq models.UpdateDatToolInfo
		//apiResponse      []models.GetProjectListResponse
		// data             []map[string]interface{}
		// query            string
		whereEleList []interface{}
		updateFields []string
		recordCount  int64
		// paginationClause string
		// sortValue        string
	)

	log.EnterFn(0, "HandleUpdateDatToolRequest")

	defer func() { log.ExitFn(0, "HandleUpdateDatToolRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in update project list request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from update project list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal update project list request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal update project list Request body", http.StatusInternalServerError, nil)
		return
	}

	if len(dataReq.ProjectId) <= 0 {
		err = fmt.Errorf("invalid project ID %s", dataReq.ProjectId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid project ID, update failed", http.StatusBadRequest, nil)
		return
	}
	/////////// GENERAL VALUES ///////////////////////////////////////////////////////////////////////////////////
	// if dataReq.GeneraBasics != nil {

	// 	if len(dataReq.GeneraBasics.ProjectAddress) > 0 {
	// 		whereEleList = append(whereEleList, dataReq.GeneraBasics.ProjectAddress)
	// 		updateFields = append(updateFields, fmt.Sprintf("project_address = $%d", len(whereEleList)))
	// 	}
	// 	if len(dataReq.GeneraBasics.PhoneNumber) > 0 {
	// 		whereEleList = append(whereEleList, dataReq.GeneraBasics.PhoneNumber)
	// 		updateFields = append(updateFields, fmt.Sprintf("phone_number = $%d", len(whereEleList)))
	// 	}
	// 	if len(dataReq.GeneraBasics.EmailID) > 0 {
	// 		whereEleList = append(whereEleList, dataReq.GeneraBasics.EmailID)
	// 		updateFields = append(updateFields, fmt.Sprintf("email_id = $%d", len(whereEleList)))
	// 	}
	// }
	if dataReq.GeneralDatInformation != nil {
		if dataReq.GeneralDatInformation.DATModuleQty > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATModuleQty)
			updateFields = append(updateFields, fmt.Sprintf("dat_module_qty = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATModuleType) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATModuleType)
			updateFields = append(updateFields, fmt.Sprintf("dat_module_type = $%d", len(whereEleList)))
		}
		if dataReq.GeneralDatInformation.DATDesignVersion > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATDesignVersion)
			updateFields = append(updateFields, fmt.Sprintf("dat_design_version = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATDesignerName) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATDesignerName)
			updateFields = append(updateFields, fmt.Sprintf("dat_designer_name = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATAuroraId) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATAuroraId)
			updateFields = append(updateFields, fmt.Sprintf("dat_aurora_id = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATSysteSizeAC) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATSysteSizeAC)
			updateFields = append(updateFields, fmt.Sprintf("dat_system_size_ac = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATSysteSizeDC) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATSysteSizeDC)
			updateFields = append(updateFields, fmt.Sprintf("dat_system_size_dc = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATInverterType) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATInverterType)
			updateFields = append(updateFields, fmt.Sprintf("dat_inverter_type = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATBatteryType) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATBatteryType)
			updateFields = append(updateFields, fmt.Sprintf("dat_battery_type = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATSiteCaptureUrl) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATSiteCaptureUrl)
			updateFields = append(updateFields, fmt.Sprintf("dat_site_capture_url = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATChangeLayout) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATChangeLayout)
			updateFields = append(updateFields, fmt.Sprintf("dat_changes = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATChangeProduction) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATChangeProduction)
			updateFields = append(updateFields, fmt.Sprintf("dat_changes = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralDatInformation.DATChangeOrderRequired) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralDatInformation.DATChangeOrderRequired)
			updateFields = append(updateFields, fmt.Sprintf("dat_change_order = $%d", len(whereEleList)))
		}
	}

	/////// STRUCTURAL VALUES ///////////////////////////////////////////////////////////////////////////////

	if dataReq.StructuralInfo != nil {

		if len(dataReq.StructuralState) <= 0 {
			err = fmt.Errorf("invalid structural State %s", dataReq.StructuralState)
			log.FuncErrorTrace(0, "%v", err)
			appserver.FormAndSendHttpResp(resp, "Invalid structural state, update failed", http.StatusBadRequest, nil)
			return
		}

		if len(dataReq.StructuralInfo.Structure) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.Structure)
			updateFields = append(updateFields, fmt.Sprintf("structure = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.RoofType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.RoofType)
			updateFields = append(updateFields, fmt.Sprintf("roof_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.SheathingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.SheathingType)
			updateFields = append(updateFields, fmt.Sprintf("sheathing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.FramingSize) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.FramingSize)
			updateFields = append(updateFields, fmt.Sprintf("framing_size = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.StructuralRoofMaterial) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.StructuralRoofMaterial)
			updateFields = append(updateFields, fmt.Sprintf("framing_type_1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.FramingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.FramingType)
			updateFields = append(updateFields, fmt.Sprintf("framing_type_2 = $%d", len(whereEleList)))
		}

		if dataReq.StructuralInfo.FramingSpacing > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.FramingSpacing)
			updateFields = append(updateFields, fmt.Sprintf("framing_spacing = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.Attachment) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.Attachment)
			updateFields = append(updateFields, fmt.Sprintf("attachment = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.Racking) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.Racking)
			updateFields = append(updateFields, fmt.Sprintf("racking = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.Pattern) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.Pattern)
			updateFields = append(updateFields, fmt.Sprintf("pattern = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.Mount) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.Mount)
			updateFields = append(updateFields, fmt.Sprintf("mount = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.StructuralUpgrades) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.StructuralUpgrades)
			updateFields = append(updateFields, fmt.Sprintf("structural_upgrades = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.GmSupportType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.GmSupportType)
			updateFields = append(updateFields, fmt.Sprintf("gm_support_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralInfo.ReroofRequired) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralInfo.ReroofRequired)
			updateFields = append(updateFields, fmt.Sprintf("reroof_required = $%d", len(whereEleList)))
		}
	}
	if dataReq.Attachment != nil {
		// Attachment Information
		if len(dataReq.Attachment.AttachmentType) > 0 {
			whereEleList = append(whereEleList, dataReq.Attachment.AttachmentType)
			updateFields = append(updateFields, fmt.Sprintf("attachment_type = $%d", len(whereEleList)))
		}

		if len(dataReq.Attachment.AttachmentPattern) > 0 {
			whereEleList = append(whereEleList, dataReq.Attachment.AttachmentPattern)
			updateFields = append(updateFields, fmt.Sprintf("attachment_pattern = $%d", len(whereEleList)))
		}

		if dataReq.Attachment.AttachmentQty > 0 {
			whereEleList = append(whereEleList, dataReq.Attachment.AttachmentQty)
			updateFields = append(updateFields, fmt.Sprintf("attachment_quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.Attachment.AttachmentSpacing) > 0 {
			whereEleList = append(whereEleList, dataReq.Attachment.AttachmentSpacing)
			updateFields = append(updateFields, fmt.Sprintf("attachment_spacing = $%d", len(whereEleList)))
		}
	}
	if dataReq.Racking != nil {
		// Racking Information
		if len(dataReq.Racking.RackingType) > 0 {
			whereEleList = append(whereEleList, dataReq.Racking.RackingType)
			updateFields = append(updateFields, fmt.Sprintf("racking_type = $%d", len(whereEleList)))
		}

		if len(dataReq.Racking.RackingMountType) > 0 {
			whereEleList = append(whereEleList, dataReq.Racking.RackingMountType)
			updateFields = append(updateFields, fmt.Sprintf("racking_mount_type = $%d", len(whereEleList)))
		}

		if len(dataReq.Racking.RackingTiltInfo) > 0 {
			whereEleList = append(whereEleList, dataReq.Racking.RackingTiltInfo)
			updateFields = append(updateFields, fmt.Sprintf("racking_title_info = $%d", len(whereEleList)))
		}

		if len(dataReq.Racking.RackingMaxRailCantilever) > 0 {
			whereEleList = append(whereEleList, dataReq.Racking.RackingMaxRailCantilever)
			updateFields = append(updateFields, fmt.Sprintf("racking_max_rail_cantilever = $%d", len(whereEleList)))
		}
	}
	if dataReq.RoofStructure != nil {
		// Roof Structure
		if len(dataReq.RoofStructure.RoofFramingType) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofFramingType)
			updateFields = append(updateFields, fmt.Sprintf("roof_framing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofStructure.RoofSize) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofSize)
			updateFields = append(updateFields, fmt.Sprintf("roof_size = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofStructure.RoofSpacing) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofSpacing)
			updateFields = append(updateFields, fmt.Sprintf("roof_spacing = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofStructure.RoofSheathingType) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofSheathingType)
			updateFields = append(updateFields, fmt.Sprintf("roof_sheathing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofStructure.RoofMaterial) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofMaterial)
			updateFields = append(updateFields, fmt.Sprintf("roof_material = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofStructure.RoofStructuralUpgrade) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofStructure.RoofStructuralUpgrade)
			updateFields = append(updateFields, fmt.Sprintf("roof_structural_upgrade = $%d", len(whereEleList)))
		}

	}
	/////// ADDER VALUES /////////////////////////////////////////////////////////////////////////////////
	if dataReq.AdderValues != nil {
		// Loop through each component update
		for _, componentUpdate := range dataReq.AdderValues.ComponentUpdates {
			// Check if NewQuantity is greater than 0
			if componentUpdate.NewQuantity > 0 {
				// Append the new quantity for this component to the whereEleList
				whereEleList = append(whereEleList, componentUpdate.NewQuantity)

				// Add the corresponding SQL update field for this component's quantity
				updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))

				// If you want to track the component name as well, you can append it as needed
				// Append the component name to the whereEleList (if needed for your SQL condition)
				// whereEleList = append(whereEleList, componentUpdate.ComponentName)

				// // Add the corresponding SQL update field for the component name
				// updateFields = append(updateFields, fmt.Sprintf("component_name = $%d", len(whereEleList)))
			}
		}
		// calculate total cost and save it in database
		// update total adders value in database
	}

	////////// OTHER VALUES //////////////////////////////////////////////////////////////////////////
	if dataReq.ElectricalEquipmentInfo != nil {
		////////// EQUIPMENT INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.ElectricalEquipmentInfo.NewOrExisting) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.NewOrExisting)
			updateFields = append(updateFields, fmt.Sprintf("new_or_existing = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalEquipmentInfo.PanelBrand) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.PanelBrand)
			updateFields = append(updateFields, fmt.Sprintf("panel_brand = $%d", len(whereEleList)))
		}

		if dataReq.ElectricalEquipmentInfo.BusbarRating > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.BusbarRating)
			updateFields = append(updateFields, fmt.Sprintf("busbar_rating = $%d", len(whereEleList)))
		}

		if dataReq.ElectricalEquipmentInfo.MainBreakerRating > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.MainBreakerRating)
			updateFields = append(updateFields, fmt.Sprintf("main_breaker_rating = $%d", len(whereEleList)))
		}

		if dataReq.ElectricalEquipmentInfo.AvailableBackfeed > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.AvailableBackfeed)
			updateFields = append(updateFields, fmt.Sprintf("available_backfeed = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalEquipmentInfo.RequiredBackfeed) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalEquipmentInfo.RequiredBackfeed)
			updateFields = append(updateFields, fmt.Sprintf("required_backfeed = $%d", len(whereEleList)))
		}
	}
	if dataReq.ElectricalSystemInfo != nil {
		///////// SYSTEM INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.ElectricalSystemInfo.SystemPhase) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalSystemInfo.SystemPhase)
			updateFields = append(updateFields, fmt.Sprintf("system_phase = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalSystemInfo.SystemVoltage) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalSystemInfo.SystemVoltage)
			updateFields = append(updateFields, fmt.Sprintf("system_voltage = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalSystemInfo.ServiceEntrance) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalSystemInfo.ServiceEntrance)
			updateFields = append(updateFields, fmt.Sprintf("service_entrance = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalSystemInfo.ServiceRating) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalSystemInfo.ServiceRating)
			updateFields = append(updateFields, fmt.Sprintf("service_rating = $%d", len(whereEleList)))
		}

		if len(dataReq.ElectricalSystemInfo.MeterEnclosureType) > 0 {
			whereEleList = append(whereEleList, dataReq.ElectricalSystemInfo.MeterEnclosureType)
			updateFields = append(updateFields, fmt.Sprintf("meter_enclosure_type = $%d", len(whereEleList)))
		}
	}
	if dataReq.SiteInfoRequest != nil {
		////////// SiteInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.SiteInfoRequest.PVConductRun) > 0 {
			whereEleList = append(whereEleList, dataReq.SiteInfoRequest.PVConductRun)
			updateFields = append(updateFields, fmt.Sprintf("pv_conduct_run = $%d", len(whereEleList)))
		}

		if len(dataReq.SiteInfoRequest.DrywallCutNeeded) > 0 {
			whereEleList = append(whereEleList, dataReq.SiteInfoRequest.DrywallCutNeeded)
			updateFields = append(updateFields, fmt.Sprintf("drywall_cut_needed = $%d", len(whereEleList)))
		}

		if dataReq.SiteInfoRequest.NumberOfStories > 0 {
			whereEleList = append(whereEleList, dataReq.SiteInfoRequest.NumberOfStories)
			updateFields = append(updateFields, fmt.Sprintf("number_of_stories = $%d", len(whereEleList)))
		}

		if len(dataReq.SiteInfoRequest.TrenchingRequired) > 0 {
			whereEleList = append(whereEleList, dataReq.SiteInfoRequest.TrenchingRequired)
			updateFields = append(updateFields, fmt.Sprintf("trenching_required = $%d", len(whereEleList)))
		}

		if dataReq.SiteInfoRequest.PointsOfInterconnection > 0 {
			whereEleList = append(whereEleList, dataReq.SiteInfoRequest.PointsOfInterconnection)
			updateFields = append(updateFields, fmt.Sprintf("points_of_interconnection = $%d", len(whereEleList)))
		}
	}
	if dataReq.PvOnlyInterconnection != nil {
		////// PV INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.PvOnlyInterconnection.Type) > 0 {
			whereEleList = append(whereEleList, dataReq.PvOnlyInterconnection.Type)
			updateFields = append(updateFields, fmt.Sprintf("type = $%d", len(whereEleList)))
		}

		if len(dataReq.PvOnlyInterconnection.SupplyLoadSide) > 0 {
			whereEleList = append(whereEleList, dataReq.PvOnlyInterconnection.SupplyLoadSide)
			updateFields = append(updateFields, fmt.Sprintf("supply_load_side = $%d", len(whereEleList)))
		}

		if len(dataReq.PvOnlyInterconnection.Location) > 0 {
			whereEleList = append(whereEleList, dataReq.PvOnlyInterconnection.Location)
			updateFields = append(updateFields, fmt.Sprintf("location = $%d", len(whereEleList)))
		}

		if len(dataReq.PvOnlyInterconnection.SubLocationTapDetails) > 0 {
			whereEleList = append(whereEleList, dataReq.PvOnlyInterconnection.SubLocationTapDetails)
			updateFields = append(updateFields, fmt.Sprintf("sub_location_tap_details = $%d", len(whereEleList)))
		}
	}
	if dataReq.EssInterconnection != nil {
		//////////// EssInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.EssInterconnection.BackupType) > 0 {
			whereEleList = append(whereEleList, dataReq.EssInterconnection.BackupType)
			updateFields = append(updateFields, fmt.Sprintf("backup_type = $%d", len(whereEleList)))
		}

		if len(dataReq.EssInterconnection.TransferSwitch) > 0 {
			whereEleList = append(whereEleList, dataReq.EssInterconnection.TransferSwitch)
			updateFields = append(updateFields, fmt.Sprintf("transfer_switch = $%d", len(whereEleList)))
		}

		if len(dataReq.EssInterconnection.FedBy) > 0 {
			whereEleList = append(whereEleList, dataReq.EssInterconnection.FedBy)
			updateFields = append(updateFields, fmt.Sprintf("fed_by = $%d", len(whereEleList)))
		}
	}
	if dataReq.StringInverterConfiguration != nil {
		////////// InverterConfigInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.StringInverterConfiguration.Inverter) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Inverter)
			updateFields = append(updateFields, fmt.Sprintf("inverter = $%d", len(whereEleList)))
		}

		if dataReq.StringInverterConfiguration.Max > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Max)
			updateFields = append(updateFields, fmt.Sprintf("max = $%d", len(whereEleList)))
		}

		// Handling MPPTs
		// MPPTs 1
		if len(dataReq.StringInverterConfiguration.Mppt1.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt1.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt1.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt1.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 2
		if len(dataReq.StringInverterConfiguration.Mppt2.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt2.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt2.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt2.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 3
		if len(dataReq.StringInverterConfiguration.Mppt3.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt3.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt3.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt3.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 4
		if len(dataReq.StringInverterConfiguration.Mppt4.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt4.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt4.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt4.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 5
		if len(dataReq.StringInverterConfiguration.Mppt5.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt5.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt5.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt5.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 6
		if len(dataReq.StringInverterConfiguration.Mppt6.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt6.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt6.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt6.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 7
		if len(dataReq.StringInverterConfiguration.Mppt7.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt7.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt7.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt7.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 8
		if len(dataReq.StringInverterConfiguration.Mppt8.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt8.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StringInverterConfiguration.Mppt8.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.StringInverterConfiguration.Mppt8.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
	}
	if dataReq.RoofCoverageCalculator != nil {
		////////// RoofInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.RoofCoverageCalculator.TotalRoofArea) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofCoverageCalculator.TotalRoofArea)
			updateFields = append(updateFields, fmt.Sprintf("total_roof_area = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofCoverageCalculator.AreaOfNewModules) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofCoverageCalculator.AreaOfNewModules)
			updateFields = append(updateFields, fmt.Sprintf("area_of_new_modules = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofCoverageCalculator.AreaOfExstModules) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofCoverageCalculator.AreaOfExstModules)
			updateFields = append(updateFields, fmt.Sprintf("area_of_exst_modules = $%d", len(whereEleList)))
		}

		if len(dataReq.RoofCoverageCalculator.CoveragePercentage) > 0 {
			whereEleList = append(whereEleList, dataReq.RoofCoverageCalculator.CoveragePercentage)
			updateFields = append(updateFields, fmt.Sprintf("coverage_percentage = $%d", len(whereEleList)))
		}
	}
	if dataReq.MeasurementConversion != nil {
		////// MeasurementInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.MeasurementConversion.Length) > 0 {
			whereEleList = append(whereEleList, dataReq.MeasurementConversion.Length)
			updateFields = append(updateFields, fmt.Sprintf("length = $%d", len(whereEleList)))
		}

		if len(dataReq.MeasurementConversion.Width) > 0 {
			whereEleList = append(whereEleList, dataReq.MeasurementConversion.Width)
			updateFields = append(updateFields, fmt.Sprintf("width = $%d", len(whereEleList)))
		}

		if len(dataReq.MeasurementConversion.Height) > 0 {
			whereEleList = append(whereEleList, dataReq.MeasurementConversion.Height)
			updateFields = append(updateFields, fmt.Sprintf("height = $%d", len(whereEleList)))
		}

		if len(dataReq.MeasurementConversion.Other) > 0 {
			whereEleList = append(whereEleList, dataReq.MeasurementConversion.Other)
			updateFields = append(updateFields, fmt.Sprintf("other = $%d", len(whereEleList)))
		}
	}
	if dataReq.ExistingPvSystemInfo != nil {
		//////////// ExistingPvInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if dataReq.ExistingPvSystemInfo.ModuleQuantity > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.ModuleQuantity)
			updateFields = append(updateFields, fmt.Sprintf("module_quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.ExistingPvSystemInfo.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}

		if len(dataReq.ExistingPvSystemInfo.Wattage) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Wattage)
			updateFields = append(updateFields, fmt.Sprintf("wattage = $%d", len(whereEleList)))
		}

		if len(dataReq.ExistingPvSystemInfo.ModuleArea) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.ModuleArea)
			updateFields = append(updateFields, fmt.Sprintf("module_area = $%d", len(whereEleList)))
		}

		//// INVERTER 1 ///////////////////////
		if dataReq.ExistingPvSystemInfo.Inverter1.Quantity > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter1.Quantity)
			updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.ExistingPvSystemInfo.Inverter1.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter1.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}
		if len(dataReq.ExistingPvSystemInfo.Inverter1.OutputA) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter1.OutputA)
			updateFields = append(updateFields, fmt.Sprintf("output_a = $%d", len(whereEleList)))
		}

		//// INVERTER 2 ///////////////////////

		if dataReq.ExistingPvSystemInfo.Inverter2.Quantity > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter2.Quantity)
			updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.ExistingPvSystemInfo.Inverter2.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter2.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}
		if len(dataReq.ExistingPvSystemInfo.Inverter2.OutputA) > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.Inverter2.OutputA)
			updateFields = append(updateFields, fmt.Sprintf("output_a = $%d", len(whereEleList)))
		}

		if dataReq.ExistingPvSystemInfo.ExistingCalculatedBackfeedWithout125 > 0 {
			whereEleList = append(whereEleList, dataReq.ExistingPvSystemInfo.ExistingCalculatedBackfeedWithout125)
			updateFields = append(updateFields, fmt.Sprintf("existing_calculated_backfeed_without_125 = $%d", len(whereEleList)))
		}
	}
	//////////// NotesValues ///////////////////////////////////////////////////
	if dataReq.NotesValues != nil {
		if len(dataReq.NotesValues.Title) > 0 {
			whereEleList = append(whereEleList, dataReq.NotesValues.Title)
			updateFields = append(updateFields, fmt.Sprintf("title = $%d", len(whereEleList)))
		}

		// Iterate over the Description (which is a slice of Note)
		for _, note := range dataReq.NotesValues.Description {
			if len(note.Note) > 0 {
				whereEleList = append(whereEleList, note.Note)
				updateFields = append(updateFields, fmt.Sprintf("note = $%d", len(whereEleList)))
			}
			if !note.CreatedAt.IsZero() { // Check if CreatedAt is a valid timestamp
				whereEleList = append(whereEleList, note.CreatedAt)
				updateFields = append(updateFields, fmt.Sprintf("created_at = $%d", len(whereEleList)))
			}
		}
	}

	if len(updateFields) == 0 {
		err = fmt.Errorf("no fields provided to update")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "No fields provided to update", http.StatusBadRequest, nil)
		return
	}

	whereEleList = append(whereEleList, dataReq.ProjectId)

	// query
	//query = fmt.Sprintf("UPDATE leads_info SET %s WHERE leads_id = $%d", strings.Join(updateFields, ", "), len(whereEleList))

	//err, res := db.UpdateDataInDB(db.OweHubDbIndex, query, whereEleList)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update data err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to update data", http.StatusBadRequest, nil)
		return
	}

	// if res == 0 {
	// 	log.FuncErrorTrace(0, "No rows updated for lead details: %v", err)
	// 	appserver.FormAndSendHttpResp(resp, "No rows were updated", http.StatusInternalServerError, nil)
	// 	return
	// }

	appserver.FormAndSendHttpResp(resp, "Project Data saved successfully", http.StatusOK, nil, recordCount)
}
