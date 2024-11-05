package models

type UpdateDataReq struct {
	HookType string `json:"hookType"`
	UniqueId string `json:"uniqueId"`
	Data     string `json:"dataString"`
}
