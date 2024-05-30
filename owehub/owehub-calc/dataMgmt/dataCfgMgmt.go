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
	// err = ArCfgData.LoadARCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
	// 	return err
	// }
	// err = ArSkdConfig.LoadArSkdCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get AR Skd Config from DB err: %+v", err)
	// 	return err
	// }

	err = AdderDataCfg.LoadAdderDataCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== adder data : %+v", AdderDataCfg.AdderDataList.AdderDataList[0])

	// err = AdjustmentsConfig.LoadAdjustmentsCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Adjustments Config from DB err: %+v", err)
	// 	return err
	// }

	err = ApRepCfg.LoadApRepCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AP-Rep Config from DB err: %+v", err)
		log.FuncErrorTrace(0, "++++++++++++++++++++++=======================+++++++++++++++++++++++++++++=============++++++++++++++++++++++++++++++++++++=========================+++++++++++++++:")

		return err
	}
	log.FuncErrorTrace(0, "===== ApRepCfg : %+v", ApRepCfg.ApRepList.ApRepList[0])

	err = RebateCfg.LoadRebateCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RebateCfg : %+v", RebateCfg.RebateList.RebateDataList[0])

	err = PayScheduleCfg.LoadPayScheduleCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== PayScheduleCfg : %+v", PayScheduleCfg.PayScheduleList.PaymentScheduleList[0])

	err = DealerCreditCfg.LoadDlrCreditCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerCreditCfg : %+v", DealerCreditCfg.DealerCreditList.DealerCreditList[0])

	err = AutoAdderCfg.LoadAutoAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== AutoAdderCfg : %+v", AutoAdderCfg.AutoAdderList[0])

	err = LoanFeeAdderCfg.LoadLoanFeeAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== LoanFeeAdderCfg : %+v", LoanFeeAdderCfg.LoanFeeAdderList.LoanFeeAdderList[0])

	err = ReferralDataConfig.LoadReferralCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== ReferralDataConfig : %+v", ReferralDataConfig.ReferralDataList.ReferralDataList[0])

	err = DealerOverrideConfig.LoadRDealerOverrideCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerOverrideConfig : %+v", DealerOverrideConfig.DealerOverrideList.DealersList[0])

	err = PayScheduleCfg.LoadPayScheduleCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== PayScheduleCfg : %+v", PayScheduleCfg.PayScheduleList.PaymentScheduleList[0])

	return err
}
