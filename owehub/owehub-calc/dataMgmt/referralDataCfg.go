/**************************************************************************
* File            : referralDataCfg.go
* DESCRIPTION     : This file contains the model and data form referral data
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"strconv"
)

type ReferralDataStruct struct {
	ReferralDataList models.GetReferralDataList
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

	query = `SELECT ad.id AS record_id, ad.unique_id, ad.new_customer, ad.start_date,
    ad.end_date,  ad.referrer_serial, ad.referrer_name, ad.amount, ad.rep_doll_divby_per, ad.notes,
    ad.type, ad.sys_size, ad.rep_count, ad.per_rep_addr_share, ad.per_rep_ovrd_share, ad.r1_pay_scale, ad."r1_referral_credit_$" AS r1_referral_credit,
    ad.r1_referral_credit_perc AS r1_referral_credit_perc, ad.r1_addr_resp, ad.r2_pay_scale,
    ad."r2_referral_credit_$" AS r2_referral_credit, ad.r2_referral_credit_perc AS r2_referral_credit_perc, ad.r2_addr_resp,
    ud1.name AS rep_1_name, ud2.name AS rep_2_name, st.name AS state
    FROM referral_data ad
    JOIN states st ON st.state_id = ad.state_id
    JOIN user_details ud1 ON ud1.user_id = ad.rep_1
    JOIN user_details ud2 ON ud2.user_id = ad.rep_2`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		UniqueID, ok := item["unique_id"].(string)
		if !ok || UniqueID == "" {
			log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			UniqueID = ""
		}

		// new_customer
		NewCustomer, ok := item["new_customer"].(string)
		if !ok || NewCustomer == "" {
			log.FuncErrorTrace(0, "Failed to get new customer for Record ID %v. Item: %+v\n", RecordId, item)
			NewCustomer = ""
		}

		// referrer_serial
		ReferrerSerial, ok := item["referrer_serial"].(string)
		if !ok || ReferrerSerial == "" {
			log.FuncErrorTrace(0, "Failed to get referrer serial for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerSerial = ""
		}

		// referrer_name
		ReferrerName, ok := item["referrer_name"].(string)
		if !ok || ReferrerName == "" {
			log.FuncErrorTrace(0, "Failed to get referrer name for Record ID %v. Item: %+v\n", RecordId, item)
			ReferrerName = ""
		}

		// amount
		Amount, ok := item["amount"].(string)
		if !ok || Amount == "" {
			log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = ""
		}

		// rep_doll_divby_per
		RepDollDivbyPer, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			RepDollDivbyPer = 0.0
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			log.FuncErrorTrace(0, "Failed to get notes for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			log.FuncErrorTrace(0, "Failed to get type for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// rep_1_name
		Rep1Name, ok := item["rep_1_name"].(string)
		if !ok || Rep1Name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_1_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep1Name = ""
		}

		// rep_2_name
		Rep2Name, ok := item["rep_2_name"].(string)
		if !ok || Rep2Name == "" {
			log.FuncErrorTrace(0, "Failed to get rep_2_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep2Name = ""
		}

		// sys_size
		SysSize, ok := item["sys_size"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			SysSize = 0.0
		}

		// rep_count
		RepCount, ok := item["rep_count"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get rep count for Record ID %v. Item: %+v\n", RecordId, item)
			RepCount = 0.0
		}

		// state
		State, ok := item["state"].(string)
		if !ok || State == "" {
			log.FuncErrorTrace(0, "Failed to get state for Record ID %v. Item: %+v\n", RecordId, item)
			State = ""
		}

		// per_rep_addr_share
		PerRepAddrShare, ok := item["per_rep_addr_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_addr_share for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepAddrShare = 0.0
		}

		// per_rep_ovrd_share
		PerRepOvrdShare, ok := item["per_rep_ovrd_share"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get per_rep_ovrd_share for Record ID %v. Item: %+v\n", RecordId, item)
			PerRepOvrdShare = 0.0
		}

		// r1_pay_scale
		R1PayScale, ok := item["r1_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r1_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R1PayScale = 0.0
		}

		// r1_referral_credit_$
		R1ReferralCredit, ok := item["r1_referral_credit_$"].(string)
		if !ok || R1ReferralCredit == "" {
			log.FuncErrorTrace(0, "Failed to get r1_referral_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R1ReferralCredit = ""
		}

		// r1_referral_credit_perc
		R1ReferralCreditPerc, ok := item["r1_referral_credit_perc"].(string)
		if !ok || R1ReferralCreditPerc == "" {
			log.FuncErrorTrace(0, "Failed to get r1_referral_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R1ReferralCreditPerc = ""
		}

		// r1_addr_resp
		R1AddrResp, ok := item["r1_addr_resp"].(string)
		if !ok || R1AddrResp == "" {
			log.FuncErrorTrace(0, "Failed to get r1_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R1AddrResp = ""
		}

		// r2_pay_scale
		R2PayScale, ok := item["r2_pay_scale"].(float64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get r2_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R2PayScale = 0.0
		}

		// r2_referral_credit_$
		R2ReferralCredit, ok := item["r2_referral_credit_$"].(string)
		if !ok || R2ReferralCredit == "" {
			log.FuncErrorTrace(0, "Failed to get r2_referral_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R2ReferralCredit = ""
		}

		// r2_referral_credit_perc
		R2ReferralCreditPerc, ok := item["r2_referral_credit_perc"].(string)
		if !ok || R2ReferralCreditPerc == "" {
			log.FuncErrorTrace(0, "Failed to get r2_referral_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R2ReferralCreditPerc = ""
		}

		// r2_addr_resp
		R2AddrResp, ok := item["r2_addr_resp"].(string)
		if !ok || R2AddrResp == "" {
			log.FuncErrorTrace(0, "Failed to get r2_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R2AddrResp = ""
		}

		// start_date
		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		// end_date
		EndDate, ok := item["end_date"].(*string)
		if !ok || EndDate == nil {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = nil
		}

		ReferralData := models.GetReferralData{
			RecordId:             RecordId,
			UniqueID:             UniqueID,
			NewCustomer:          NewCustomer,
			ReferrerSerial:       ReferrerSerial,
			ReferrerName:         ReferrerName,
			Amount:               Amount,
			RepDollDivbyPer:      RepDollDivbyPer,
			Notes:                Notes,
			Type:                 Type,
			Rep1Name:             Rep1Name,
			Rep2Name:             Rep2Name,
			SysSize:              SysSize,
			RepCount:             RepCount,
			State:                State,
			PerRepAddrShare:      PerRepAddrShare,
			PerRepOvrdShare:      PerRepOvrdShare,
			R1PayScale:           R1PayScale,
			R1ReferralCredit:     R1ReferralCredit,
			R1ReferralCreditPerc: R1ReferralCreditPerc,
			R1AddrResp:           R1AddrResp,
			R2PayScale:           R2PayScale,
			R2ReferralCredit:     R2ReferralCredit,
			R2ReferralCreditPerc: R2ReferralCreditPerc,
			R2AddrResp:           R2AddrResp,
			StartDate:            StartDate,
			EndDate:              EndDate,
		}

		pReferral.ReferralDataList.ReferralDataList = append(pReferral.ReferralDataList.ReferralDataList, ReferralData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateReferralForUniqueId
* DESCRIPTION:     calculates the credit value based on the unique Id
* RETURNS:         credit
*****************************************************************************/
func (pReferral *ReferralDataStruct) CalculateReferralForUniqueId(dealer string, uniqueId string) (referral float64) {

	log.EnterFn(0, "CalculateReferralForUniqueId")
	defer func() { log.ExitFn(0, "CalculateReferralForUniqueId", nil) }()

	referral = 0.0
	if len(dealer) > 0 {
		for _, data := range pReferral.ReferralDataList.ReferralDataList {
			if data.UniqueID == uniqueId {
				amnt, _ := strconv.Atoi(data.Amount)
				if amnt > 0 { //need to change amount of type string to float64
					referral += float64(amnt)
				}
			}
		}
	}
	return referral
}
