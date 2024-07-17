/**************************************************************************
* File            : RepNameCfg.go
* DESCRIPTION     : This file contains the model and data form dealer Owners
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

type GetRepName struct {
	RecordId int64  `json:"record_id"`
	RepName  string `json:"rep_name"`
	Status   string `json:"status"`
}

type RepNameStruct struct {
	RepNameList []GetRepName
}

var (
	RepNameConfig RepNameStruct
)

func (pRepName *RepNameStruct) LoadRRepNameCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadRRepNameCfg")
	defer func() { log.ExitFn(0, "LoadRRepNameCfg", err) }()

	query = `
	SELECT dor.id as record_id, dor.name, dor.status
	FROM rep_status dor`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	pRepName.RepNameList = pRepName.RepNameList[:0]
	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// RepName
		RepName, ok := item["name"].(string)
		if !ok || RepName == "" {
			// log.FuncErrorTrace(0, "Failed to get sub dealer for Record ID %v. Item: %+v\n", RecordId, item)
			RepName = ""
		}

		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			// log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			Status = ""
		}

		repNameData := GetRepName{
			RecordId: RecordId,
			RepName:  RepName,
			Status:   Status,
		}
		pRepName.RepNameList = append(pRepName.RepNameList, repNameData)
	}
	return err
}

func (pRepName *RepNameStruct) CalculateStatus(rep string) (status string) {
	for _, data := range pRepName.RepNameList {
		if data.RepName == rep {
			return data.Status
		}
	}
	return status
}
