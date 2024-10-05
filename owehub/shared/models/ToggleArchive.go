/**************************************************************************
 *	Function	: ToggleArchiveRequest.go
 *	DESCRIPTION : Files contains struct for Toggle Archive Request
 *	DATE        : 28-Sept-2024
 **************************************************************************/

package models

type ToggleArchiveRequest struct {
	LeadID     []int64 `json:"ids"`
	IsArchived bool    `json:"is_archived"`
}
