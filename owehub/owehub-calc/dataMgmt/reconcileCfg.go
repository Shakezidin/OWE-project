/**************************************************************************
 * File            : reconcileCfg.go
 * DESCRIPTION     : This file contains the model and data form reconcile
 * DATE            : 02-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"
)

type ReconcileCfgStruct struct {
	ReconcileList models.GetReconcileList
}

var (
	ReconcileCfgData ReconcileCfgStruct
)

func (ReconcileCfgData *ReconcileCfgStruct) LoadReconcileCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadReconcileCfg")
	defer func() { log.ExitFn(0, "LoadReconcileCfg", err) }()

	query = `
	 SELECT re.id as record_id, re.unique_id, re.customer, pt.partner_name AS partner_name, st.name as state_name, re.sys_size, re.status, re.date, re.amount, re.notes
	 FROM ` + db.TableName_Reconcile + ` re
	 JOIN states st ON st.state_id = re.state_id
	 JOIN partners pt ON pt.partner_id = re.partner_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		log.ConfWarnTrace(0, "Failed to get reconcile from DB err: %v", err)
		err = fmt.Errorf("Failed to get reconsile cfg data from DB")
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			log.ConfWarnTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.ConfWarnTrace(0, "Failed to get customer for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.ConfWarnTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			log.ConfWarnTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0 // Default sys size value of 0.0
		}

		Status, ok := item["status"].(string)
		if !ok || Status == "" {
			log.ConfWarnTrace(0, "Failed to get status for Record ID %v. Item: %+v\n", RecordId, item)
			Status = ""
		}

		DateStr, ok := item["date"].(string)
		if !ok || DateStr == "" {
			log.ConfWarnTrace(0, "Failed to get date for Unique ID %v. Item: %+v\n", UniqueId, item)
			DateStr = ""
		}

		Amount, ok := item["amount"].(float64)
		if !ok {
			log.ConfWarnTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0 // Default amount value of 0.0
		}

		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.ConfWarnTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		reconcileData := models.GetReconcile{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Customer:    Customer,
			PartnerName: PartnerName,
			StateName:   StateName,
			SysSize:     SysSize,
			Status:      Status,
			Date:        DateStr,
			Amount:      Amount,
			Notes:       Notes,
		}
		ReconcileCfgData.ReconcileList.ReconcileList = append(ReconcileCfgData.ReconcileList.ReconcileList, reconcileData)
	}

	return err
}

/******************************************************************************
 * FUNCTION:		CalculateReconcile
 * DESCRIPTION:		calculates the "reconcile" value based on the provided data
 * RETURNS:			Reconsile
 *****************************************************************************/
func (ReconcileCfgData *ReconcileCfgStruct) CalculateReconcile(dealer string, uniqueId string) (reconcile float64) {
	log.EnterFn(0, "CalculateReconcile")
	defer func() { log.ExitFn(0, "CalculateReconcile", nil) }()

	reconcile = 0
	if len(dealer) > 0 {
		for _, data := range ReconcileCfgData.ReconcileList.ReconcileList {
			if data.UniqueId == uniqueId {
				reconcile += data.Amount
			}
		}
	}
	return reconcile
}
