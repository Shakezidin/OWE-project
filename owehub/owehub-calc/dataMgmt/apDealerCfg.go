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
      LEFT JOIN states st ON st.state_id = ad.state_id
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
		if !ok {
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

		// NotesCalculateR1CommPaid
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.FuncErrorTrace(0, "Failed to get Notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
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
		}
		pApDealerCfg.ApDealerList = append(pApDealerCfg.ApDealerList, apDealerData)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateR1CommPaid
* DESCRIPTION:     calculates the "pr1_comm_paid" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func (pApDealerCfg *ApDealerCfgStruct) CalculateR1CommPaid(dealer, uniqueid string) (r1CommPaid float64) {
	r1CommPaid = 0
	if len(dealer) > 0 {
		for _, data := range pApDealerCfg.ApDealerList {
			if data.UniqueId == uniqueid {

				if data.UniqueId == uniqueid && data.Dealer == dealer && (data.Type != "Non-COMM" && data.Type != "DLR-OTHER") {
					r1CommPaid += data.Amount
				}
			}
		}
	}
	return r1CommPaid
}

/******************************************************************************
* FUNCTION:        CalculateR1DrawPaid
* DESCRIPTION:     calculates the "r1_draw_paid" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func (pApDealerCfg *ApDealerCfgStruct) CalculateR1DrawPaid(dealer, uniqueID string) (R1FrawPaid float64) {
	if len(dealer) > 0 {
		for _, data := range pApDealerCfg.ApDealerList {
			if data.UniqueId == uniqueID && data.Dealer == dealer && (data.Type == "Sold" || data.Type == "NTP") {
				R1FrawPaid += data.Amount
			}
		}
	}
	return R1FrawPaid
}

/******************************************************************************
* FUNCTION:        CalculateR1DrawPaid
* DESCRIPTION:     calculates the "r1_draw_paid" value based on the provided data
* RETURNS:         gross revenue
*****************************************************************************/
func (pApDealerCfg *ApDealerCfgStruct) CalculateOvrdPaid(dealer, uniqueID, parentDlr string) (ovrdPaid float64) {

	ovrdPaid = 0.0
	if len(dealer) > 0 {
		for _, data := range pApDealerCfg.ApDealerList {
			if data.UniqueId == uniqueID && data.Dealer == parentDlr && data.Type == "DLR-OVRD" {
				ovrdPaid += data.Amount
			}
		}
	}
	return ovrdPaid
}
