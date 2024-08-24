/**************************************************************************
 *	Function	: batteryBackupCalculator.go
 *	DESCRIPTION : Files contains struct for battery backup calculator API
 *	DATE        : 20-June-2024
 **************************************************************************/

package models

type ProspectInfoData struct {
	MultiImages       []string `json:"panel_images_url"`
	ProspectName      string   `json:"prospect_name"`
	HouseSquare       float64  `json:"house_square"`
	Address           string   `json:"address"`
	SREmailId         string   `json:"sr_email_id"`
	WaterHeater       string   `json:"water_heater"`
	CookingAppliances string   `json:"cooking_appliances"`
	Furnace           string   `json:"furnace"`
	ClothesDryer      string   `json:"clothes_dryer"`
	PoolPump          bool     `json:"pool_pump"`
	WellPump          bool     `json:"well_pump"`
	EvCharger         bool     `json:"ev_charger"`
	Spa               bool     `json:"spa"`
	SysSize           float64  `json:"system_size"`
	AddedNotes        string   `json:"added_notes"`
}

type GetProspectInfo struct {
	MultiImages  []string      `json:"panel_images_url"`
	ProspectName string        `json:"prospect_name"`
	SREmailId    string        `json:"sr_email_id"`
	HouseSquare  float64       `json:"house_square"`
	Address      string        `json:"address"`
	Primary      PrimaryData   `json:"primary_data"`
	Secondary    SecondaryData `json:"secondary_data"`
	SysSize      float64       `json:"system_size"`
	AddedNotes   string        `json:"added_notes"`
}

type PrimaryData struct {
	WaterHeater       string `json:"water_heater"`
	CookingAppliances string `json:"cooking_appliances"`
	Furnace           string `json:"furnace"`
	ClothesDryer      string `json:"clothes_dryer"`
}

type SecondaryData struct {
	PoolPump  bool `json:"pool_pump"`
	WellPump  bool `json:"well_pump"`
	EvCharger bool `json:"ev_charger"`
	Spa       bool `json:"spa"`
}

type GetProspectInfoData struct {
	MultiImages  []string     `json:"panel_images_url"`
	ProspectName string       `json:"prospect_name"`
	SREmailId    string       `json:"sr_email_id"`
	Primay       PrimaryResp  `json:"primary_resp"`
	Seondary     SeondaryResp `json:"secondary_resp"`
}

type PrimaryResp struct {
	WaterHeater       string `json:"water_heater"`
	CookingAppliances string `json:"cooking_appliances"`
	Furnace           string `json:"furnace"`
	ClothesDryer      string `json:"clothes_dryer"`
}

type SeondaryResp struct {
	PoolPump  bool `json:"pool_pump"`
	WellPump  bool `json:"well_pump"`
	EvCharger bool `json:"ev_charger"`
	Spa       bool `json:"spa"`
}

type ProspectInfoId struct {
	ProspectId int `json:"prospect_id"`
}

type BreakerInfo struct {
	Ampere   float64  `json:"ampere"`
	Category Category `json:"category"`
	Note     string   `json:"note"`
}

type Category struct {
	Name   string  `json:"name"`
	Ampere float64 `json:"ampere"`
}

type GetBreakerInfo struct {
	Ampere         float64 `json:"ampere"`
	Note           string  `json:"note"`
	CategoryName   string  `json:"category_name"`
	CategoryAmpere float64 `json:"category_ampere"`
}

type ProspectLoadInfo struct {
	ProspectId       int           `json:"prospect_id"`
	ProspectName     string        `json:"prospect_name"`
	LRA              float64       `json:"lra"`
	AverageCapacity  float64       `json:"average_capacity"`
	ContinousCurrent float64       `json:"continous_current"`
	MissingLabels    bool          `json:"missing_labels"`
	Breakers         []BreakerInfo `json:"breakers"`
}

type GetProspectLoadInfo struct {
	ProspectId           int              `json:"prospect_id"`
	ProspectName         string           `json:"prospect_name"`
	LRA                  float64          `json:"lra"`
	AverageCapacity      float64          `json:"average_capacity"`
	ContinousCurrent     float64          `json:"continous_current"`
	HouseSquare          float64          `json:"house_square"`
	Address              string           `json:"address"`
	Breakers             []GetBreakerInfo `json:"breakers"`
	TotalCategoryAmperes float64          `json:"total_catergory_amperes"`
	SysSize              float64          `json:"system_size`
	MissingLabels        bool             `json:"missing_labels"`
}
