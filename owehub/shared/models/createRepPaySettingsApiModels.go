package models

type CreateRepPaySettingsData struct {
	Name      string `json:"name"`
	State     string `json:"state"`
	PayScale  string `json:"pay_scale"`
	Position  string `json:"position"`
	B_E       bool `json:"b_e"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}
