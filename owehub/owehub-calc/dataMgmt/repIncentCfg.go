/**************************************************************************
* File            : dealerCredit.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strconv"
	"strings"
	"time"
)

type GetrepIncentData struct {
	Name  string
	Kw    float64
	Month string
}

type repIncentCfgStruct struct {
	RepIncentList []GetrepIncentData
}

var (
	RepIncentCfg repIncentCfgStruct
)

func (RepIncentCfg *repIncentCfgStruct) LoadRepIncentCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadRepIncentCfg")
	defer func() { log.ExitFn(0, "LoadRepIncentCfg", err) }()

	query = ` SELECT rs.id AS record_id, rs.unique_id, rs.name, st.name AS state_name, rs.pay_scale, rs.position,
	rs.b_e, rs.start_date, rs.end_date
	FROM rep_pay_settings rs
	JOIN states st ON st.state_id = rs.state_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		Name, ok := item["name"].(string)
		if !ok || Name == "" {
			Name = ""
		}

		Kw, ok := item["kw"].(float64)
		if !ok {
			Kw = 0
		}

		Month, ok := item["month"].(string)
		if !ok || Month == "" {
			Month = ""
		}

		// Create a new GetSaleTypeData object
		repIncentData := GetrepIncentData{
			Name:  Name,
			Kw:    Kw,
			Month: Month,
		}

		RepIncentCfg.RepIncentList = append(RepIncentCfg.RepIncentList, repIncentData)
	}

	return err
}

func (RepIncentCfg *repIncentCfgStruct) CalculateRepR1Incentive(Rep string, wc time.Time) (incentive float64) {

	wcYear := wc.Year()
	wcMonth := strings.ToLower(wc.Month().String())

	for _, data := range RepIncentCfg.RepIncentList {
		monthSplit := strings.Split(data.Month, ", ")
		if len(monthSplit) != 2 {
			continue
		}
		month := strings.ToLower(monthSplit[0])
		year, _ := strconv.Atoi(strings.ToLower(monthSplit[1]))
		if data.Name == Rep && strings.Contains(wcMonth, month) && wcYear == year {
			incentive += data.Kw
		}
	}
	return incentive
}
