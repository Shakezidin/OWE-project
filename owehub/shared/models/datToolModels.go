/**************************************************************************
*	Function	: 	datToolModels.go
*	DESCRIPTION : 	Files contains struct for get project details data models in DAT Tool
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

// models to fetch project details
type GetProjectListRequest struct {
	Search string `json:"search"`
}

type GetProjectListResponse struct {
	ProjectData []GetProjectData `json:"project_data"`
}

type GetProjectData struct {
	ProjectName    string `json:"project_name"`
	ProjectId      string `json:"project_id"`
	ProjectAddress string `json:"project_address"`
}

// models for tab general info
type GetTabGeneralInfoRequest struct {
	ProjectId string `json:"project_id"`
}

type GetTabGeneralInfoResponse struct {
	// General Info
	ProjectName    string `json:"project_name"`
	ProjectId      string `json:"project_id"`
	ProjectAddress string `json:"project_address"`
	PhoneNumber    string `json:"phone_number"`
	EmailID        string `json:"email_id"`

	// PV Modules Info
	PVModule        string  `json:"pv_module"`
	Inverters       string  `json:"inverters"`
	Battery         string  `json:"battery"`
	DCSystemSize    float64 `json:"dc_system_size"`
	ACSystemSize    float64 `json:"ac_system_size"`
	BatteryCapacity float64 `json:"battery_capacity"`
	// remaining - DC system size, and pv module.

	// AHJ and Utility Info
	AHJ     string `json:"ahj"`
	Utility string `json:"utility"`
	Branch  string `json:"branch"`
	Lender  string `json:"lender"`
	// branch, lender remaining

	// Links
	AuroraLink     string `json:"aurora_link"`
	TapeLink       string `json:"tape_link"`
	SiteCaptureURL string `json:"site_capture_url"`
	//aurora link remaining

	// Contract Information
	ContractDate    string  `json:"contract_date"`
	ModuleQty       int64   `json:"module_qty"`
	ModuleType      int64   `json:"module_type"`
	InverterType    string  `json:"inverter_type"`
	BatteryType     string  `json:"battery_type"`
	AcDcSystemSize  string  `json:"ac_dc_system_size"`
	TotalProduction float64 `json:"total_production"` // annual production
	// ac to dc size remaining.

	// DAT Information
	DATModuleQty     int64  `json:"dat_module_qty"`  // doubt (repeat)
	DATModuleType    string `json:"dat_module_type"` // doubt
	DATDesignVersion int64  `json:"dat_design_version"`
	DATDesignerName  string `json:"dat_designer_name"`
	DATAuroraId      string `json:"dat_aurora_id"`
	DATSysteSizeAC   string `json:"dat_system_size_ac"` // doubt
	DATSysteSizeDC   string `json:"dat_system_size_dc"` // doubt
	DATChanges       string `json:"dat_changes"`
	DATChangeOrder   string `json:"dat_change_order"`
}

// Structural tab structs

// type StructuralInfo struct {
// 	Structure       string `json:"structure"`
// 	RoofType        string `json:"roof_type"`
// 	SheathingType   string `json:"sheathing_type"`
// 	FramingSize     string `json:"framing_size"`
// 	FramingType1    string `json:"framing_type_1"`
// 	FramingType2    string `json:"framing_type_2"`
// 	FramingSpacing  string `json:"framing_spacing"`
// 	////////////////////////////////////
// 	Attachment       string `json:"attachment"`
// 	Racking         string `json:"racking"`
// 	Pattern         string `json:"pattern"`
// 	Mount           string `json:"mount"`
// 	/////////////////////////////
// 	StructuralInfo      StructuralInfo     `json:"structural_info"`
// 	PVMountingHardware  PVmountingHardware `json:"pv_mounting_hardware"`
// 	StructuralUpgrades  string             `json:"structural_upgrades"`
// 	ReroofRequired      string             `json:"reroof_required"`
// 	GmSupportType       string             `json:"gm_support_type"`
// }
