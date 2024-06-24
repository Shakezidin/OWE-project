/**************************************************************************
* File            : adderResp.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type GetAdderRespList struct {
	PayScale   string  `json:"pay_scale"`
	Percentage float64 `json:"percentage"`
}

type adderRespCfgStruct struct {
	adderRespList []GetAdderRespList
}

var (
	adderRespCfg adderRespCfgStruct
)

func (adderRespCfg *adderRespCfgStruct) LoadadderRespCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT *
	FROM adder_responsibility dc`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		PayScale, ok := item["pay_scale"].(string)
		if !ok || PayScale == "" {
			// log.FuncErrorTrace(0, "Failed to get PayScale data from DB err")
			PayScale = ""
		}

		Percentage, ok := item["percentage"].(float64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get Percentage data from DB err")
			Percentage = 0
		}

		GetAdderRespList := GetAdderRespList{
			PayScale:   PayScale,
			Percentage: Percentage,
		}

		adderRespCfg.adderRespList = append(adderRespCfg.adderRespList, GetAdderRespList)
	}

	return err
}

/******************************************************************************
* FUNCTION:        CalculateadderResp
* DESCRIPTION:     calculates the repayment bonus value based on the provided data
* RETURNS:         dlrPayBonus float64
*****************************************************************************/
func (adderRespCfg *adderRespCfgStruct) CalculateAdderResp(r1PayScale string) (adderResp float64) {
	for _, data := range adderRespCfg.adderRespList {
		if r1PayScale == data.PayScale {
			return data.Percentage
		}
	}
	return adderResp
}