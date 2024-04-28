/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create team user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type TeamData struct {
	TeamName string `json:"team_name"`
}
type TeamsList struct {
	TeamsList []TeamData `json:"teams_list"`
}
