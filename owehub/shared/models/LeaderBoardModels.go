/**************************************************************************
*	Function	: 		LeaderBoardModels.go
*	DESCRIPTION : 	Files contains struct for create, update, get, archive
										LeaderBoard data models
*	DATE        : 	24-Jun-2024
**************************************************************************/

package models

type GetLeaderBoardRequest struct {
	Role       string
	Email      string
	DealerName string
	LeaderType string         `json:"leader_type"`
	StartDate  string         `json:"start_date"`
	EndDate    string         `json:"end_date"`
	Filters    []LeaderFilter `json:"filters"`
	SortBy     string         `json:"sort_by"`
	Toppers    bool           `json:"toppers"`
	PageNumber int64          `json:"page_number"`
	PageSize   int64          `json:"page_size"`
}

type LeaderFilter struct {
	FilterColumn string `json:"filter_column"`
	FilterValue  string `json:"filter_value"`
}

type GetLeaderBoard struct {
	Rank         int     `json:"rank"`
	Dealer       string  `json:"dealer"`
	Name         string  `json:"rep_name"`
	SaleCount    int64   `json:"count"`
	Kw           float64 `json:"kw"`
	NtpCount     int64   `json:"ntp_count"`
	CancelCount  int64   `json:"cancel_count"`
	InstallCount int64   `json:"install_count"`
}

type GetLeaderBoardList struct {
	LeaderBoardList []GetLeaderBoard `json:"ap_ded_list"`
}
