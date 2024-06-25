/**************************************************************************
* File            : dealerOwnersCfg.go
* DESCRIPTION     : This file contains the model and data form dealer Owners
* DATE            : 05-May-2024
**************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
)

type GetDealerOwners struct {
	RecordId    int64  `json:"record_id"`
	DealerOwner string `json:"dealer_owner"`
	Role        string `json:"role"`
	Blank       string `json:"blank"`
}

type DealerOwnersStruct struct {
	DealerOwnersList []GetDealerOwners
}

var (
	DealerOwnersConfig DealerOwnersStruct
)

func (pDealerOwner *DealerOwnersStruct) LoadRDealerOwnersCfg() (err error) {
	var (
		data         []map[string]interface{}
		whereEleList []interface{}
		query        string
	)
	log.EnterFn(0, "LoadRDealerOwnersCfg")
	defer func() { log.ExitFn(0, "LoadRDealerOwnersCfg", err) }()

	query = `
	SELECT dor.id as record_id, dor.dealer_owner, dor.role, dor.blank
	FROM dealer_Owners dor`

	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get referral data from DB err: %v", err)
		return err
	}

	for _, item := range data {

		RecordId, ok := item["record_id"].(int64)
		if !ok {
			// log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		// DealerOwner
		DealerOwner, ok := item["dealer_owner"].(string)
		if !ok || DealerOwner == "" {
			// log.FuncErrorTrace(0, "Failed to get sub dealer for Record ID %v. Item: %+v\n", RecordId, item)
			DealerOwner = ""
		}

		Role, ok := item["role"].(string)
		if !ok || Role == "" {
			// log.FuncErrorTrace(0, "Failed to get sale type for Record ID %v. Item: %+v\n", RecordId, item)
			Role = ""
		}

		// Blank
		Blank, ok := item["blank"].(string)
		if !ok || Blank == "" {
			// log.FuncErrorTrace(0, "Failed to get dealer name for Record ID %v. Item: %+v\n", RecordId, item)
			Blank = ""
		}

		dealerOwnerData := GetDealerOwners{
			RecordId:    RecordId,
			DealerOwner: DealerOwner,
			Role:        Role,
			Blank:       Blank,
		}
		pDealerOwner.DealerOwnersList = append(pDealerOwner.DealerOwnersList, dealerOwnerData)
	}
	return err
}

func (pDealerOwner *DealerOwnersStruct) CalculateR2Tracking(rep2 string) (r2Tracking string) {
	if len(rep2) > 0 {
		for _, data := range pDealerOwner.DealerOwnersList {
			if data.DealerOwner == rep2 {
				return data.Blank
			}
		}
		return "Sales rep"
	}
	return "No Rep 2"
}

func (pDealerOwner *DealerOwnersStruct) CalculateR1Tracking(rep1 string) (r2Tracking string) {
	for _, data := range pDealerOwner.DealerOwnersList {
		if data.DealerOwner == rep1 {
			return data.Blank
		}
	}
	return "Sales rep"
}
