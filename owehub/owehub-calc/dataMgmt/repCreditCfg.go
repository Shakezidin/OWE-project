/**************************************************************************
* File            : RepCreditCfg.go
* DESCRIPTION     : This file contains the model and data form referral data
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

// this is in respect with the new columns as per google sheet
type GetRepCreditTemp struct {
	RecordId    int64     `json:"record_id"`
	UniqueID    string    `json:"unique_id"`
	Customer    string    `json:"customer"`
	Rep1        string    `json:"rep1"`
	Rep2        string    `json:"Rep2"`
	Date        time.Time `json:"date"`
	ExactAmount float64   `json:"exact_amount"`
	PerKwAmount string    `json:"per_kw_amount"`
	ApprovedBy  string    `json:"approved_by"`
	Notes       string    `json:"notes"`
	PerRepAmt   float64   `json:"per_rep_amt"`
	RepCount    float64   `json:"rep_count"`
	SysSize     float64   `json:"sys_size"`
}

type RepCreditStruct struct {
	RepCreditList []GetRepCreditTemp
}

var (
	RepCreditCfg RepCreditStruct
)

func (pReferral *RepCreditStruct) LoadReferralCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadReferralCfg")
	defer func() { log.ExitFn(0, "LoadReferralCfg", err) }()

	query = `SELECT rc.id as record_id, rc.unique_id, rc.customer, rc.rep_1, rc.rep_2,
	rc.date, rc.exact_amount, rc.approved_by, rc.notes, rc.per_rep_amt, rc.rep_count,
	rc.sys_size
	FROM rep_credit rc`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			// continue
		}
		// unique_id
		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		// customer
		Customer, ok := item["customer"].(string)
		if !ok || Customer == "" {
			// log.FuncErrorTrace(0, "Failed to get new customer for Record ID %v. Item: %+v\n", RecordId, item)
			Customer = ""
		}

		// Rep1
		Rep1, ok := item["rep_1"].(string)
		if !ok || Rep1 == "" {
			// log.FuncErrorTrace(0, "Failed to get referrer serial for Record ID %v. Item: %+v\n", RecordId, item)
			Rep1 = ""
		}

		// Rep2
		Rep2, ok := item["rep_2"].(string)
		if !ok || Rep2 == "" {
			// log.FuncErrorTrace(0, "Failed to get referrer name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep2 = ""
		}

		// Date
		Date, ok := item["date"].(time.Time)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Date = time.Time{}
		}

		// ExactAmount
		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		// ApprovedBy
		ApprovedBy, ok := item["approved_by"].(string)
		if !ok || ApprovedBy == "" {
			// log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			ApprovedBy = ""
		}

		// Notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// PerRepAmt
		PerRepAmt, ok := item["per_rep_amt"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepAmt = 0.0
		}

		RepCount, ok := item["rep_count"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			RepCount = 0
		}

		// SysSize
		SysSize, ok := item["sys_size"].(float64)
		if !ok || SysSize == 0.0 {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		RepCredit := GetRepCreditTemp{
			RecordId:    RecordId,
			UniqueID:    UniqueID,
			Customer:    Customer,
			Rep1:        Rep1,
			Rep2:        Rep2,
			Date:        Date,
			ExactAmount: ExactAmount,
			ApprovedBy:  ApprovedBy,
			Notes:       Notes,
			PerRepAmt:   PerRepAmt,
			RepCount:    RepCount,
			SysSize:     SysSize,
		}

		RepCreditCfg.RepCreditList = append(RepCreditCfg.RepCreditList, RepCredit)
	}
	return err
}

func (pReferral *RepCreditStruct) CalculateRCredit(rep, uniqueId string) (RCredit float64) {
	if len(rep) > 0 {
		for _, data := range pReferral.RepCreditList {
			if data.UniqueID == uniqueId {
				RCredit += data.PerRepAmt
			}
		}
	}
	return RCredit
}
