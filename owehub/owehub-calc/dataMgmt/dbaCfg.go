/**************************************************************************
* File            : DBA.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type GetDBAList struct {
	PreferredName string `json:"preferred_name"`
	Dba           string `json:"dba"`
}

type DBACfgStruct struct {
	DBAList []GetDBAList
}

var (
	DBACfg DBACfgStruct
)

func (DBACfg *DBACfgStruct) LoadDBACfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT *
	FROM dba dc`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		preferredName, ok := item["preferred_name"].(string)
		if !ok || preferredName == "" {
			// log.FuncErrorTrace(0, "Failed to get preferred name data from DB err")
			preferredName = ""
		}

		dba, ok := item["dba"].(string)
		if !ok || preferredName == "" {
			// log.FuncErrorTrace(0, "Failed to get dba data from DB err")
			dba = ""
		}

		GetDBAList := GetDBAList{
			PreferredName: preferredName,
			Dba:           dba,
		}

		DBACfg.DBAList = append(DBACfg.DBAList, GetDBAList)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateReprep1Dba
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (DBACfg *DBACfgStruct) CalculateReprepDba(rep string) (dba string) {
	for _, data := range DBACfg.DBAList {
		if len(rep) > 0 {
			if rep == "" {
				return ""
			} else if data.PreferredName == rep {
				return data.Dba
			}
		}
	}
	return dba
}

/******************************************************************************
* FUNCTION:        CalculateApptSetDba
* DESCRIPTION:     calculates the appt set dba value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (DBACfg *DBACfgStruct) CalculateApptSetDba(apptSetter string) (apptSetDba string) {
	if len(apptSetter) > 0 {
		for _, data := range DBACfg.DBAList {
			if data.PreferredName == apptSetter {
				apptSetDba = data.Dba
			}
		}
	}
	return apptSetDba
}
