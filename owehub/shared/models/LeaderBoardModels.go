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
	DealerName []string `json:"dealer"`
	Type       string   `json:"type"`
	StartDate  string   `json:"start_date"`
	EndDate    string   `json:"end_date"`
	GroupBy    string   `json:"group_by"`
	SortBy     string   `json:"sort_by"`
	PageNumber int64    `json:"page_number"`
	PageSize   int64    `json:"page_size"`
}

type GetLeaderBoard struct {
	Rank      int     `json:"rank"`
	Dealer    string  `json:"dealer"`
	Name      string  `json:"rep_name"`
	Sale      float64 `json:"sale"`
	Ntp       float64 `json:"ntp"`
	Cancel    float64 `json:"cancel"`
	Install   float64 `json:"install"`
	Battery   float64 `json:"battery"`
	HighLight bool    `json:"hightlight"`
}

type GetLeaderBoardList struct {
	TopLeaderBoardList []GetLeaderBoard `json:"top_leader_board_list"`
	LeaderBoardList    []GetLeaderBoard `json:"leader_board_list"`
	TotalSale          float64          `json:"total_sale"`
	TotalNtp           float64          `json:"total_ntp"`
	TotalInstall       float64          `json:"total_install"`
	TotalCancel        float64          `json:"total_cancel"`
	TotalBattery       float64          `json:"total_battery"`
}
