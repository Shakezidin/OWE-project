/**************************************************************************
* File            : loadPtoSchemas.go
* DESCRIPTION     : This file contains the model and data to fetch datas from
										schemas that are required for pto  calculation
* DATE            : 17-Oct-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

func ExecPtoInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err         error
		ptoDataList []map[string]interface{}
		InitailData InitialPtoDataLists
	)
	log.EnterFn(0, "ExecPtoInitialCalculation")
	defer func() { log.ExitFn(0, "ExecPtoInitialCalculation", err) }()

	count := 0
	var idList []string
	if uniqueIds != "" {
		idList = []string{uniqueIds}
	} else {
		idList = []string{}
	}

	InitailData, err = LoadPtoInitialData(idList)
	if err != nil {
		log.FuncErrorTrace(0, "error while loading initial data %v in ExecDlrPayInitialCalculation", err)
		return err
	}

	for _, data := range InitailData.InitialDataList {
		var ptoData map[string]interface{}

		//* uncomment when function is done
		// ptoData, err := CalculatePto(data)
		if err != nil {
			log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
			continue
		}

		if hookType == "update" {
			query, _ := buildUpdateQuery("install_pto_schema", ptoData, "unique_id", data.UniqueId)

			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to update DLR Pay Data for unique id: %+v err: %+v", data.UniqueId, err)
			}
		} else {
			ptoDataList = append(ptoDataList, ptoData)
		}

		if (count+1)%1000 == 0 && len(ptoDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", ptoDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial install eta Data in DB err: %v", err)
			}
			ptoDataList = nil
		}
		count++
	}

	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", ptoDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial Install ETA Data in DB err: %v", err)
	}

	return err
}
