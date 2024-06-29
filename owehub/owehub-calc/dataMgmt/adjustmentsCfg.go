/**************************************************************************
* File            : adjustmentsCfg.go
* DESCRIPTION     : This file contains the model and data form Adjustments
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
)

type AdjustmentsCfgStruct struct {
	AdjustmentsConfigList models.GetAdjustmentsList
}

var (
	AdjustmentsConfig AdjustmentsCfgStruct
)

func (AdjustmentsConfig *AdjustmentsCfgStruct) LoadAdjustmentsCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	// log.EnterFn(0, "LoadAdjustmentsCfg")
	// defer func() { log.ExitFn(0, "LoadAdjustmentsCfg", err) }()

	query = `
        SELECT ad.id as record_id, ad.unique_id, ad.customer, ad.sys_size, ad.bl, ad.epc, ad.date, ad.notes, ad.amount, pr_partner.partner_name AS partner_name, pr_installer.partner_name AS installer_name, st.name AS state_name  
        FROM ` + db.TableName_adjustments + ` ad
        LEFT JOIN partners pr_partner ON pr_partner.partner_id = ad.partner
        LEFT JOIN partners pr_installer ON pr_installer.partner_id = ad.installer
        LEFT JOIN states st ON st.state_id = ad.state`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil || len(data) == 0 {
		// log.ConfWarnTrace(0, "Failed to get adjustments data from DB err: %v", err)
		// err = fmt.Errorf("Failed to get adjustments data from DB")
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get record_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueId, ok := item["unique_id"].(string)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			// log.ConfWarnTrace(0, "Failed to get customer for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			// log.ConfWarnTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		InstallerName, ok := item["installer_name"].(string)
		if !ok || InstallerName == "" {
			// log.ConfWarnTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			InstallerName = ""
		}

		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			// log.ConfWarnTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0 // Default sys size of 0.0
		}

		Bl, ok := item["bl"].(float64)
		if !ok || Bl <= 0.0 {
			// log.ConfWarnTrace(0, "Failed to get bl for Record ID %v. Item: %+v\n", RecordId, item)
			Bl = 0.0
		}

		Epc, ok := item["epc"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get epc for Record ID %v. Item: %+v\n", RecordId, item)
			Epc = 0.0 // Default epc value of ""
		}

		DateStr, ok := item["date"].(string)
		if !ok || DateStr == "" {
			// log.ConfWarnTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			DateStr = ""
		}

		Notes, ok := item["notes"].(string)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = "" // Default notes value of ""
		}

		Amount, ok := item["amount"].(float64)
		if !ok {
			// log.ConfWarnTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0 // Default amount value of 0.0
		}

		adjustmentData := models.GetAdjustments{
			RecordId:      RecordId,
			UniqueId:      UniqueId,
			Customer:      Customer,
			PartnerName:   PartnerName,
			InstallerName: InstallerName,
			StateName:     StateName,
			SysSize:       SysSize,
			Bl:            Bl,
			Epc:           Epc,
			Date:          DateStr,
			Notes:         Notes,
			Amount:        Amount,
		}

		AdjustmentsConfig.AdjustmentsConfigList.AdjustmentsList = append(AdjustmentsConfig.AdjustmentsConfigList.AdjustmentsList, adjustmentData)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateAdjust
* DESCRIPTION:     calculates the "adjust" value based on the provided data
* RETURNS:         Adjust
*****************************************************************************/
func (AdjustmentsConfig *AdjustmentsCfgStruct) CalculateAdjust(dealer string, uniqueId string) (adjust float64) {
	log.EnterFn(0, "CalculateAdjust")
	defer func() { log.ExitFn(0, "CalculateAdjust", nil) }()

	adjust = 0.0
	if len(dealer) > 0 {
		for _, data := range AdjustmentsConfig.AdjustmentsConfigList.AdjustmentsList {
			if data.UniqueId == uniqueId {
				adjust += data.Amount
			}
		}
	}
	return adjust
}
