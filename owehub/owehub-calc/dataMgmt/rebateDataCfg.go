/**************************************************************************
* File            : adderDataCfg.go
* DESCRIPTION     : This file contains the model and data form adderData
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strconv"
)

type GetRebateDataTemp struct {
	RecordId           int64   `json:"record_id"`
	UniqueId           string  `json:"unique_id"`
	CustomerVerf       string  `json:"customer_verf"`
	TypeRdMktg         string  `json:"type_rd_mktg"`
	Item               string  `json:"item"`
	Amount             float64 `json:"amount"`
	RepDollDivbyPer    float64 `json:"rep_doll_divby_per"`
	Notes              string  `json:"notes"`
	Type               string  `json:"type"`
	Rep_1_Name         string  `json:"rep1_name"`
	Rep_2_Name         string  `json:"rep2_name"`
	SysSize            float64 `json:"sys_size"`
	RepCount           float64 `json:"rep_count"`
	State              string  `json:"state"`
	PerRepAddrShare    float64 `json:"per_rep_addr_share"`
	PerRepOvrdShare    float64 `json:"per_rep_ovrd_share"`
	R1PayScale         float64 `json:"r1_pay_scale"`
	Rep1DefResp        string  `json:"rep1_def_resp"`
	R1AddrResp         string  `json:"r1_addr_resp"`
	R2PayScale         float64 `json:"r2_pay_scale"`
	PerRepDefOvrd      string  `json:"per_rep_def_ovrd"`
	R1RebateCredit     string  `json:"r1_rebate_credit"`
	R1RebateCreditPerc string  `json:"r1_rebate_credit_perc"`
	R2RebateCredit     string  `json:"r2_rebate_credit"`
	R2RebateCreditPerc string  `json:"r2_rebate_credit_perc"`
	StartDate          string  `json:"start_date"`
	EndDate            string  `json:"end_date"`
	AdderAmount        string
}

type RebateCfgStruct struct {
	RebateList []GetRebateDataTemp
}

var (
	RebateCfg RebateCfgStruct
)

func (RebateCfg *RebateCfgStruct) LoadRebateCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadAdderDataCfg")
	defer func() { log.ExitFn(0, "LoadAdderDataCfg", err) }()

	query = `
      SELECT rd.id as record_id, rd.unique_id, rd.customer_verf, rd.type_rd_mktg, rd.item, rd.amount, rd.rep_doll_divby_per, rd.notes, rd.type,
      ud1.name as rep_1_name, ud2.name as rep_2_name, rd.sys_size, rd.rep_count, st.name, rd.per_rep_addr_share, rd.per_rep_ovrd_share,
      rd.r1_pay_scale, rd.rep_1_def_resp, rd.r1_addr_resp, rd.r2_pay_scale, rd.per_rep_def_ovrd, rd."r1_rebate_credit_$", rd.r1_rebate_credit_perc,
      rd."r2_rebate_credit_$", rd.r2_rebate_credit_perc,  rd.start_date, rd.end_date
      FROM rebate_data rd
      LEFT JOIN states st ON st.state_id = rd.state_id
      LEFT JOIN user_details ud1 ON ud1.user_id = rd.rep_1
      LEFT JOIN user_details ud2 ON ud2.user_id = rd.rep_2`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rebate data from DB err: %v", err)
		return
	}
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}
		// unique_id
		Unique_id, ok := item["unique_id"].(string)
		if !ok || Unique_id == "" {
			// log.FuncErrorTrace(0, "Failed to get unique_id for Record ID %v. Item: %+v\n", RecordId, item)
			Unique_id = ""
		}

		// customer_verf
		Customer_verf, ok := item["customer_verf"].(string)
		if !ok || Customer_verf == "" {
			// log.FuncErrorTrace(0, "Failed to get customer verf for Record ID %v. Item: %+v\n", RecordId, item)
			Customer_verf = ""
		}

		// type_rd_mktg
		Type_rd_mktg, ok := item["type_rd_mktg"].(string)
		if !ok || Type_rd_mktg == "" {
			// log.FuncErrorTrace(0, "Failed to get Type_rd_mktg for Record ID %v. Item: %+v\n", RecordId, item)
			Type_rd_mktg = ""
		}

		// item
		Item, ok := item["item"].(string)
		if !ok || Item == "" {
			// log.FuncErrorTrace(0, "Failed to get item for Record ID %v. Item: %+v\n", RecordId, item)
			Item = ""
		}

		// amount
		Amount, ok := item["amount"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0
		}

		AdderAmount, ok := item["adder_amount"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get amount for Record ID %v. Item: %+v\n", RecordId, item)
			Amount = 0
		}

		// rep_doll_divby_per
		Rep_doll_divby_per, ok := item["rep_doll_divby_per"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep_doll_divby_per for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_doll_divby_per = 0.0
		}

		// notes
		Notes, ok := item["notes"].(string)
		if !ok || Notes == "" {
			// log.FuncErrorTrace(0, "Failed to get notes value for Record ID %v. Item: %+v\n", RecordId, item)
			Notes = ""
		}

		// type
		Type, ok := item["type"].(string)
		if !ok || Type == "" {
			// log.FuncErrorTrace(0, "Failed to get notes_not_rep_visible for Record ID %v. Item: %+v\n", RecordId, item)
			Type = ""
		}

		// rep_1_name
		Rep_1_name, ok := item["rep_1_name"].(string)
		if !ok || Rep_1_name == "" {
			// log.FuncErrorTrace(0, "Failed to get rep_1_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_1_name = ""
		}

		// rep_2_name
		Rep_2_name, ok := item["rep_2_name"].(string)
		if !ok || Rep_2_name == "" {
			// log.FuncErrorTrace(0, "Failed to get rep_2_name for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_2_name = ""
		}

		// sys_size
		Sys_size, ok := item["sys_size"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get sys size for Record ID %v. Item: %+v\n", RecordId, item)
			Sys_size = 0.0
		}

		// rep_count
		Rep_count, ok := item["rep_count"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get rep count for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_count = 0.0
		}

		// name
		StateName, ok := item["name"].(string)
		if !ok || StateName == "" {
			// log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		// per_rep_addr_share
		Per_rep_addr_share, ok := item["per_rep_addr_share"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get per_rep_addr_share for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_addr_share = 0.0
		}

		// per_rep_ovrd_share
		Per_rep_ovrd_share, ok := item["per_rep_ovrd_share"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get per_rep_ovrd_share for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_ovrd_share = 0.0
		}

		// r1_pay_scale
		R1_pay_scale, ok := item["r1_pay_scale"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get r1_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R1_pay_scale = 0.0
		}

		// rep_1_def_resp
		Rep_1_def_resp, ok := item["rep_1_def_resp"].(string)
		if !ok || Rep_1_def_resp == "" {
			// log.FuncErrorTrace(0, "Failed to get rep_1_def_resp for Record ID %v. Item: %+v\n", RecordId, item)
			Rep_1_def_resp = ""
		}

		// r1_addr_resp
		R1_addr_resp, ok := item["r1_addr_resp"].(string)
		if !ok || R1_addr_resp == "" {
			// log.FuncErrorTrace(0, "Failed to get r1_addr_resp for Record ID %v. Item: %+v\n", RecordId, item)
			R1_addr_resp = ""
		}

		// r2_pay_scale
		R2_pay_scale, ok := item["r2_pay_scale"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get r2_pay_scale for Record ID %v. Item: %+v\n", RecordId, item)
			R2_pay_scale = 0.0
		}

		// per_rep_def_ovrd
		Per_rep_def_ovrd, ok := item["per_rep_def_ovrd"].(string)
		if !ok || Per_rep_def_ovrd == "" {
			// log.FuncErrorTrace(0, "Failed to get per_rep_def_ovrd for Record ID %v. Item: %+v\n", RecordId, item)
			Per_rep_def_ovrd = ""
		}

		// r1_rebate_credit_$
		R1_rebate_credit, ok := item["r1_rebate_credit_$"].(string)
		if !ok || R1_rebate_credit == "" {
			// log.FuncErrorTrace(0, "Failed to get r1_rebate_credit_$ for Record ID %v. Item: %+v\n", RecordId, item)
			R1_rebate_credit = ""
		}

		// r1_rebate_credit_perc
		R1_rebate_credit_perc, ok := item["r1_rebate_credit_perc"].(string)
		if !ok || R1_rebate_credit_perc == "" {
			// log.FuncErrorTrace(0, "Failed to get r1_rebate_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R1_rebate_credit_perc = ""
		}

		// project_base_cost
		R2_rebate_credit, ok := item["r2_rebate_credit_$"].(string)
		if !ok || R2_rebate_credit == "" {
			// log.FuncErrorTrace(0, "Failed to get R2_rebate_credit for Record ID %v. Item: %+v\n", RecordId, item)
			R2_rebate_credit = ""
		}

		// crt_addr
		R2_rebate_credit_perc, ok := item["r2_rebate_credit_perc"].(string)
		if !ok || R2_rebate_credit_perc == "" {
			// log.FuncErrorTrace(0, "Failed to get R2_rebate_credit_perc for Record ID %v. Item: %+v\n", RecordId, item)
			R2_rebate_credit_perc = ""
		}

		// start_date
		Start_date, ok := item["start_date"].(string)
		if !ok || Start_date == "" {
			// log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			Start_date = ""
		}

		// EndDate
		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			// log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		RebateData := GetRebateDataTemp{
			RecordId:           RecordId,
			UniqueId:           Unique_id,
			CustomerVerf:       Customer_verf,
			TypeRdMktg:         Type_rd_mktg,
			Item:               Item,
			Amount:             Amount,
			RepDollDivbyPer:    Rep_doll_divby_per,
			Notes:              Notes,
			Type:               Type,
			Rep_1_Name:         Rep_1_name,
			Rep_2_Name:         Rep_2_name,
			SysSize:            Sys_size,
			RepCount:           Rep_count,
			State:              StateName,
			PerRepAddrShare:    Per_rep_addr_share,
			PerRepOvrdShare:    Per_rep_ovrd_share,
			R1PayScale:         R1_pay_scale,
			Rep1DefResp:        Rep_1_def_resp,
			R1AddrResp:         R1_addr_resp,
			R2PayScale:         R2_pay_scale,
			PerRepDefOvrd:      Per_rep_def_ovrd,
			R1RebateCredit:     R1_rebate_credit,
			R1RebateCreditPerc: R1_rebate_credit_perc,
			R2RebateCredit:     R2_rebate_credit,
			R2RebateCreditPerc: R2_rebate_credit_perc,
			StartDate:          Start_date,
			EndDate:            EndDate,
			AdderAmount:        AdderAmount,
		}

		RebateCfg.RebateList = append(RebateCfg.RebateList, RebateData)
	}
	return err
}

/******************************************************************************
* FUNCTION:        CalculateRebate
* DESCRIPTION:     calculates the ap rep value based on the unique Id
* RETURNS:         credit
*****************************************************************************/

func (RebateCfg *RebateCfgStruct) CalculateRebate(dealer string, uniqueId string) (rebate float64) {

	log.EnterFn(0, "LoadRebateCfg")
	defer func() { log.ExitFn(0, "LoadRebateCfg", nil) }()

	if len(dealer) > 0 {
		for _, data := range RebateCfg.RebateList {
			if data.UniqueId == uniqueId {
				var addramount float64
				amnt, _ := strconv.Atoi(data.AdderAmount)
				log.FuncErrorTrace(0, "amount ========= %v", amnt)
				if amnt > 0 { //need to change amoun of type string to float64
					if len(data.Type) >= 9 && data.Type[:9] == "Retention" {
						addramount = 0
					} else {
						addramount = float64(amnt)
					}
				}
				rebate += addramount
			}
		}
	}
	return rebate
}
