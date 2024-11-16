/**************************************************************************
* File            : loadInstallEtaSchemas.go
* DESCRIPTION     : This file contains the code to call the function to
										calulcate the install eta value
* DATE            : 17-Oct-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

func ExecInstalEtaInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err                error
		installEtaDataList []map[string]interface{}
		InitailData        InitialDataLists
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	var idList []string
	if uniqueIds != "" {
		idList = []string{uniqueIds}
	} else {
		idList = []string{}
	}

	InitailData, err = LoadInstallEtaInitialData(idList)
	if err != nil {
		log.FuncErrorTrace(0, "error while loading initial data %v in ExecDlrPayInitialCalculation", err)
		return err
	}

	for _, data := range InitailData.InitialDataList {
		var installEtaData map[string]interface{}

		//* uncomment when function is done
		// installEtaData, err := CalculatePto(data)
		if err != nil {
			log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
			continue
		}

		if hookType == "update" {
			query, _ := buildUpdateQuery("install_pto_schema", installEtaData, "unique_id", data.UniqueId)

			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to update DLR Pay Data for unique id: %+v err: %+v", data.UniqueId, err)
			}
		} else {
			installEtaDataList = append(installEtaDataList, installEtaData)
		}

		if (count+1)%1000 == 0 && len(installEtaDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", installEtaDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial install eta Data in DB err: %v", err)
			}
			installEtaDataList = nil
		}
		count++
	}

	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", installEtaDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial Install ETA Data in DB err: %v", err)
	}

	return err
}

// func buildUpdateQuery(tableName string, row map[string]interface{}, idColumn string, idValue interface{}) (string, error) {
// 	sets := []string{}

// 	for col, val := range row {
// 		if col != idColumn {
// 			var valStr string
// 			switch v := val.(type) {
// 			case string:
// 				// Escape single quotes in string values
// 				valStr = strings.ReplaceAll(v, "'", "''")
// 				valStr = fmt.Sprintf("'%s'", valStr) // Enclose string values in quotes

// 			case time.Time:
// 				// Format time.Time values and enclose in quotes
// 				valStr = fmt.Sprintf("'%s'", v.Format("2006-01-02 15:04:05"))

// 			default:
// 				valStr = fmt.Sprintf("%v", v) // Keep numeric and other types as they are
// 			}
// 			sets = append(sets, fmt.Sprintf("%s = %s", col, valStr))
// 		}
// 	}

// 	// Escape the idValue to prevent SQL injection
// 	var idValueStr string
// 	switch v := idValue.(type) {
// 	case string:
// 		idValueStr = strings.ReplaceAll(v, "'", "''")
// 		idValueStr = fmt.Sprintf("'%s'", idValueStr) // Enclose string ID values in quotes
// 	default:
// 		idValueStr = fmt.Sprintf("%v", idValue) // Keep numeric and other types as they are
// 	}

// 	query := fmt.Sprintf("UPDATE %s SET %s WHERE %s = %s", tableName, strings.Join(sets, ", "), idColumn, idValueStr)
// 	return query, nil
// }
