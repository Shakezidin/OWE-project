/**************************************************************************
 *	Function	: getPerformerDataApiModels.go
 *	DESCRIPTION : Files contains struct for get performance tile data models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPerformarDataReq struct {
	Email     string          `json:"email"`
	Status    string          `json:"status"`
	StartDate string          `json:"start_date"`
	EndDate   string          `json:"end_date"`
	Includes  *IncludeDataReq `json:"includes"`
}

type IncludeDataReq struct {
	Column string `json:"column"`
	Data   string `json:"data"`
}

type GetPerformarData struct {
	DealerName   string  `json:"daeler_name"`
	OwnerName    string  `json:"owner_name"`
	DealerLogo   string  `json:"dealer_logo"`
	DealerId     int64   `json:"dealer_id"`
	TotalTeams   float64 `json:"total_teams"`
	TeamStrength float64 `json:"total_strength"`
}

type GetPerformerAllData struct {
	Name     string  `json:"name"`
	Sales    float64 `json:"sales"`
	Kw       float64 `json:"kw"`
	Installs float64 `json:"installs"`
	Rank     float64 `json:"rank"`
}

type GetPerformerProfileDataReq struct {
	Email      string
	Dealer     string `json:"dealer"`
	RepName    string `json:"rep_name"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	LeaderType string `json:"leader_type"`
}

type GetPerformerProfileData struct {
	Dealer         string `json:"dealer"`
	TeamName       string `json:"team_name"`
	ContactNumber  string `json:"contact_number"`
	Email          string `json:"email"`
	TotalSales     int64  `json:"total_sales"`
	Total_NTP      int64  `json:"total_ntp"`
	Total_Installs int64  `json:"total_installs"`
	WeeklySale     int64  `json:"weekly_sale"`
	User_code      string `json:"user_code"`
}
