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
	"fmt"
	"strings"
	"time"
)

type BatchOperation struct {
	UniqueID interface{}
	Data     map[string]interface{}
}

func ExecPtoInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err error
		// ptoDataList []map[string]interface{}
		InitailData InitialPtoDataLists
		updateBatch []BatchOperation
		// createBatch []map[string]interface{}
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

		// ptoData, err := CalculatePto(data)
		// if err != nil {
		// 	log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
		// 	continue
		// }

		updateBatch = append(updateBatch, BatchOperation{
			UniqueID: data.UniqueId,
			Data:     ptoData,
		})
		count++

		if len(updateBatch) >= 1000 {
			if err := executeBatchUpdate("install_pto_schema", updateBatch); err != nil {
				log.FuncErrorTrace(0, "Failed to batch update PTO Data: %v", err)
			}
			updateBatch = nil // Clear the batch after processing
		}

		//* uncomment when function is done
		// ptoData, err := CalculatePto(data)
		// if err != nil {
		// 	log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
		// 	continue
		// }

		// if hookType == "update" {
		// query, _ := buildUpdateQuery("install_pto_schema", ptoData, "unique_id", data.UniqueId)

		// err = db.ExecQueryDB(db.OweHubDbIndex, query)
		// if err != nil {
		// 	log.FuncErrorTrace(0, "Failed to update DLR Pay Data for unique id: %+v err: %+v", data.UniqueId, err)
		// }
		// }
		// else {
		// 	ptoDataList = append(ptoDataList, ptoData)
		// }

		// if (count+1)%1000 == 0 && len(ptoDataList) > 0 {
		// 	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", ptoDataList)
		// 	if err != nil {
		// 		log.FuncErrorTrace(0, "Failed to insert initial install eta Data in DB err: %v", err)
		// 	}
		// 	ptoDataList = nil
		// }
		// count++
	}

	if len(updateBatch) > 0 {
		if err := executeBatchUpdate("install_pto_schema", updateBatch); err != nil {
			log.FuncErrorTrace(0, "Failed to batch update remaining PTO Data: %v", err)
		}
	}

	// err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", ptoDataList)
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to insert initial Install ETA Data in DB err: %v", err)
	// }

	return err
}

func executeBatchUpdate(tableName string, batch []BatchOperation) error {
	if len(batch) == 0 {
		return nil
	}

	var builder strings.Builder
	builder.WriteString(fmt.Sprintf("UPDATE %s SET ", tableName))

	columns := make([]string, 0)
	for col := range batch[0].Data {
		if col != "unique_id" {
			columns = append(columns, col)
		}
	}

	for i, col := range columns {
		if i > 0 {
			builder.WriteString(", ")
		}
		builder.WriteString(fmt.Sprintf("%s = CASE ", col))

		for _, op := range batch {
			val := op.Data[col]
			var valStr string
			switch v := val.(type) {
			case string:
				valStr = strings.ReplaceAll(v, "'", "''")
				valStr = fmt.Sprintf("'%s'", valStr)
			case time.Time:
				valStr = fmt.Sprintf("'%s'", v.Format("2006-01-02 15:04:05"))
			default:
				valStr = fmt.Sprintf("%v", v)
			}

			builder.WriteString(fmt.Sprintf("WHEN unique_id = '%v' THEN %s ", op.UniqueID, valStr))
		}
		builder.WriteString("ELSE " + col + " END")
	}

	builder.WriteString(" WHERE unique_id IN (")
	for i, op := range batch {
		if i > 0 {
			builder.WriteString(", ")
		}
		builder.WriteString(fmt.Sprintf("'%v'", op.UniqueID))
	}
	builder.WriteString(")")

	return db.ExecQueryDB(db.OweHubDbIndex, builder.String())
}

//* change to owe_db
func ClearInstallPto() error {
	query := `TRUNCATE TABLE install_pto_schema`
	err := db.ExecQueryDB(db.OweHubDbIndex, query)
	if err != nil {
		return err
	}
	return nil
}