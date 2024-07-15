/**************************************************************************
* File            : RepCreditCfg.go
* DESCRIPTION     : This file contains the model and data form referral data
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

// this is in respect with the new columns as per google sheet
type GetRepCreditTemp struct {
	UniqueID     string  `json:"unique_id"`
	ExactAmount  float64 `json:"exact_amount"`
	PerRepAmount float64
}

type RepCreditStruct struct {
	RepCreditList []GetRepCreditTemp
}

var (
	RepCreditCfg RepCreditStruct
)

func (pReferral *RepCreditStruct) LoadRepCreditlCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadReferralCfg")
	defer func() { log.ExitFn(0, "LoadReferralCfg", err) }()

	query = `SELECT *
	FROM rep_credit rc`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	RepCreditCfg.RepCreditList = RepCreditCfg.RepCreditList[:0]
	for _, item := range data {
		// unique_id
		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		// customer
		PerRepAmount, ok := item["per_rep_amt"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get new customer for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepAmount = 0.0
		}

		// ExactAmount
		ExactAmount, ok := item["exact_amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			ExactAmount = 0.0
		}

		RepCredit := GetRepCreditTemp{
			UniqueID:     UniqueID,
			ExactAmount:  ExactAmount,
			PerRepAmount: PerRepAmount,
		}

		RepCreditCfg.RepCreditList = append(RepCreditCfg.RepCreditList, RepCredit)
	}
	return err
}

func (pReferral *RepCreditStruct) CalculateRCredit(rep, uniqueId string) (RCredit float64) {
	if len(rep) > 0 {
		for _, data := range pReferral.RepCreditList {
			if data.UniqueID == uniqueId {
				RCredit += data.PerRepAmount
			}
		}
	}
	return RCredit
}
