/**************************************************************************
 *	Function	: getSaleTypeApiModels.go
 *	DESCRIPTION : Files contains struct for get sale type models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetScheduleDataRequest struct {
	SortOrder  string `json:"sort_order"`
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
}

type GetScheduleDataResponseItem struct {
	Name         string `json:"name"`
	Email        string `json:"email"`
	PhoneNumber  string `json:"phone_number"`
	ScheduleDate string `json:"schedule_date"`
}

type GetScheduleDataResponse struct {
	ScheduleData []GetScheduleDataResponseItem `json:"schedule_data"`
}
