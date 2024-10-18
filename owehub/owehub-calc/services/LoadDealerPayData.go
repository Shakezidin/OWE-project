package services

import (
	log "OWEApp/shared/logger"
	oweconfig "OWEApp/shared/oweconfig"
)

func LoadDealerPayData() (err error) {
	InitailData, err := oweconfig.LoadDlrPayInitialData()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dlrpay initial data with err: %v", err)
		return err
	}
}
