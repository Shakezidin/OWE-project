/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create team user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type TeamData struct {
	TeamName    string `json:"team_name"`
	RepId       []int  `json:"rep_ids"`
	Description string `json:"description"`
	DeleteCheck bool   `json:"delete_check"`
}
type TeamsList struct {
	TeamsList []TeamData `json:"teams_list"`
}

type GetTeam struct {
	TeamId       int64  `json:"team_id"`
	TeamName     string `json:"team_name"`
	TeamStrength int64  `json:"team_strength"`
	Name         string `json:"name"`
	ManagerId int64 `json:"manager_id"`
}

type GetTeams struct {
	TeamList []GetTeam `json:"teams_list"`
}

//* induvidual team

type GetTeamRequest struct {
	TeamName  string `json:"team_name"`
	ManagerId int64  `json:"manager_id"`
	TeamId    int64  `json:"team_id"`
}

type GetRepResponse struct {
	SaleRepName string `json:"sale_rep_name"`
	EmailId     string `json:"email_id"`
	PhoneNumber string `json:"phone_number"`
}

type GetTeamResponse struct {
	TeamName            string           `json:"team_name"`
	ManagerName         string           `json:"manager_name"`
	TeamID              int64            `json:"team_id"`
	RegionalManagerName string           `json:"rehgional_manager_name"`
	SaleRep             []GetRepResponse `json:"sale_rep_list"`
}

//* manage team data

type TeamDataRequest struct {
	TeamId      int64 `json:"team_id"`
	RepId       []int `json:"rep_ids"`
	DeleteCheck bool  `json:"delete_check"`
}
