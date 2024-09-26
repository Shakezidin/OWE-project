/**************************************************************************
*	Function	: 		LeadsHistoryModels.go
*	DESCRIPTION : 	Contains struct for LeadsHistory data models
*	DATE        : 	21-Sept-2024
**************************************************************************/

package models

// the structure for filtering lead history (request from UI)
type GetLeadsHistoryRequest struct {
	// filter by deal status won/loss
	LeadsStatus int `json:"leads_status"`
	StartDate   string `json:"start_date"`
	EndDate     string `json:"end_date"`
	PageSize    int    `json:"page_size"`   // page size
	PageNumber  int    `json:"page_number"` // pagination  page number
	//SortBy      string `json:"sort_by"`     // sort according to deal won or loss
	
}

// sent to UI
type GetLeadsHistoryResponse struct {
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	PhoneNumber   string `json:"phone_number"`
	EmailId       string `json:"email_id"`
	StreetAddress string `json:"street_address"`
	State         string `json:"state"`
	City          string `json:"city"`
	Zipcode       string `json:"zipcode"`
	Country       string `json:"country"`
	Notes         string `json:"notes"`
	LeadsID       int64  `json:"leads_id"`
	DealDate      string `json:"deal_date"`   // Deal date (updated_at)
	DealStatus    string `json:"deal_status"` // Won or Lost
}

// wraps the list of lead history responses.
type GetLeadsHistoryList struct {
	LeadsHistoryList []GetLeadsHistoryResponse `json:"leads_history_list"`
	TotalRecords     int64                     `json:"total_records"` // Total records for pagination
}
