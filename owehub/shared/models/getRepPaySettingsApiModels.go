package models

type GetRepPaySettingsData struct {
	RecordId    int64  `json:"record_id`
	UniqueID    string `json:"unique_id"`
	Name        string `json:"name"`
	State       string `json:"state"`
	PayScale    string `json:"pay_scale"`
	Position    string `json:"position"`
	B_E         string `json:"b_e"`
	Is_archived bool   `json:"is_archived"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
}

type GetRepPaySettingsList struct {
	RepPaySettingsList []GetRepPaySettingsData `json:"rep_pay_settings_list"`
}
