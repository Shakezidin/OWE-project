/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create team user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type TeamData struct {
	TeamName    string   `json:"team_name"`
	DealerName  string   `json:"dealer_name"`
	SaleRepIds  []string `json:"sale_rep_ids"`
	ManagerIds  []string `json:"manager_ids"`
	Description string   `json:"description"`
	Email       string
	Region      string `json:"region"`
}

type TeamsList struct {
	TeamsList []TeamData `json:"teams_list"`
}

type GetTeam struct {
	TeamId       int64  `json:"team_id"`
	TeamName     string `json:"team_name"`
	TeamStrength int64  `json:"team_strength"`
	RoleInTeam   string `json:"role_in_team"`
}

type GetTeams struct {
	TeamList []GetTeam `json:"teams_list"`
}

//* induvidual team

type GetTeamsRequest struct {
	DealerNames []string `json:"dealer_names"`
}

type GetTeamRequest struct {
	PageNumber int64  `json:"page_number"`
	PageSize   int64  `json:"page_size"`
	TeamName   string `json:"team_name"`
	TeamId     int64  `json:"team_id"`
}

type GetRepResponse struct {
	UserCode     string `json:"user_code"`
	Name         string `json:"sale_rep_name"`
	EmailId      string `json:"email_id"`
	PhoneNumber  string `json:"phone_number"`
	Role         string `json:"role"`
	TeamMemberId int64  `json:"team_member_id"`
}

type GetTeamResponse struct {
	TeamName           string           `json:"team_name"`
	TeamID             int64            `json:"team_id"`
	SaleRep            []GetRepResponse `json:"sale_rep_list"`
	MemberCount        int64            `jsosn:"member_count"`
	ManagerCount       int64            `json:"manager_count"`
	DealerCode         string           `json:"dealer_name"`
	LoggedInMemberRole string           `json:"logged_in_member_role"`
	Region             string           `json:"region"`
}

//* manage team data

type TeamUpdateData struct {
	TeamID     int64    `json:"team_id"`
	ManagerIds []string `json:"manager_ids"`
	SaleRepIds []string `json:"rep_ids"`
}

type DeleteTeamMemberRequest struct {
	TeamMemberID int `json:"team_member_id"`
	TeamId       int `json:"team_id"`
}

type UpdateTeamNameRequest struct {
	TeamID   int    `json:"team_id"`
	TeamName string `json:"team_name"`
}

type DeleteTeamsRequest struct {
	TeamIDs []int `json:"team_ids"`
}
