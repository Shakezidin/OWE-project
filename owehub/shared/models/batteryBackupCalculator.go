/**************************************************************************
 *	Function	: batteryBackupCalculator.go
 *	DESCRIPTION : Files contains struct for battery backup calculator API
 *	DATE        : 20-June-2024
 **************************************************************************/

package models

type ProspectInfoData struct {
	MultiImages       []string `json:"panel_images_url"`
	ProspectName      string   `json:"prospect_name"`
	SREmailId         string   `json:"sr_email_id"`
	WaterHeater       string   `json:"water_heater"`
	CookingAppliances string   `json:"cooking_appliances"`
	Furnace           string   `json:"furnace"`
	ClothesDryer      string   `json:"clothes_dryer"`
	PoolPump          bool     `json:"pool_pump"`
	WellPump          bool     `json:"well_pump"`
	EvCharger         bool     `json:"ev_charger"`
	Spa               bool     `json:"spa"`
}

type ProspectInfoId struct {
	ProspectId int `json:"prospect_id"`
}

type BreakerInfo struct {
	Ampere   float64 `json:"ampere"`
	Category string  `json:"category"`
	Note     string  `json:"note"`
}

type ProspectLoadInfo struct {
	ProspectId       int           `json:"prospect_id"`
	ProspectName     string        `json:"prospect_name"`
	LRA              float64       `json:"lra"`
	AverageCapacity  float64       `json:"average_capacity"`
	ContinousCurrent float64       `json:"continous_current"`
	Breakers         []BreakerInfo `json:"breakers"`
}
