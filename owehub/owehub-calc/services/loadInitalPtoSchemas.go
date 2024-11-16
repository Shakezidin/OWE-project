/**************************************************************************
* File            : loadInitalPtoSchemas.go
* DESCRIPTION     : This file contains the model and data to fetch datas from
										schemas that are required for pto calculation
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

type InitialPtoStruct struct {
	UniqueId              string    `json:"unique_id"`
	Ahj                   string    `json:"ahj"`
	PVCompletionDate      time.Time `json:"pv_completion_date"`
	InstallETA            time.Time `json:"install_eta"`
	FinCreatedCompleteAvg string    `json:"fin_created_complete_avg"`
	FinScheduledOn        string    `json:"fin_scheduled_on"`
	FinItemCreatedOn      time.Time `json:"fin_item_created_on"`
	PTOItemCreatedOn      time.Time `json:"pto_item_created_on"`
	PTOSubmitted          time.Time `json:"pto_submitted"`
	PTOETA                time.Time `json:"pto_eta"`
}

type InitialPtoDataLists struct {
	InitialDataList []InitialPtoStruct
}

func LoadPtoInitialData(uniqueIds []string) (InitialData InitialPtoDataLists, err error) {
	var (
		query    string
		dataList []map[string]interface{}
	)

	log.EnterFn(0, "LoadInstallEtaInitialData")
	defer func() { log.ExitFn(0, "LoadInstallEtaInitialData", err) }()

	query = `
		SELECT 
			i.customer_unique_id AS unique_id,
      i.ahj,
			i.pv_completion_date,
			i.install_eta,
			a.fin_created_complete_avg,
			f.fin_scheduled_on,
			f.item_created_on AS fin_item_created_on,
			p.item_created_on AS pto_item_created_on,
			p.submitted AS pto_submitted,
			p.pto_eta
		FROM 
			pv_install_install_subcontracting_schema i
		JOIN 
			ahj_db_dbhub_schema a ON i.ahj = a.title
		JOIN 
			fin_permits_fin_schema f ON i.customer_unique_id = f.customer_unique_id
		JOIN 
			pto_ic_schema p ON i.customer_unique_id = p.customer_unique_id;
	`

	if len(uniqueIds) > 0 {
		placeholders := make([]string, len(uniqueIds))
		for i, id := range uniqueIds {
			placeholders[i] = fmt.Sprintf("'%s'", id)
		}
		query += fmt.Sprintf(" AND cs.unique_id IN (%s)", strings.Join(placeholders, ",")) //* change query here
	}

	dataList, err = db.ReteriveFromDB(db.RowDataDBIndex, query, nil)
	if err != nil || len(dataList) == 0 {
		log.FuncErrorTrace(0, "Failed to fetch inital data from DB err: %+v", err)
		err = fmt.Errorf("failed to fetch inital data from db")
		return InitialData, err
	}
	log.FuncInfoTrace(0, "Reterived raw data frm DB Count: %+v", len(dataList))

	for _, data := range dataList {
		var initialData InitialPtoStruct

		for key, value := range data {
			if value == nil {
				continue
			}

			switch key {
			case "unique_id":
				initialData.UniqueId = value.(string)
			case "ahj":
				initialData.Ahj = value.(string)
			case "pv_completion_date":
				initialData.PVCompletionDate = value.(time.Time)
			case "install_eta":
				initialData.InstallETA = value.(time.Time)
			case "fin_created_complete_avg":
				initialData.FinCreatedCompleteAvg = value.(string)
			case "fin_scheduled_on":
				initialData.FinScheduledOn = value.(string)
			case "fin_item_created_on":
				initialData.FinItemCreatedOn = value.(time.Time)
			case "pto_item_created_on":
				initialData.PTOItemCreatedOn = value.(time.Time)
			case "pto_submitted":
				initialData.PTOSubmitted = value.(time.Time)
			case "pto_eta":
				initialData.PTOETA = value.(time.Time)
			default:
				log.FuncWarnTrace(0, "Unmapped field: %s", key)
			}
		}

		InitialData.InitialDataList = append(InitialData.InitialDataList, initialData)
	}

	return InitialData, err
}
