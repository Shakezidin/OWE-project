/**************************************************************************
*	Function	: 	datToolUpdateModels.go
*	DESCRIPTION : 	Files contains struct for update all the feilds of DAT TOOL
*	DATE        : 	7-february-2025
**************************************************************************/

package models

type UpdateDatToolInfo struct {
	ProjectId string `json:"project_id"`
	// general tab
	GeneraBasics          *GeneralBasics         `json:"general_basics,omitempty"`
	GeneralDatInformation *GeneralDatInformation `json:"general_dat_information,omitempty"`
	// structural tab
	StructuralState string          `json:"structural_state"`
	StructuralInfo  *StructuralInfo `json:"structural_info,omitempty"`
	Attachment      *Attachment     `json:"attachment,omitempty"`
	Racking         *Racking        `json:"racking,omitempty"`
	RoofStructure   *RoofStructure  `json:"roof_structure,omitempty"`
	// adder tab
	AdderValues *AdderUpdateQuantityRequest `json:"adder_values,omitempty"`
	// other tab
	ElectricalEquipmentInfo     *ElectricalEquipmentInfo     `json:"electrical_equipment_info,omitempty"`
	ElectricalSystemInfo        *ElectricalSystemInfo        `json:"electrical_system_info,omitempty"`
	SiteInfoRequest             *SiteInfoRequest             `json:"site_info,omitempty"`
	PvOnlyInterconnection       *PvOnlyInterconnection       `json:"pv_only_interconnection,omitempty"`
	EssInterconnection          *EssInterconnection          `json:"ess_interconnection,omitempty"`
	StringInverterConfiguration *StringInverterConfiguration `json:"string_inverter_configuration,omitempty"`
	RoofCoverageCalculator      *RoofCoverageCalculator      `json:"roof_coverage_calculator,omitempty"`
	MeasurementConversion       *MeasurementConversion       `json:"measurement_conversion,omitempty"`
	ExistingPvSystemInfo        *ExistingPvSystemInfo        `json:"existing_pv_system_info,omitempty"`
	// notes tab
	NotesValues *GetTabNotesInfoResponse `json:"notes_values,omitempty"`
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for general tab
type GeneralBasics struct {
	ProjectAddress string `json:"project_address"`
	PhoneNumber    string `json:"phone_number"`
	EmailID        string `json:"email_id"`
}
type GeneralDatInformation struct {
	DATModuleQty           int64  `json:"dat_module_qty"`
	DATModuleType          string `json:"dat_module_type"`
	DATDesignVersion       int64  `json:"dat_design_version"`
	DATDesignerName        string `json:"dat_designer_name"`
	DATAuroraId            string `json:"dat_aurora_id"`
	DATSysteSizeAC         string `json:"dat_system_size_ac"`
	DATSysteSizeDC         string `json:"dat_system_size_dc"`
	DATInverterType        string `json:"dat_inverter_type"`
	DATBatteryType         string `json:"dat_battery_type"`
	DATSiteCaptureUrl      string `json:"dat_site_capture_url"`
	DATChangeLayout        string `json:"dat_change_layout"`
	DATChangeProduction    string `json:"dat_change_production"`
	DATChangeOrderRequired string `json:"dat_change_order_required"`
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for structural tab
type StructuralInfo struct {
	Structure              string `json:"structure"`
	RoofType               string `json:"roof_type"`
	SheathingType          string `json:"sheathing_type"`
	FramingSize            string `json:"framing_size"`
	StructuralRoofMaterial string `json:"structural_roof_material"`
	FramingType            string `json:"framing_type"`
	FramingSpacing         int64  `json:"framing_spacing"`
	Attachment             string `json:"attachment"`
	Racking                string `json:"racking"`
	Pattern                string `json:"pattern"`
	Mount                  string `json:"mount"`
	StructuralUpgrades     string `json:"structural_upgrades"`
	GmSupportType          string `json:"gm_support_type"`
	ReroofRequired         string `json:"reroof_required"`
}

type Attachment struct {
	AttachmentType    string `json:"attachment_type"`
	AttachmentPattern string `json:"attachment_pattern"`
	AttachmentQty     int64  `json:"attachment_quantity"`
	AttachmentSpacing string `json:"attachment_spacing"`
}

type Racking struct {
	RackingType              string `json:"racking_type"`
	RackingMountType         string `json:"racking_mount_type"`
	RackingTiltInfo          string `json:"racking_title_info"`
	RackingMaxRailCantilever string `json:"racking_max_rail_cantilever"`
}
type RoofStructure struct {
	RoofFramingType       string `json:"roof_framing_type"`
	RoofSize              string `json:"roof_size"`
	RoofSpacing           string `json:"roof_spacing"`
	RoofSheathingType     string `json:"roof_sheathing_type"`
	RoofMaterial          string `json:"roof_material"`
	RoofStructuralUpgrade string `json:"roof_structural_upgrade"`
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for adder tab
type AdderUpdateQuantityRequest struct {
	CategoryTitle    string            `json:"category_title"`
	ComponentUpdates []ComponentUpdate `json:"component_updates"`
}
type ComponentUpdate struct {
	ComponentName string `json:"component_name"`
	NewQuantity   int64  `json:"new_quantity"`
}

// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// for other tab
type ElectricalEquipmentInfo struct {
	NewOrExisting     string `json:"new_or_existing"`
	PanelBrand        string `json:"panel_brand"`
	BusbarRating      int64  `json:"busbar_rating"`
	MainBreakerRating int64  `json:"main_breaker_rating"`
	AvailableBackfeed int64  `json:"available_backfeed"`
	RequiredBackfeed  string `json:"required_backfeed"`
}
type ElectricalSystemInfo struct {
	SystemPhase        string `json:"system_phase"`
	SystemVoltage      string `json:"system_voltage"`
	ServiceEntrance    string `json:"service_entrance"`
	ServiceRating      string `json:"service_rating"`
	MeterEnclosureType string `json:"meter_enclosure_type"`
}
type SiteInfoRequest struct {
	PVConductRun            string `json:"pv_conduct_run"`
	DrywallCutNeeded        string `json:"drywall_cut_needed"`
	NumberOfStories         int64  `json:"number_of_stories"`
	TrenchingRequired       string `json:"trenching_required"`
	PointsOfInterconnection int64  `json:"points_of_interconnection"`
}
type PvOnlyInterconnection struct {
	Type                  string `json:"type"`
	SupplyLoadSide        string `json:"supply_load_side"`
	Location              string `json:"location"`
	SubLocationTapDetails string `json:"sub_location_tap_details"`
}
type EssInterconnection struct {
	BackupType     string `json:"backup_type"`
	TransferSwitch string `json:"transfer_switch"`
	FedBy          string `json:"fed_by"`
}
type StringInverterConfiguration struct {
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
type RoofCoverageCalculator struct {
	TotalRoofArea      string `json:"total_roof_area"`
	AreaOfNewModules   string `json:"area_of_new_modules"`
	AreaOfExstModules  string `json:"area_of_exst_modules"`
	CoveragePercentage string `json:"coverage_percentage"`
}
type MeasurementConversion struct {
	Length string `json:"length"`
	Width  string `json:"width"`
	Height string `json:"height"`
	Other  string `json:"other"`
}
type ExistingPvSystemInfo struct {
	ModuleQuantity                       int64        `json:"module_quantity"`
	ModelNumber                          string       `json:"model_number"`
	Wattage                              string       `json:"wattage"`
	ModuleArea                           string       `json:"module_area"`
	Inverter1                            InverterInfo `json:"inverter1_info"`
	Inverter2                            InverterInfo `json:"inverter2_info"`
	ExistingCalculatedBackfeedWithout125 int64        `json:"existing_calculated_backfeed_without_125"`
}
