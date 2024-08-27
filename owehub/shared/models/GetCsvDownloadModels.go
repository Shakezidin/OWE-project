/**************************************************************************
 *	Function	: DealerApiModels.go
 *	DESCRIPTION : Files contains struct for get Dealer models
 *	DATE        : 28-May-2024
 **************************************************************************/

package models

type GetCsvDownload struct {
	Page              string `json:"page"`
	Email             string `json:"email"`
	Dealer            interface{}
	StartDate         string   `json:"start_date"`
	EndDate           string   `json:"end_date"`
	PageNumber        int      `json:"page_number"`
	PageSize          int      `json:"page_size"`
	DealerName        []string `json:"dealer_name"`
	SelectedMilestone string   `json:"selected_milestone"`
}

type GetCsvPerformance struct {
	UniqueId       string
	HomeOwner      string
	Email          string
	PhoneNumber    string
	Address        string
	State          string
	ContractAmount float64
	SystemSize     float64
	ContractDate   string
}

type GetCsvPerformanceList struct {
	GetCsvPerformance []GetCsvPerformance `json:"performance_csv"`
}
