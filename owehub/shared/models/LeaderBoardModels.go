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
	DealerName string `json:"dealer"`
	Type       string `json:"type"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	GroupBy    string `json:"group_by"`
	SortBy     string `json:"sort_by"`
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
}

type GetLeaderBoard struct {
	Rank    int    `json:"rank"`
	Dealer  string `json:"dealer"`
	Name    string `json:"rep_name"`
	Sale    int64  `json:"count"`
	Ntp     int64  `json:"ntp_count"`
	Cancel  int64  `json:"cancel_count"`
	Install int64  `json:"install_count"`
}

type GetLeaderBoardList struct {
	LeaderBoardList []GetLeaderBoard `json:"ap_ded_list"`
}
