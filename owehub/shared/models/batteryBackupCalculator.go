/**************************************************************************
 *	Function	: batteryBackupCalculator.go
 *	DESCRIPTION : Files contains struct for battery backup calculator API
 *	DATE        : 20-June-2024
 **************************************************************************/

package models

type ProspectInfoData struct {
	MultiImages  []string `json:"panel_images_url"`
	ProspectName string   `json:"prospect_name"`
	SREmailId    string   `json:"sr_email_id"`
}

type ProspectInfoId struct {
	ProspectId int `json:"prospect_id"`
}

type BreakerInfo struct {
	Ampere   float64 `json:"ampere"`
	Quantity int     `json:"quantity"`
	Note     string  `json:"note"`
}

type ProspectLoadInfo struct {
	ProspectId       int         `json:"prospect_id"`
	ProspectName     string      `json:"prospect_name"`
	LRA              float64     `json:"lra"`
	AverageCapacity  float64     `json:"average_capacity"`
	ContinousCurrent float64     `json:"continous_current"`
	Breakers         []BreakerInfo `json:"breakers"`
}
