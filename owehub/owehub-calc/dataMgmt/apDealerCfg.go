/**************************************************************************
 * File            : apDealer.go
 * DESCRIPTION     : This file contains the model and data form apDealer config
 * DATE            : 23-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"time"
)

type ApDealerData struct {
	RecordId    int64   `json:"record_id"`
	UniqueId    string  `json:"unique_id"`
	Dealer      string  `json:"dealer"`
	Dba         string  `json:"dba"`
	Type        string  `json:"type"`
	Date        string  `json:"date"`
	Amount      float64 `json:"amount"`
	Method      string  `json:"method"`
	Transaction string  `json:"transaction"`
	Notes       string  `json:"notes"`
	DealerName  string  `json:"dealer_name"`
	HomeOwner   string  `json:"home_owner"`
	State       string  `json:"state"`
}

type ApDealerCfgStruct struct {
	ApDealerList []ApDealerData
}

var (
	ApDealerCfg ApDealerCfgStruct
)

func (pApDealerCfg *ApDealerCfgStruct) LoadApDealerCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	  SELECT ad.id as record_id, ad.unique_id, vd.dealer_name as dealer, ad.dba, ad.type, ad.date, ad.amount, ad.method, ad.transaction, ad.notes, ad.dealer as dealer_name, ad.home_owner, st.name as state
	  FROM ap_dealer ad
	  LEFT JOIN state st ON st.id = ad.state_id
	  LEFT JOIN v_dealer vd ON vd.id = ad.dealer_id`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get ap Dealer data from DB err: %v", err)
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

		// Dealer
		Dealer, ok := item["dealer"].(string)
		if !ok || Dealer == "" {
			// log.FuncErrorTrace(0, "Failed to get Dealer for Record ID %v. Item: %+v\n", RecordId, item)
			Dealer = ""
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

		// DealerName
		DealerName, ok := item["dealer_name"].(string)
		if !ok || DealerName == "" {
			// log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			DealerName = ""
		}

		// HomeOwner
		HomeOwner, ok := item["home_owner"].(string)
		if !ok || HomeOwner == "" {
			// log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			HomeOwner = ""
		}

		// State
		State, ok := item["state"].(string)
		if !ok || State == "" {
			// log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		apDealerData := ApDealerData{
			RecordId:    RecordId,
			UniqueId:    UniqueId,
			Dealer:      Dealer,
			Dba:         Dba,
			Type:        Type,
			Date:        Date.Format("2006-01-02"),
			Amount:      Amount,
			Method:      Method,
			Transaction: Transaction,
			Notes:       Notes,
			DealerName:  DealerName,
			HomeOwner:   HomeOwner,
			State:       State,
		}
		pApDealerCfg.ApDealerList = append(pApDealerCfg.ApDealerList, apDealerData)
	}

	return err
}
