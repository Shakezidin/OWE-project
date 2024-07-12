/**************************************************************************
*	Function	: 		RepTypeModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										RepType data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateRepType struct {
	RepType     string `json:"rep_type"`
	Description string `json:"description"`
}

type GetRepType struct {
	RecordId    int64  `json:"record_id"`
	RepType     string `json:"rep_type"`
	Description string `json:"description"`
}

type GetRepTypeList struct {
	RepTypeList []GetRepType `json:"ap_pda_list"`
}

type UpdateRepType struct {
	RecordId    int64  `json:"record_id"`
	RepType     string `json:"rep_type"`
	Description string `json:"description"`
}

type ArchiveRepType struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
