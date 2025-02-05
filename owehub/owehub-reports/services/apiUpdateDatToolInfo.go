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

	if len(dataReq.GeneralValues.ProjectId) <= 0 {
		err = fmt.Errorf("invalid project ID %s", dataReq.GeneralValues.ProjectId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid project ID, update failed", http.StatusBadRequest, nil)
		return
	}
	/////////// GENERAL VALUES ///////////////////////////////////////////////////////////////////////////////////
	if dataReq.GeneralValues != nil {

		if len(dataReq.GeneralValues.ProjectName) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.ProjectName)
			updateFields = append(updateFields, fmt.Sprintf("project_name = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.ProjectId) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.ProjectId)
			updateFields = append(updateFields, fmt.Sprintf("project_id = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.ProjectAddress) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.ProjectAddress)
			updateFields = append(updateFields, fmt.Sprintf("project_address = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.PhoneNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.PhoneNumber)
			updateFields = append(updateFields, fmt.Sprintf("phone_number = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.EmailID) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.EmailID)
			updateFields = append(updateFields, fmt.Sprintf("email_id = $%d", len(whereEleList)))
		}
		if dataReq.GeneralValues.DATModuleQty > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATModuleQty)
			updateFields = append(updateFields, fmt.Sprintf("dat_module_qty = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATModuleType) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATModuleType)
			updateFields = append(updateFields, fmt.Sprintf("dat_module_type = $%d", len(whereEleList)))
		}
		if dataReq.GeneralValues.DATDesignVersion > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATDesignVersion)
			updateFields = append(updateFields, fmt.Sprintf("dat_design_version = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATDesignerName) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATDesignerName)
			updateFields = append(updateFields, fmt.Sprintf("dat_designer_name = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATAuroraId) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATAuroraId)
			updateFields = append(updateFields, fmt.Sprintf("dat_aurora_id = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATSysteSizeAC) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATSysteSizeAC)
			updateFields = append(updateFields, fmt.Sprintf("dat_system_size_ac = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATSysteSizeDC) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATSysteSizeDC)
			updateFields = append(updateFields, fmt.Sprintf("dat_system_size_dc = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATChanges) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATChanges)
			updateFields = append(updateFields, fmt.Sprintf("dat_changes = $%d", len(whereEleList)))
		}
		if len(dataReq.GeneralValues.DATChangeOrder) > 0 {
			whereEleList = append(whereEleList, dataReq.GeneralValues.DATChangeOrder)
			updateFields = append(updateFields, fmt.Sprintf("dat_change_order = $%d", len(whereEleList)))
		}
	}

	/////// STRUCTURAL VALUES ///////////////////////////////////////////////////////////////////////////////
	if dataReq.StructuralValues != nil {

		if len(dataReq.StructuralValues.Structure) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.Structure)
			updateFields = append(updateFields, fmt.Sprintf("structure = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofType)
			updateFields = append(updateFields, fmt.Sprintf("roof_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.SheathingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.SheathingType)
			updateFields = append(updateFields, fmt.Sprintf("sheathing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.FramingSize) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.FramingSize)
			updateFields = append(updateFields, fmt.Sprintf("framing_size = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.FramingType1) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.FramingType1)
			updateFields = append(updateFields, fmt.Sprintf("framing_type_1 = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.FramingType2) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.FramingType2)
			updateFields = append(updateFields, fmt.Sprintf("framing_type_2 = $%d", len(whereEleList)))
		}

		if dataReq.StructuralValues.FramingSpacing > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.FramingSpacing)
			updateFields = append(updateFields, fmt.Sprintf("framing_spacing = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.Attachment) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.Attachment)
			updateFields = append(updateFields, fmt.Sprintf("attachment = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.Racking) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.Racking)
			updateFields = append(updateFields, fmt.Sprintf("racking = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.Pattern) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.Pattern)
			updateFields = append(updateFields, fmt.Sprintf("pattern = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.Mount) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.Mount)
			updateFields = append(updateFields, fmt.Sprintf("mount = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.StructuralUpgrades) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.StructuralUpgrades)
			updateFields = append(updateFields, fmt.Sprintf("structural_upgrades = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.GmSupportType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.GmSupportType)
			updateFields = append(updateFields, fmt.Sprintf("gm_support_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.ReroofRequired) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.ReroofRequired)
			updateFields = append(updateFields, fmt.Sprintf("reroof_required = $%d", len(whereEleList)))
		}

		// Attachment Information
		if len(dataReq.StructuralValues.AttachmentType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.AttachmentType)
			updateFields = append(updateFields, fmt.Sprintf("attachment_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.AttachmentPattern) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.AttachmentPattern)
			updateFields = append(updateFields, fmt.Sprintf("attachment_pattern = $%d", len(whereEleList)))
		}

		if dataReq.StructuralValues.AttachmentQty > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.AttachmentQty)
			updateFields = append(updateFields, fmt.Sprintf("attachment_quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.AttachmentSpacing) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.AttachmentSpacing)
			updateFields = append(updateFields, fmt.Sprintf("attachment_spacing = $%d", len(whereEleList)))
		}

		// Racking Information
		if len(dataReq.StructuralValues.RackingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RackingType)
			updateFields = append(updateFields, fmt.Sprintf("racking_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RackingMountType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RackingMountType)
			updateFields = append(updateFields, fmt.Sprintf("racking_mount_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RackingTiltInfo) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RackingTiltInfo)
			updateFields = append(updateFields, fmt.Sprintf("racking_title_info = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RackingMaxRailCantilever) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RackingMaxRailCantilever)
			updateFields = append(updateFields, fmt.Sprintf("racking_max_rail_cantilever = $%d", len(whereEleList)))
		}

		// Roof Structure
		if len(dataReq.StructuralValues.RoofFramingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofFramingType)
			updateFields = append(updateFields, fmt.Sprintf("roof_framing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofSize) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofSize)
			updateFields = append(updateFields, fmt.Sprintf("roof_size = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofSpacing) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofSpacing)
			updateFields = append(updateFields, fmt.Sprintf("roof_spacing = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofSheathingType) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofSheathingType)
			updateFields = append(updateFields, fmt.Sprintf("roof_sheathing_type = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofMaterial) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofMaterial)
			updateFields = append(updateFields, fmt.Sprintf("roof_material = $%d", len(whereEleList)))
		}

		if len(dataReq.StructuralValues.RoofStructuralUpgrade) > 0 {
			whereEleList = append(whereEleList, dataReq.StructuralValues.RoofStructuralUpgrade)
			updateFields = append(updateFields, fmt.Sprintf("roof_structural_upgrade = $%d", len(whereEleList)))
		}

	}
	/////// ADDER VALUES /////////////////////////////////////////////////////////////////////////////////
	if dataReq.AdderValues != nil {
		// if len(dataReq.AdderValues.CategoryTitle) > 0 {
		// 	whereEleList = append(whereEleList, dataReq.AdderValues.CategoryTitle)
		// 	updateFields = append(updateFields, fmt.Sprintf("category_title = $%d", len(whereEleList)))
		// }

		// if len(dataReq.AdderValues.ComponentName) > 0 {
		// 	whereEleList = append(whereEleList, dataReq.AdderValues.ComponentName)
		// 	updateFields = append(updateFields, fmt.Sprintf("component_name = $%d", len(whereEleList)))
		// }

		if dataReq.AdderValues.NewQuantity > 0 {
			whereEleList = append(whereEleList, dataReq.AdderValues.NewQuantity)
			updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))
		}

		// calculate total cost and save it in database
		// update total adders value in database
	}

	////////// OTHER VALUES //////////////////////////////////////////////////////////////////////////
	if dataReq.OtherValues != nil {
		////////// EQUIPMENT INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.Equipment.NewOrExisting) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.NewOrExisting)
			updateFields = append(updateFields, fmt.Sprintf("new_or_existing = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.Equipment.PanelBrand) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.PanelBrand)
			updateFields = append(updateFields, fmt.Sprintf("panel_brand = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.Equipment.BusbarRating > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.BusbarRating)
			updateFields = append(updateFields, fmt.Sprintf("busbar_rating = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.Equipment.MainBreakerRating > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.MainBreakerRating)
			updateFields = append(updateFields, fmt.Sprintf("main_breaker_rating = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.Equipment.AvailableBackfeed > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.AvailableBackfeed)
			updateFields = append(updateFields, fmt.Sprintf("available_backfeed = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.Equipment.RequiredBackfeed) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Equipment.RequiredBackfeed)
			updateFields = append(updateFields, fmt.Sprintf("required_backfeed = $%d", len(whereEleList)))
		}

		///////// SYSTEM INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.System.SystemPhase) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.System.SystemPhase)
			updateFields = append(updateFields, fmt.Sprintf("system_phase = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.System.SystemVoltage) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.System.SystemVoltage)
			updateFields = append(updateFields, fmt.Sprintf("system_voltage = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.System.ServiceEntrance) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.System.ServiceEntrance)
			updateFields = append(updateFields, fmt.Sprintf("service_entrance = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.System.ServiceRating) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.System.ServiceRating)
			updateFields = append(updateFields, fmt.Sprintf("service_rating = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.System.MeterEnclosureType) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.System.MeterEnclosureType)
			updateFields = append(updateFields, fmt.Sprintf("meter_enclosure_type = $%d", len(whereEleList)))
		}

		////////// SiteInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.SiteInfo.PVConductRun) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.SiteInfo.PVConductRun)
			updateFields = append(updateFields, fmt.Sprintf("pv_conduct_run = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.SiteInfo.DrywallCutNeeded) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.SiteInfo.DrywallCutNeeded)
			updateFields = append(updateFields, fmt.Sprintf("drywall_cut_needed = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.SiteInfo.NumberOfStories > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.SiteInfo.NumberOfStories)
			updateFields = append(updateFields, fmt.Sprintf("number_of_stories = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.SiteInfo.TrenchingRequired) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.SiteInfo.TrenchingRequired)
			updateFields = append(updateFields, fmt.Sprintf("trenching_required = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.SiteInfo.PointsOfInterconnection > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.SiteInfo.PointsOfInterconnection)
			updateFields = append(updateFields, fmt.Sprintf("points_of_interconnection = $%d", len(whereEleList)))
		}
		////// PV INFO >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.PvInterconnection.Type) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.PvInterconnection.Type)
			updateFields = append(updateFields, fmt.Sprintf("type = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.PvInterconnection.SupplyLoadSide) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.PvInterconnection.SupplyLoadSide)
			updateFields = append(updateFields, fmt.Sprintf("supply_load_side = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.PvInterconnection.Location) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.PvInterconnection.Location)
			updateFields = append(updateFields, fmt.Sprintf("location = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.PvInterconnection.SubLocationTapDetails) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.PvInterconnection.SubLocationTapDetails)
			updateFields = append(updateFields, fmt.Sprintf("sub_location_tap_details = $%d", len(whereEleList)))
		}
		//////////// EssInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.EssInterconnection.BackupType) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.EssInterconnection.BackupType)
			updateFields = append(updateFields, fmt.Sprintf("backup_type = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.EssInterconnection.TransferSwitch) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.EssInterconnection.TransferSwitch)
			updateFields = append(updateFields, fmt.Sprintf("transfer_switch = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.EssInterconnection.FedBy) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.EssInterconnection.FedBy)
			updateFields = append(updateFields, fmt.Sprintf("fed_by = $%d", len(whereEleList)))
		}
		////////// InverterConfigInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.InverterConfigParent.Inverter) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Inverter)
			updateFields = append(updateFields, fmt.Sprintf("inverter = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.InverterConfigParent.Max > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Max)
			updateFields = append(updateFields, fmt.Sprintf("max = $%d", len(whereEleList)))
		}

		// Handling MPPTs
		// MPPTs 1
		if len(dataReq.OtherValues.InverterConfigParent.Mppt1.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt1.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt1.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt1.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 2
		if len(dataReq.OtherValues.InverterConfigParent.Mppt2.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt2.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt2.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt2.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 3
		if len(dataReq.OtherValues.InverterConfigParent.Mppt3.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt3.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt3.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt3.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 4
		if len(dataReq.OtherValues.InverterConfigParent.Mppt4.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt4.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt4.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt4.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 5
		if len(dataReq.OtherValues.InverterConfigParent.Mppt5.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt5.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt5.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt5.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 6
		if len(dataReq.OtherValues.InverterConfigParent.Mppt6.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt6.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt6.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt6.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 7
		if len(dataReq.OtherValues.InverterConfigParent.Mppt7.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt7.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt7.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt7.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}
		// MPPTs 8
		if len(dataReq.OtherValues.InverterConfigParent.Mppt8.S1) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt8.S1)
			updateFields = append(updateFields, fmt.Sprintf("mppt1 = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.InverterConfigParent.Mppt8.S2) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.InverterConfigParent.Mppt8.S2)
			updateFields = append(updateFields, fmt.Sprintf("mppt2 = $%d", len(whereEleList)))
		}

		////////// RoofInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.RoofCoverage.TotalRoofArea) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.RoofCoverage.TotalRoofArea)
			updateFields = append(updateFields, fmt.Sprintf("total_roof_area = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.RoofCoverage.AreaOfNewModules) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.RoofCoverage.AreaOfNewModules)
			updateFields = append(updateFields, fmt.Sprintf("area_of_new_modules = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.RoofCoverage.AreaOfExstModules) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.RoofCoverage.AreaOfExstModules)
			updateFields = append(updateFields, fmt.Sprintf("area_of_exst_modules = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.RoofCoverage.CoveragePercentage) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.RoofCoverage.CoveragePercentage)
			updateFields = append(updateFields, fmt.Sprintf("coverage_percentage = $%d", len(whereEleList)))
		}
		////// MeasurementInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if len(dataReq.OtherValues.Measurement.Length) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Measurement.Length)
			updateFields = append(updateFields, fmt.Sprintf("length = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.Measurement.Width) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Measurement.Width)
			updateFields = append(updateFields, fmt.Sprintf("width = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.Measurement.Height) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Measurement.Height)
			updateFields = append(updateFields, fmt.Sprintf("height = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.Measurement.Other) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.Measurement.Other)
			updateFields = append(updateFields, fmt.Sprintf("other = $%d", len(whereEleList)))
		}
		//////////// ExistingPvInfo >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
		if dataReq.OtherValues.ExistingPV.ModuleQuantity > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.ModuleQuantity)
			updateFields = append(updateFields, fmt.Sprintf("module_quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.ExistingPV.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.ExistingPV.Wattage) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Wattage)
			updateFields = append(updateFields, fmt.Sprintf("wattage = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.ExistingPV.ModuleArea) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.ModuleArea)
			updateFields = append(updateFields, fmt.Sprintf("module_area = $%d", len(whereEleList)))
		}

		//// INVERTER 1 ///////////////////////
		if dataReq.OtherValues.ExistingPV.Inverter1.Quantity > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter1.Quantity)
			updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.ExistingPV.Inverter1.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter1.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}
		if len(dataReq.OtherValues.ExistingPV.Inverter1.OutputA) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter1.OutputA)
			updateFields = append(updateFields, fmt.Sprintf("output_a = $%d", len(whereEleList)))
		}

		//// INVERTER 2 ///////////////////////

		if dataReq.OtherValues.ExistingPV.Inverter2.Quantity > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter2.Quantity)
			updateFields = append(updateFields, fmt.Sprintf("quantity = $%d", len(whereEleList)))
		}

		if len(dataReq.OtherValues.ExistingPV.Inverter2.ModelNumber) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter2.ModelNumber)
			updateFields = append(updateFields, fmt.Sprintf("model_number = $%d", len(whereEleList)))
		}
		if len(dataReq.OtherValues.ExistingPV.Inverter2.OutputA) > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.Inverter2.OutputA)
			updateFields = append(updateFields, fmt.Sprintf("output_a = $%d", len(whereEleList)))
		}

		if dataReq.OtherValues.ExistingPV.ExistingCalculatedBackfeedWithout125 > 0 {
			whereEleList = append(whereEleList, dataReq.OtherValues.ExistingPV.ExistingCalculatedBackfeedWithout125)
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
