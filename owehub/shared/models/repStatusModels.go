/**************************************************************************
*	Function	: 		RepStatusModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										RepStatus data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateRepStatus struct {
	Name   string `json:"name"`
	Status string `json:"status"`
}

type GetRepStatus struct {
	RecordId int64  `json:"record_id"`
	Name     string `json:"name"`
	Status   string `json:"status"`
}

type GetRepStatusList struct {
	RepStatusList []GetRepStatus `json:"rep_incent_list"`
}

type UpdateRepStatus struct {
	RecordId int    `json:"record_id"`
	Name     string `json:"name"`
	Status   string `json:"status"`
}

type ArchiveRepStatus struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
