/**************************************************************************
*	Function	: 		SchedulingHomeModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										SchedulingHome data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type GetSchedulingHomeRequest struct {
	Queue      string `json:"queue"`
	Order      string `json:"order"`
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
}

type CreateSchedulingHome struct {
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type GetSchedulingHome struct {
	RoofType            string  `json:"roof_type"`
	HomeOwner           string  `json:"home_owner"`
	CustomerEmail       string  `json:"customer_email"`
	CustomerPhoneNumber string  `json:"customer_phone_number"`
	SystemSize          float64 `json:"system_size"`
	Address             string  `json:"address"`
}

type GetSchedulingHomeList struct {
	SchedulingHomeList []GetSchedulingHome `json:"ap_ded_list"`
}

type UpdateSchedulingHome struct {
	RecordId    int     `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Payee       string  `json:"payee"`
	Amount      float64 `json:"amount"`
	Date        string  `json:"date"`
	ShortCode   string  `json:"short_code"`
	Description string  `json:"description"`
}

type ArchiveSchedulingHome struct {
	RecordId   []int64 `json:"record_id"`
	IsArchived bool    `json:"is_archived"`
}
