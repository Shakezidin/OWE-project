/**************************************************************************
*	Function	: 	datToolModels.go
*	DESCRIPTION : 	Files contains struct for all the feilds of DAT TOOL
*	DATE        : 	25-january-2025
**************************************************************************/

package models

import "time"

// models to fetch project details
type GetProjectListRequest struct {
	Search     string `json:"search"`
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
	Sort       string `json:"sort"`
}
type GetProjectListResponse struct {
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
type GetTabStructuralInfoResponse struct {
	//// STRUCTURAL INFO
	Structure          string `json:"structure"`
	RoofType           string `json:"roof_type"`
	SheathingType      string `json:"sheathing_type"`
	FramingSize        string `json:"framing_size"`
	FramingType1       string `json:"framing_type_1"`
	FramingType2       string `json:"framing_type_2"`
	FramingSpacing     int64  `json:"framing_spacing"`
	Attachment         string `json:"attachment"`
	Racking            string `json:"racking"`
	Pattern            string `json:"pattern"`
	Mount              string `json:"mount"`
	StructuralUpgrades string `json:"structural_upgrades"`
	GmSupportType      string `json:"gm_support_type"`
	ReroofRequired     string `json:"reroof_required"`
	////////////////////////////////////////////////
	Quantity int64  `json:"quantity"`
	Pitch    int64  `json:"pitch"`
	AreaSqft string `json:"area_sqft"`
	Azim     int64  `json:"azimuth"`
	TSRF     int64  `json:"tsrf"`
	KWDC     int64  `json:"kw_dc"`
	SpacingP int64  `json:"spacing_p"`
	SpacingL int64  `json:"spacing_l"`

	// Attachment Information
	AttachmentType    string `json:"attachment_type"`
	AttachmentPattern string `json:"attachment_pattern"`
	AttachmentQty     int64  `json:"attachment_quantity"`
	AttachmentSpacing string `json:"attachment_spacing"`

	// Racking Information
	RackingType              string `json:"racking_type"`
	RackingMountType         string `json:"racking_mount_type"`
	RackingTiltInfo          string `json:"racking_title_info"`
	RackingMaxRailCantilever string `json:"racking_max_rail_cantilever"`

	// Roof Structure
	RoofFramingType       string `json:"roof_framing_type"`
	RoofSize              string `json:"roof_size"`
	RoofSpacing           string `json:"roof_spacing"`
	RoofSheathingType     string `json:"roof_sheathing_type"`
	RoofMaterial          string `json:"roof_material"`
	RoofStructuralUpgrade string `json:"roof_structural_upgrade"`
}

// Adders tab structs
type GetTabAddersInfoResponse struct {
	Categories    []Categories `json:"categories"`
	TotalCost     float64      `json:"total_cost"`
	Adders        string       `json:"adders"`
	ViewAllAdders []Component  `json:"view_all_adders"`
}
type Categories struct {
	Title string      `json:"title"` // Example: "INTERCONNECTION", "ELECTRICAL", etc.
	Cost  float64     `json:"cost"`
	Items []Component `json:"items"`
}

type Component struct {
	Name     string  `json:"name"`     // Example: "Supply/Line Side Tap"
	Quantity int64   `json:"quantity"` // Selected count (default 0)
	Cost     float64 `json:"cost"`     // Cost per unit
}

// notes tab structs
type GetTabNotesInfoResponse struct {
	Title       string `json:"title"`       // e.g., "Structural"
	Description []Note `json:"description"` // List of notes with time
}

type Note struct {
	Note      string    `json:"note"`       // The note content
	CreatedAt time.Time `json:"created_at"` // Timestamp when the note was created
}

// Other tab structs
type GetTabOtherInfoResponse struct {
	// Electrical qequipment info
	Equipment EquipmentInfo `json:"equipment"`
	// Electrial System info
	System SystemInfo `json:"system"`
	// Site info
	SiteInfo SiteInfo `json:"siteInfo"`
	// PV Only interconnection
	PvInterconnection PvInfo `json:"pvInterconnection"`
	// Ess interconnection
	EssInterconnection EssInfo `json:"essInterconnection"`
	// String Inverter Configuration
	InverterConfigParent InverterConfigInfo `json:"inverterConfigParent"`
	// Roof coverage Calculator
	RoofCoverage RoofInfo `json:"roofCoverage"`
	// Measurement Conversion
	Measurement MeasurementInfo `json:"measurement"`
	// Existing PV System info
	ExistingPV ExistingPvInfo `json:"existingPV"`
}
type InverterInfo struct {
	Quantity    int64  `json:"quantity"`
	ModelNumber string `json:"model_number"`
	OutputA     string `json:"output_a"`
}

type MpptInfo struct {
	S1 string `json:"s1"`
	S2 string `json:"s2"`
}

type EquipmentInfo struct {
	NewOrExisting     string `json:"new_or_existing"`
	PanelBrand        string `json:"panel_brand"`
	BusbarRating      int64  `json:"busbar_rating"`
	MainBreakerRating int64  `json:"main_breaker_rating"`
	AvailableBackfeed int64  `json:"available_backfeed"`
	RequiredBackfeed  string `json:"required_backfeed"`
}

type SystemInfo struct {
	SystemPhase        string `json:"system_phase"`
	SystemVoltage      string `json:"system_voltage"`
	ServiceEntrance    string `json:"service_entrance"`
	ServiceRating      string `json:"service_rating"`
	MeterEnclosureType string `json:"meter_enclosure_type"`
}

type SiteInfo struct {
	PVConductRun            string `json:"pv_conduct_run"`
	DrywallCutNeeded        string `json:"drywall_cut_needed"`
	NumberOfStories         int64  `json:"number_of_stories"`
	TrenchingRequired       string `json:"trenching_required"`
	PointsOfInterconnection int64  `json:"points_of_interconnection"`
}

type PvInfo struct {
	Type                  string `json:"type"`
	SupplyLoadSide        string `json:"supply_load_side"`
	Location              string `json:"location"`
	SubLocationTapDetails string `json:"sub_location_tap_details"`
}

type EssInfo struct {
	BackupType     string `json:"backup_type"`
	TransferSwitch string `json:"transfer_switch"`
	FedBy          string `json:"fed_by"`
}

type InverterConfigInfo struct {
	Inverter string   `json:"inverter"`
	Max      int64    `json:"max"`
	Mppt1    MpptInfo `json:"mppt1"`
	Mppt2    MpptInfo `json:"mppt2"`
	Mppt3    MpptInfo `json:"mppt3"`
	Mppt4    MpptInfo `json:"mppt4"`
	Mppt5    MpptInfo `json:"mppt5"`
	Mppt6    MpptInfo `json:"mppt6"`
	Mppt7    MpptInfo `json:"mppt7"`
	Mppt8    MpptInfo `json:"mppt8"`
}

type RoofInfo struct {
	TotalRoofArea      string `json:"total_roof_area"`
	AreaOfNewModules   string `json:"area_of_new_modules"`
	AreaOfExstModules  string `json:"area_of_exst_modules"`
	CoveragePercentage string `json:"coverage_percentage"`
}

type MeasurementInfo struct {
	Length string `json:"length"`
	Width  string `json:"width"`
	Height string `json:"height"`
	Other  string `json:"other"`
}

type ExistingPvInfo struct {
	ModuleQuantity                       int64        `json:"module_quantity"`
	ModelNumber                          string       `json:"model_number"`
	Wattage                              string       `json:"wattage"`
	ModuleArea                           string       `json:"module_area"`
	Inverter1                            InverterInfo `json:"inverter1_info"`
	Inverter2                            InverterInfo `json:"inverter2_info"`
	ExistingCalculatedBackfeedWithout125 int64        `json:"existing_calculated_backfeed_without_125"`
}

// Update struct
/**************************************************************************
 **************************************************************************/
type UpdateDatToolInfo struct {
	ProjectId        string                        `json:"project_id"`
	GeneralValues    *GetTabGeneralInfoResponse    `json:"general_values,omitempty"`
	StructuralValues *GetTabStructuralInfoResponse `json:"structural_values,omitempty"`
	//AdderValues      *GetTabAddersInfoResponse     `json:"adder_values,omitempty"`
	AdderValues *AdderUpdateQuantityRequest `json:"adder_values,omitempty"`
	OtherValues *GetTabOtherInfoResponse    `json:"other_values,omitempty"`
	NotesValues *GetTabNotesInfoResponse    `json:"notes_values,omitempty"`
}

type AdderUpdateQuantityRequest struct {
	CategoryTitle string `json:"category_title"`
	ComponentName string `json:"component_name"`
	NewQuantity   int64  `json:"new_quantity"`
}
