/**************************************************************************
 *	Function	: getPendingQueueModels.go
 *	DESCRIPTION : Files contains struct for get pending queue models
 *	DATE        : 03-Sep-2024
 **************************************************************************/

package models

type PendingQueueReq struct {
	PageNumber   int `json:"page_number"`
	PageSize     int `json:"page_size"`
	Email        string
	UniqueIds    []string `json:"unique_ids"`
	DealerName   interface{}
	IntervalDays string
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"`
}

type GetPendingQueue struct {
	UniqueId  string `json:"uninque_id"`
	HomeOwner string `json:"home_owner"`
	Ntp       NTP    `json:"ntp"`
	Qc        QC     `json:"qc"`
}

type GetPendingQueueList struct {
	PendingQueueList []GetPendingQueue `json:"pending_queue_list"`
}
