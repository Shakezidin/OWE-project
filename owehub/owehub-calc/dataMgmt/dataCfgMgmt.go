/**************************************************************************
* File            : dataCfgMgmt.go
* DESCRIPTION     : This file contains the functionsto access data and
					 configs
* DATE            : 10-May-2024
**************************************************************************/

package datamgmt

import (
	log "OWEApp/shared/logger"
)

func LoadConfigurations() (err error) {

	// log.EnterFn(0, "LoadConfigurations")
	// defer func() { log.ExitFn(0, "LoadConfigurations", err) }()

	/* Feth Config from DB */
	err = ArCfgData.LoadARCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
		return err
	}
	err = ArSkdConfig.LoadArSkdCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Skd Config from DB err: %+v", err)
		return err
	}
	err = AdderDataCfg.LoadAdderDataCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder Data Config from DB err: %+v", err)
		return err
	}
	err = AdjustmentsConfig.LoadAdjustmentsCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adjustments Config from DB err: %+v", err)
		return err
	}

	log.FuncErrorTrace(0, "===== adder data : %+v", AdderDataCfg.AdderDataList.AdderDataList)
	return err
}
