/**************************************************************************
* File            : VDealer.go
* DESCRIPTION     : This file contains the model and data form dealer
                     credit config
* DATE            : 19-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
)

type VDealer struct {
	DealerCode  string
	DealerName  string
	Description string
}

type VDealerCfgStruct struct {
	VDealerList []VDealer
}

var (
	VDealerCfg VDealerCfgStruct
)

func (pVDealerCfg *VDealerCfgStruct) LoadVDealerCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)

	query = `
	SELECT *
	FROM v_dealer`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if (err != nil) || (data == nil) {
		// log.FuncErrorTrace(0, "Failed to get dealer credit data from DB err: %v", err)
		return err
	}

	VDealerCfg.VDealerList = VDealerCfg.VDealerList[:0]
	for _, item := range data {

		DealerCode, ok := item["dealer_code"].(string)
		if !ok || DealerCode == "" {
			// log.FuncErrorTrace(0, "Failed to get preferred name data from DB err")
			DealerCode = ""
		}

		DealerName, ok := item["dealer_name"].(string)
		if !ok || DealerName == "" {
			// log.FuncErrorTrace(0, "Failed to get VDealer data from DB err")
			DealerName = ""
		}

		Description, ok := item["description"].(string)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get preferred name data from DB err")
			Description = ""
		}

		VDealerList := VDealer{
			DealerCode:  DealerCode,
			DealerName:  DealerName,
			Description: Description,
		}

		VDealerCfg.VDealerList = append(VDealerCfg.VDealerList, VDealerList)
	}

	return err
}

func (pVDealerCfg *VDealerCfgStruct) CalculateDealerDBA(dealer string) (dealerDba string) {
	if len(dealer) > 0 {
		for _, data := range pVDealerCfg.VDealerList {
			if data.DealerName == dealer {
				return data.DealerCode
			}
		}
	}
	return dealerDba
}
