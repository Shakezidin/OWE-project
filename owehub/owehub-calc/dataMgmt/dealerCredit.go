/**************************************************************************
 * File            : dealerCredit.go
 * DESCRIPTION     : This file contains the model and data form dealer
					 credit config
 * DATE            : 19-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
)

type DealerCreditCfgStruct struct {
	DealerCreditList models.GetDealerCreditList
}

var (
	DealerCreditCfg DealerCreditCfgStruct
)

func (DealerCreditCfg *DealerCreditCfgStruct) LoadDlrCreditCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	log.EnterFn(0, "LoadDlrCreditCfg")
	defer func() { log.ExitFn(0, "LoadDlrCreditCfg", err) }()

	query = `SELECT dc.id AS record_id, dc.unique_id, dc.customer, dc.start_date,
		dc.end_date, vd.dealer_name , dc.dealer_dba, dc.exact_amount, dc.per_kw_amount,
		dc.approved_by, dc.notes, dc.total_amount, dc.sys_size
		FROM` + db.TableName_dealer_credit + `dc
		JOIN v_dealer vd ON vd.id = dc.dealer_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			log.FuncErrorTrace(0, "Failed to get customer for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		DealerName, nameOk := item["dealer_name"].(string)
		if !nameOk || DealerName == "" {
			log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			DealerName = ""
		}

		DealerDBA, ok := item["dealer_dba"].(string)
		if !ok || DealerDBA == "" {
			log.FuncErrorTrace(0, "Failed to get dealer dba for Record ID %v. Item: %+v\n", RecordId, item)
			DealerDBA = ""
		}

		ExactAmount, ok := item["exact_amount"].(string)
		if !ok || ExactAmount == "" {
			log.FuncErrorTrace(0, "Failed to get exact amount for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = ""
		}

		PerKWAmount, ok := item["per_kw_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_kw_amount for Record ID %v. Item: %+v\n", RecordId, item)
			PerKWAmount = 0.0
		}

		ApprovedBy, ok := item["approved_by"].(string)
		if !ok || ApprovedBy == "" {
			log.FuncErrorTrace(0, "Failed to get approved by for Record ID %v. Item: %+v\n", RecordId, item)
			ApprovedBy = ""
		}

		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		TotalAmount, ok := item["total_amount"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get total amount for Record ID %v. Item: %+v\n", RecordId, item)
			TotalAmount = 0.0
		}

		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		EndDate, ok := item["end_date"].(*string)
		if !ok || EndDate == nil {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = nil
		}

		DealerCreditData := models.GetDealerCredit{
			RecordId:    RecordId,
			UniqueID:    UniqueID,
			Customer:    Customer,
			DealerName:  DealerName,
			DealerDBA:   DealerDBA,
			ExactAmount: ExactAmount,
			PerKWAmount: PerKWAmount,
			ApprovedBy:  ApprovedBy,
			Notes:       Notes,
			TotalAmount: TotalAmount,
			SysSize:     SysSize,
			StartDate:   StartDate,
			EndDate:     EndDate,
		}
		DealerCreditCfg.DealerCreditList.DealerCreditList = append(DealerCreditCfg.DealerCreditList.DealerCreditList, DealerCreditData)
	}

	return err
}

/******************************************************************************
 * FUNCTION:        CalculateCreaditForUniqueId
 * DESCRIPTION:     calculates the credit value based on the unique Id
 * RETURNS:         credit
 *****************************************************************************/
func (DealerCreditCfg *DealerCreditCfgStruct) CalculateCreaditForUniqueId(dealer string, uniqueId string) (credit float64) {

	log.EnterFn(0, "LoadDlrCreditCfg")
	defer func() { log.ExitFn(0, "LoadDlrCreditCfg", nil) }()

	credit = 0.0
	if len(dealer) > 0 {
		for _, data := range DealerCreditCfg.DealerCreditList.DealerCreditList {
			if data.UniqueID == uniqueId {
				credit += data.TotalAmount
			}
		}
	}
	return credit
}
