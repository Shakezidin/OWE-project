package models

type UpdateRepPaySettingsData struct {
	RecordId  int64  `json:"record_id"`
	Name      string `json:"name"`
	State     string `json:"state"`
	PayScale  string `json:"pay_scale"`
	Position  string `json:"position"`
	B_E       string `json:"b_e"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
}

type UpdateRepPaySettingsArchive struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
