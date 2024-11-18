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
	"strconv"
	"strings"
	"time"
)

type BatchOperation struct {
	UniqueID interface{}
	Data     map[string]interface{}
}

func ExecPtoInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err         error
		dataList    []map[string]interface{}
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

	query := `select * from install_pto_schema`
	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to fetch data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch data from db")
		return err
	}

	installEtaVal, _ := ProcessSlice(dataList)

	for _, data := range InitailData.InitialDataList {
		var ptoData map[string]interface{}

		ptoData, err := CalculatePTOEta(data, installEtaVal[data.UniqueId])
		if err != nil {
			log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
			continue
		}

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

	return db.ExecQueryDB(db.RowDataDBIndex, builder.String())
}

// * change to owe_db
func ClearInstallPto() error {
	query := `TRUNCATE TABLE install_pto_schema`
	err := db.ExecQueryDB(db.RowDataDBIndex, query)
	if err != nil {
		return err
	}
	return nil
}

func CalculatePTOEta(data InitialPtoStruct, installEto time.Time) (outData map[string]interface{}, err error) {
	outData = make(map[string]interface{})
	outData["unique_id"] = data.UniqueId
	var PTOETA time.Time
	var ptoExpectedtimeLine int //pending from colten Side
	var finCompletedDate int
	finCreatedCompleteAvg, err := strconv.ParseFloat(data.FinCreatedCompleteAvg, 64)
	if err != nil {
		log.FuncErrorTrace(0, "error while converting AhjDbDbhubSchemaFinCreatedCompleteAvg to float64 with err : %v ", err)
		finCreatedCompleteAvg = 0
	}

	if finCreatedCompleteAvg == 0 {
		finCreatedCompleteAvg = 22.76
	}

	if !data.PTOGranted.IsZero() { //8
		PTOETA = data.PTOGranted
	} else if !data.PTOETA.IsZero() { //7
		PTOETA = data.PTOETA
	} else if !data.PTOSubmitted.IsZero() { //6
		PTOETA = data.PTOSubmitted.AddDate(0, 0, ptoExpectedtimeLine+2)
	} else if !data.PTOItemCreatedOn.IsZero() { //5
		PTOETA = data.PTOItemCreatedOn.AddDate(0, 0, ptoExpectedtimeLine+2)
	} else if !data.PvFinDate.IsZero() { //4
		PTOETA = data.PvFinDate.AddDate(0, 0, ptoExpectedtimeLine+3)
	} else if data.FinScheduledOn != "" { //3
		FinScheduledOn, _ := time.Parse("02-01-2006", data.FinScheduledOn)
		PTOETA = FinScheduledOn.AddDate(0, 0, finCompletedDate+int(finCreatedCompleteAvg)+ptoExpectedtimeLine+3)
	} else if !data.FinItemCreatedOn.IsZero() { //2
		PTOETA = installEto.AddDate(0, 0, DaysFromToday(data.FinItemCreatedOn)+int(finCreatedCompleteAvg)+ptoExpectedtimeLine+3)
	} else if data.PVCompletionDate.IsZero() { //1
		PTOETA = installEto.AddDate(0, 0, int(finCreatedCompleteAvg)+ptoExpectedtimeLine+3)
	}

	outData["pto"] = PTOETA

	return outData, nil
}

func DaysFromToday(targetDate time.Time) int {
	// Get today's date (only year, month, day; time is set to zero)
	today := time.Now().Truncate(24 * time.Hour)
	target := targetDate.Truncate(24 * time.Hour)

	// Calculate the duration between the two dates
	duration := target.Sub(today)

	// Convert duration to days
	days := int(duration.Hours() / 24)
	return days
}

func ProcessSlice(data []map[string]interface{}) (map[string]time.Time, error) {
	result := make(map[string]time.Time)

	for _, item := range data {
		// Get the unique ID (ensure it's a string)
		id, ok := item["unique_id"].(string)
		if !ok {
			return nil, fmt.Errorf("missing or invalid 'id' in item: %v", item)
		}

		// Get the timestamp (ensure it's parseable as time.Time)
		timestampRaw, ok := item["install_eta"]
		if !ok {
			return nil, fmt.Errorf("missing 'timestamp' in item with id: %s", id)
		}

		var timestamp time.Time
		switch v := timestampRaw.(type) {
		case time.Time:
			timestamp = v
		case string:
			parsedTime, err := time.Parse(time.RFC3339, v)
			if err != nil {
				return nil, fmt.Errorf("invalid timestamp format for id %s: %v", id, err)
			}
			timestamp = parsedTime
		default:
			return nil, fmt.Errorf("unsupported timestamp type for id %s: %T", id, timestampRaw)
		}

		// Add the entry to the result map
		result[id] = timestamp
	}

	return result, nil
}
