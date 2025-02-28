/**************************************************************************
* File                  : apiGetTabGeneralInfo.go
* DESCRIPTION           : This file contains functions to get information related to general tab in DAT Tool

* DATE                  : 24-january-2025
**************************************************************************/

package services

import (
	auroraclient "OWEApp/owehub-reports/auroraclients"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

/******************************************************************************
* FUNCTION:		    HandleGetTabGeneralInfoRequest
* DESCRIPTION:      handler for get tab general info request
* INPUT:			resp, req
* RETURNS:    		void
******************************************************************************/

func HandleGetTabGeneralInfoRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err         error
		dataReq     models.GetTabGeneralInfoRequest
		apiResponse models.GetTabGeneralInfoResponse
		data        []map[string]interface{}
		query       string
		whereClause string
		//dataReqAurora models.AuroraRetrieveDesignSummaryRequest
		auroraApiResp interface{}
	)

	log.EnterFn(0, "HandleGetTabGeneralInfoRequest")

	defer func() { log.ExitFn(0, "HandleGetTabGeneralInfoRequest", err) }()

	if req.Body == nil {
		err = fmt.Errorf("HTTP Request body is null in get tab general info request")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "HTTP Request body is null", http.StatusBadRequest, nil)
		return
	}

	reqBody, err := ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get tab general info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get tab genral info request err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get tab genreal info Request body", http.StatusInternalServerError, nil)
		return
	}

	if len(dataReq.ProjectId) <= 0 {
		err = fmt.Errorf("invalid project ID %s", dataReq.ProjectId)
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "Invalid project ID, update failed", http.StatusBadRequest, nil)
		return
	}

	//get aurora retrieve design summary
	retrieveAuroraDesignSummaryApi := auroraclient.RetrieveDesignSummaryApi{
		Id: dataReq.Id,
	}

	auroraApiResp, err = retrieveAuroraDesignSummaryApi.Call()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve aurora design summary err %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusInternalServerError, nil)
		return
	}

	// Convert auroraApiResp to JSON for easier manipulation
	auroraRespBytes, err := json.Marshal(auroraApiResp)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to marshal aurora response err %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to process aurora response", http.StatusInternalServerError, nil)
		return
	}

	// Convert JSON to map for easy access
	var auroraRespMap map[string]interface{}
	err = json.Unmarshal(auroraRespBytes, &auroraRespMap)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse aurora response err %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to parse aurora response", http.StatusInternalServerError, nil)
		return
	}

	// Extract only annual production from aurora
	//var extractedData map[string]interface{}
	var pTotalProduction interface{}

	if design, ok := auroraRespMap["design"].(map[string]interface{}); ok {
		if energyProduction, exists := design["energy_production"].(map[string]interface{}); exists {
			if annual, found := energyProduction["annual"]; found {
				// extractedData = map[string]interface{}{
				// 	"annual": annual,
				// }
				if annualValue, ok := annual.(float64); ok {
					pTotalProduction = annualValue
				} else if annualValue, ok := annual.(int); ok {
					pTotalProduction = float64(annualValue) // ✅ Convert int to float64
				}
			}
		}
	}

	whereClause = fmt.Sprintf("WHERE (c.unique_id = '%s')", dataReq.ProjectId)

	// query to fetch data
	query = fmt.Sprintf(`
			SELECT
			--general info
				c.customer_name,
				c.unique_id,
				c.address,
				c.email_address,
				c.phone_number,
			-- PV Modules info
				ntp.inverter,
				p.battery,
				fire.ac_system_size,
				ntp.battery_count,
			-- AHJ and Utility Info
				ahj.ahj_link,
				cad.install_site_capture,
				utility.utility_portal,
				c.record_url,
			-- Contract Information
				sales.contract_date,
				p.pv_module_quantity,
				p.pv_module_type,
				p.pv_inverter_type,
				p.battery_type,
				prospect.annual_estimated_production
			
				
			FROM customers_customers_schema as c
			LEFT JOIN ntp_ntp_schema AS ntp ON c.record_id = ntp.record_id
			LEFT JOIN planset_cad_schema AS p ON c.record_id = p.record_id
			LEFT JOIN fire_permits_permit_fin_schema AS fire ON c.record_id = fire.record_id
			LEFT JOIN ahj_db_database_hub_schema AS ahj ON c.record_id = ahj.record_id
			LEFT JOIN cad_cad_schema AS cad ON c.record_id = cad.record_id
			LEFT JOIN utility_db_database_hub_schema AS utility ON c.record_id = utility.record_id
			LEFT JOIN sales_metrics_schema AS sales ON c.record_id = sales.record_id
			LEFT JOIN prospects_customers_schema AS prospect ON c.record_id = prospect.record_id
			%s
			ORDER BY c.unique_id;
		`, whereClause)

	data, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to fetch data", http.StatusBadRequest, nil)
		return
	}

	if len(data) <= 0 {
		err = fmt.Errorf("project info not found")
		log.FuncErrorTrace(0, "%v", err)
		appserver.FormAndSendHttpResp(resp, "project not found", http.StatusOK, nil)
		return
	}

	pName, ok := data[0]["customer_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get project name from db : %+v\n", data)
	}

	pId, ok := data[0]["unique_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get project ID from db: %+v\n", data)
	}

	pAddress, ok := data[0]["address"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get project address from db: %+v\n", data)
	}

	pPhoneNumber, ok := data[0]["phone_number"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get phone number from db: %+v\n", data)
	}

	pEmailID, ok := data[0]["email_address"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get email ID from db: %+v\n", data)
	}

	//////////////////////////////////////
	pPVModuleType, ok := data[0]["pv_module_type"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get PV module type from db: %+v\n", data)
	}

	pDCSystemSize, ok := data[0]["dc_system_size"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DC system size from db: %+v\n", data)
	}

	pACSystemSize, ok := data[0]["ac_system_size"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get AC system size from db: %+v\n", data)
	}

	pBatteryCapacity, ok := data[0]["battery_count"].(float64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get battery capacity from db: %+v\n", data)
	}

	pInverter, ok := data[0]["inverter"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get inverter from db: %+v\n", data)
	}

	pBattery, ok := data[0]["battery"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get battery from db: %+v\n", data)
	}
	/////////////////////////////////

	pAHJ, ok := data[0]["ahj_link"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get AHJ from db: %+v\n", data)
	}

	pUtility, ok := data[0]["utility_portal"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get utility from db: %+v\n", data)
	}

	pBranch, ok := data[0]["branch"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get branch from db: %+v\n", data)
	}

	pLender, ok := data[0]["lender"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get lender from db: %+v\n", data)
	}

	pAuroraLink, ok := data[0]["aurora_link"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get Aurora link from db: %+v\n", data)
	}

	pTapeLink, ok := data[0]["record_url"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get Tape link from db: %+v\n", data)
	}

	pSiteCaptureURL, ok := data[0]["install_site_capture"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get Site Capture URL from db: %+v\n", data)
	}

	////////////////////////////
	pContractDate, ok := data[0]["contract_date"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get contract date from db: %+v\n", data)
	}

	pModuleQty, ok := data[0]["pv_module_quantity"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get module quantity from db: %+v\n", data)
	}

	pModuleType, ok := data[0]["pv_module_type"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get module type from db: %+v\n", data)
	}

	pInverterType, ok := data[0]["pv_inverter_type"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get inverter type from db: %+v\n", data)
	}
	pBatteryType, ok := data[0]["battery_type"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get battery type from db: %+v\n", data)
	}
	pAcDcSystemSize, ok := data[0]["system_size"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get ac dc system size from db: %+v\n", data)
	}
	// pTotalProduction, ok := data[0]["annual_estimated_production"].(float64)
	// if !ok {
	// 	log.FuncErrorTrace(0, "Failed to get total production from db: %+v\n", data)
	// }

	///////////////////////////////////
	pDATModuleQty, ok := data[0]["dat_module_qty"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT module quantity from db: %+v\n", data)
	}

	pDATModuleType, ok := data[0]["dat_module_type"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT module type from db: %+v\n", data)
	}

	pDATDesignVersion, ok := data[0]["dat_design_version"].(int64)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT design version from db: %+v\n", data)
	}

	pDATDesignerName, ok := data[0]["dat_designer_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT designer name from db: %+v\n", data)
	}

	pDATAuroraId, ok := data[0]["dat_aurora_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT designer name from db: %+v\n", data)
	}

	pDATSysteSizeAC, ok := data[0]["dat_system_size_ac"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT system size AC from db: %+v\n", data)
	}

	pDATSysteSizeDC, ok := data[0]["dat_system_size_dc"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT system size DC from db: %+v\n", data)
	}

	pDATChanges, ok := data[0]["dat_changes"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT changes from db: %+v\n", data)
	}

	pDATChangeOrder, ok := data[0]["dat_change_order"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get DAT change order from db: %+v\n", data)
	}

	apiResponse = models.GetTabGeneralInfoResponse{
		// General Info
		ProjectName:    pName,
		ProjectId:      pId,
		ProjectAddress: pAddress,
		PhoneNumber:    pPhoneNumber,
		EmailID:        pEmailID,

		// PV Module information
		PVModule:        pPVModuleType,
		Inverters:       pInverter,
		Battery:         pBattery,
		DCSystemSize:    pDCSystemSize,
		ACSystemSize:    pACSystemSize,
		BatteryCapacity: pBatteryCapacity,

		// AHJ, Utility, Branch, and Lender
		AHJ:     pAHJ,
		Utility: pUtility,
		Branch:  pBranch,
		Lender:  pLender,
		// Links
		AuroraLink:     pAuroraLink,
		TapeLink:       pTapeLink,
		SiteCaptureURL: pSiteCaptureURL,

		// Contract information
		ContractDate:    pContractDate,
		ModuleQty:       pModuleQty,
		ModuleType:      pModuleType,
		InverterType:    pInverterType,
		BatteryType:     pBatteryType,
		AcDcSystemSize:  pAcDcSystemSize,
		TotalProduction: pTotalProduction,

		// DAT information
		DATModuleQty:     pDATModuleQty,
		DATModuleType:    pDATModuleType,
		DATDesignVersion: pDATDesignVersion,
		DATDesignerName:  pDATDesignerName,
		DATAuroraId:      pDATAuroraId,
		DATSysteSizeAC:   pDATSysteSizeAC,
		DATSysteSizeDC:   pDATSysteSizeDC,
		DATChanges:       pDATChanges,
		DATChangeOrder:   pDATChangeOrder,
	}

	appserver.FormAndSendHttpResp(resp, "Project Data", http.StatusOK, apiResponse, 0)

}

//
