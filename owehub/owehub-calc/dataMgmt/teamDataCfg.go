/**************************************************************************
* File            : TeamData.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	"time"
)

type TeamDataList struct {
	Name      string
	Team      string
	StartDate time.Time
	EndDate   time.Time
}

type TeamDataCfgStruct struct {
	TeamDataList []TeamDataList
}

var (
	TeamDataCfg TeamDataCfgStruct
)

func (TeamDataCfg *TeamDataCfgStruct) LoadTeamDataCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT *
	FROM team_data`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		Name, ok := item["name"].(string)
		if !ok || Name == "" {
			// log.FuncErrorTrace(0, "Failed to get preferred name data from DB err")
			Name = ""
		}

		TeamName, ok := item["team"].(string)
		if !ok || TeamName == "" {
			// log.FuncErrorTrace(0, "Failed to get TeamData data from DB err")
			TeamName = ""
		}

		StartDate, ok := item["start_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get preferred name data from DB err")
			StartDate = time.Time{}
		}

		EndDate, ok := item["end_date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get TeamData data from DB err")
			EndDate = time.Time{}
		}

		TeamDataList := TeamDataList{
			Name:      Name,
			Team:      TeamName,
			StartDate: StartDate,
			EndDate:   EndDate,
		}

		TeamDataCfg.TeamDataList = append(TeamDataCfg.TeamDataList, TeamDataList)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateTeamData
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (TeamDataCfg *TeamDataCfgStruct) CalculateRTeamName(rep string, date time.Time) (TeamData string) {
	for _, data := range TeamDataCfg.TeamDataList {
		if len(rep) > 0 {
			if data.Name == rep && (data.StartDate.Before(date) || data.StartDate.Equal(date)) &&
				(data.EndDate.After(date) || data.EndDate.Equal(date)) {
				return data.Team
			}
		}
	}
	return TeamData
}
