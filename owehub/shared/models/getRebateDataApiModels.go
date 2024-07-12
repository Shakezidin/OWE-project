/**************************************************************************
 *	Function	: getRebateDataApiModels.go
 *	DESCRIPTION : Files contains struct for get rebate data models
 *	DATE        : 24-Apr-2024
 **************************************************************************/

package models

import "time"

type GetRebateData struct {
	RecordId           int64     `json:"record_id"`
	UniqueId           string    `json:"unique_id"`
	CustomerVerf       string    `json:"customer_verf"`
	TypeRdMktg         string    `json:"type_rd_mktg"`
	Item               string    `json:"item"`
	Amount             string    `json:"amount"`
	RepDollDivbyPer    float64   `json:"rep_doll_divby_per"`
	Notes              string    `json:"notes"`
	Type               string    `json:"type"`
	Rep_1_Name         string    `json:"rep1_name"`
	Rep_2_Name         string    `json:"rep2_name"`
	SysSize            float64   `json:"sys_size"`
	RepCount           float64   `json:"rep_count"`
	State              string    `json:"state"`
	PerRepAddrShare    float64   `json:"per_rep_addr_share"`
	PerRepOvrdShare    float64   `json:"per_rep_ovrd_share"`
	R1PayScale         string   `json:"r1_pay_scale"`
	Rep1DefResp        float64   `json:"rep1_def_resp"`
	R1AddrResp         float64   `json:"r1_addr_resp"`
	R2PayScale         string   `json:"r2_pay_scale"`
	PerRepDefOvrd      float64   `json:"per_rep_def_ovrd"`
	R1RebateCredit     float64   `json:"r1_rebate_credit"`
	R1RebateCreditPerc float64   `json:"r1_rebate_credit_perc"`
	R2RebateCredit     float64   `json:"r2_rebate_credit"`
	R2RebateCreditPerc float64   `json:"r2_rebate_credit_perc"`
	Date               time.Time `json:"start_date"`
}

type GetRebateDataList struct {
	RebateDataList []GetRebateData `json:"rebate_data_list"`
}
