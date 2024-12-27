package models

type UpdateDataReq struct {
	HookType string `json:"hookType,omitempty"`
	UniqueId string `json:"uniqueId,omitempty"`
	Data     string `json:"dataString,omitempty"`
}
