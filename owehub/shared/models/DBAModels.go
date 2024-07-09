/**************************************************************************
*	Function	: 		DBAModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										DBA data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type CreateDBA struct {
	PreferredName string `json:"preferred_name"`
	Dba           string `json:"dba"`
}

type GetDBA struct {
	RecordId      int64  `json:"record_id"`
	PreferredName string `json:"preferred_name"`
	Dba           string `json:"dba"`
}

type GetDBAList struct {
	DBAList []GetDBA `json:"dba_list"`
}

type UpdateDBA struct {
	RecordId      int    `json:"record_id"`
	PreferredName string `json:"preferred_name"`
	Dba           string `json:"dba"`
}

type ArchiveDBA struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
