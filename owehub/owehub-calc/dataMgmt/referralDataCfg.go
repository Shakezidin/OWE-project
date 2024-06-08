/**************************************************************************
* File            : referralDataCfg.go
* DESCRIPTION     : This file contains the model and data form referral data
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

// this is in respect with the new columns as per google sheet
type GetReferralDataTemp struct {
	RecordId        int64   `json:"record_id"`
	UniqueID        string  `json:"unique_id"`
	NewCustomer     string  `json:"new_customer"`
	ReferrerSerial  string  `json:"referrer_serial"`
	ReferrerName    string  `json:"referrer_name"`
	Amount          float64 `json:"amount"`
	RepDollDivbyPer float64 `json:"rep_doll_divby_per"`
	Notes           string  `json:"notes"`
	Type            string  `json:"type"`
	SysSize         float64 `json:"sys_size"`
	State           string  `json:"state"`
	AdderAmount     float64 `json:"adder_amount"`
	StartDate       string  `json:"start_date"`
	EndDate         string  `json:"end_date"`
}

type ReferralDataStruct struct {
	ReferralDataList []GetReferralDataTemp
}

var (
	ReferralDataConfig ReferralDataStruct
)

func (pReferral *ReferralDataStruct) LoadReferralCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadReferralCfg")
	defer func() { log.ExitFn(0, "LoadReferralCfg", err) }()

	query = `SELECT ad.id as record_id, ad.unique_id, ad.new_customer, ad.referrer_serial, ad.referrer_name,
	ad.amount, ad.rep_doll_divby_per, ad.notes, ad.type, ad.sys_size, ad.start_date,
	ad.end_date, ad.adder_amount, st.name as state
	FROM referral_data ad
	LEFT JOIN states st ON st.state_id = ad.state_id`

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

		// new_customer
		NewCustomer, ok := item["new_customer"].(string)
		if !ok || NewCustomer == "" {
			// log.FuncErrorTrace(0, "Failed to get new customer for Record ID %v. Item: %+v\n", RecordId, item)
			NewCustomer = ""
		}

		// referrer_serial
		ReferrerSerial, ok := item["referrer_serial"].(string)
		if !ok || ReferrerSerial == "" {
			// log.FuncErrorTrace(0, "Failed to get referrer serial for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerSerial = ""
		}

		// referrer_name
		ReferrerName, ok := item["referrer_name"].(string)
		if !ok || ReferrerName == "" {
			// log.FuncErrorTrace(0, "Failed to get referrer name for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerName = ""
		}

		// amount
		Amount, ok := item["amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0
		}

		// rep_doll_divby_per
		RepDollDivbyPer, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			RepDollDivbyPer = 0.0
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			// log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// sys_size
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		adderAmount, ok := item["adder_amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			adderAmount = 0
		}

		// state
		State, ok := item["state"].(string)
		if !ok || State == "" {
			// log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// start_date
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// end_date
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		ReferralData := GetReferralDataTemp{
			RecordId:        RecordId,
			UniqueID:        UniqueID,
			NewCustomer:     NewCustomer,
			ReferrerSerial:  ReferrerSerial,
			ReferrerName:    ReferrerName,
			Amount:          Amount,
			RepDollDivbyPer: RepDollDivbyPer,
			Notes:           Notes,
			Type:            Type,
			SysSize:         SysSize,
			State:           State,
			StartDate:       StartDate,
			EndDate:         EndDate,
			AdderAmount:     adderAmount,
		}

		pReferral.ReferralDataList = append(pReferral.ReferralDataList, ReferralData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateReferralForUniqueId
* DESCRIPTION:     calculates the credit value based on the unique Id
* RETURNS:         referral float64
*****************************************************************************/
func (pReferral *ReferralDataStruct) CalculateReferralForUniqueId(dealer string, uniqueId string) (referral float64) {

	log.EnterFn(0, "CalculateReferralForUniqueId")
	defer func() { log.ExitFn(0, "CalculateReferralForUniqueId", nil) }()

	referral = 0.0
	if len(dealer) > 0 {
		for _, data := range pReferral.ReferralDataList {
			if data.UniqueID == uniqueId {
				if data.Amount > 0 { //need to change amount of type string to float64
					referral += data.Amount
				}
			}
		}
	}
	return referral
}
