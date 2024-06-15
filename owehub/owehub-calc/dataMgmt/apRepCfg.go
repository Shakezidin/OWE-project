/**************************************************************************
 * File            : apRep.go
 * DESCRIPTION     : This file contains the model and data form apRep config
 * DATE            : 23-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"time"
)

type ApRepCfgStruct struct {
	ApRepList models.GetApRepDataList
}

var (
	ApRepCfg ApRepCfgStruct
)

func (pApRepCfg *ApRepCfgStruct) LoadApRepCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	 SELECT ar.id as record_id, ar.unique_id, ar.rep, ar.dba, ar.type, ar.date, ar.amount, ar.method, ar.cbiz, ar.transaction, ar.notes
	 FROM ap_rep ar`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ap rep data from DB err: %v", err)
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// UniqueId
		UniqueId, ok := item["unique_id"].(string)
		if !ok || UniqueId == "" {
			// log.FuncErrorTrace(0, "Failed to get unique id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueId = ""
		}

		// Rep
		Rep, ok := item["rep"].(string)
		if !ok || Rep == "" {
			// log.FuncErrorTrace(0, "Failed to get rep for Record ID %v. Item: %+v\n", RecordId, item)
			Rep = ""
		}

		// Dba
		Dba, ok := item["dba"].(string)
		if !ok || Dba == "" {
			// log.FuncErrorTrace(0, "Failed to get dba for Record ID %v. Item: %+v\n", RecordId, item)
			Dba = ""
		}

		//Type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get date for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{} // Default sale price of 0.0
		}

		// Amount
		Amount, ok := item["amount"].(float64)
		if !ok || Amount == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get Amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0.0
		}

		// Method
		Method, ok := item["method"].(string)
		if !ok || Method == "" {
			// log.FuncErrorTrace(0, "Failed to get method for Record ID %v. Item: %+v\n", RecordId, item)
			Method = ""
		}

		// Cbiz
		Cbiz, ok := item["cbiz"].(string)
		if !ok || Cbiz == "" {
			// log.FuncErrorTrace(0, "Failed to get Cbiz for Record ID %v. Item: %+v\n", RecordId, item)
			Cbiz = ""
		}

		// Transaction
		Transaction, ok := item["transaction"].(string)
		if !ok || Transaction == "" {
			// log.FuncErrorTrace(0, "Failed to get Transaction for Record ID %v. Item: %+v\n", RecordId, item)
			Transaction = ""
		}

		// Notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		apRepData := models.GetApRep{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Rep:         Rep,
			Dba:         Dba,
			Type:        Type,
			Date:        Date.Format("2006-01-02"),
			Amount:      Amount,
			Method:      Method,
			Cbiz:        Cbiz,
			Transaction: Transaction,
			Notes:       Notes,
		}
		pApRepCfg.ApRepList.ApRepList = append(pApRepCfg.ApRepList.ApRepList, apRepData)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculateApRepForUniqueId
 * DESCRIPTION:     calculates the ap rep value based on the unique Id
 * RETURNS:         apRep
 *****************************************************************************/
func (pApRepCfg *ApRepCfgStruct) CalculateRepPayForUniqueId(dealer string, uniqueId string) (apRep float64) {

	log.EnterFn(0, "LoadApRepCfg")
	defer func() { log.ExitFn(0, "LoadApRepCfg", nil) }()

	apRep = 0.0
	if len(dealer) > 0 {
		for _, data := range ApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId {
				apRep += data.Amount
			}
		}
	}
	return apRep
}

func (pApRepCfg *ApRepCfgStruct) CalculateRepRDrawPaid(uniqueId, rep string) (r1DrawPaid float64) {
	if len(rep) > 0 {
		for _, data := range pApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId && data.Rep == rep && (data.Type == "Advance" || data.Type == "Draw" || data.Type == "Shaky" || data.Type == "Cancel") {
				r1DrawPaid += data.Amount
			}
		}
	}
	return r1DrawPaid
}

func (pApRepCfg *ApRepCfgStruct) CalculateRepRCommPaid(uniqueId, rep string) (r1DrawPaid float64) {
	if len(rep) > 0 {
		for _, data := range pApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId && data.Rep == rep && (data.Type == "Advance" || data.Type == "Draw" ||
				data.Type == "Shaky" || data.Type == "Cancel" || data.Type == "Final" || data.Type == "Adjustment") {
				r1DrawPaid += data.Amount
			}
		}
	}
	return r1DrawPaid
}

/******************************************************************************
 * FUNCTION:        CalculateApptPaid
 * DESCRIPTION:     calculates the appt paid paid value based on the
 * RETURNS:         apptPaid
 *****************************************************************************/
func (pApRepCfg *ApRepCfgStruct) CalculateApptPaid(apptSetter, uniqueId string) (apptPaid float64) {
	if len(apptSetter) > 0 {
		for _, data := range pApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId && data.Rep == apptSetter && data.Type == "Appt-Set" {
				apptPaid += data.Amount
			}
		}
	}
	return apptPaid
}

func (pApRepCfg *ApRepCfgStruct) CalculateR2DmPaid(r2DmName, uniqueId string) (r2DmPaid float64) {
	if len(r2DmName) > 0 {
		for _, data := range pApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId && data.Rep == r2DmName && data.Type == "DM-OVRD" {
				r2DmPaid += data.Amount
			}
		}
	}
	return r2DmPaid
}

func (pApRepCfg *ApRepCfgStruct) CalculateR2DirPaid(r2DmName, uniqueId string) (r2DmPaid float64) {
	if len(r2DmName) > 0 {
		for _, data := range pApRepCfg.ApRepList.ApRepList {
			if data.UniqueId == uniqueId && data.Rep == r2DmName && data.Type == "DIR-OVRD" {
				r2DmPaid += data.Amount
			}
		}
	}
	return r2DmPaid
}
