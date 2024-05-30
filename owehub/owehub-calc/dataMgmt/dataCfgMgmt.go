/**************************************************************************
* File            : dataCfgMgmt.go
* DESCRIPTION     : This file contains the functionsto access data and
					 configs
* DATE            : 10-May-2024
**************************************************************************/

package datamgmt

import log "OWEApp/shared/logger"

func LoadConfigurations() (err error) {

	// log.EnterFn(0, "LoadConfigurations")
	// defer func() { log.ExitFn(0, "LoadConfigurations", err) }()

	/* Feth Config from DB */
	//* ar config is working
	// err = ArCfgData.LoadARCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
	// 	return err
	// }

	//* ar schedule is working
	// err = ArSkdConfig.LoadArSkdCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get AR Skd Config from DB err: %+v", err)
	// 	return err
	// }

	//* adder data is working
	// err = AdderDataCfg.LoadAdderDataCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Adder Data Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== adder data : %+v", AdderDataCfg.AdderDataList.AdderDataList[0])

	//* adjustemnts is working
	// err = AdjustmentsConfig.LoadAdjustmentsCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Adjustments Config from DB err: %+v", err)
	// 	return err
	// }

	//* ap rep is working
	// err = ApRepCfg.LoadApRepCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get AP-Rep Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== ApRepCfg : %+v", ApRepCfg.ApRepList.ApRepList[0])

	//* rebate data is working
	// err = RebateCfg.LoadRebateCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== RebateCfg : %+v", RebateCfg.RebateList.RebateDataList[0])

	//* dealer credit data is working
	// err = DealerCreditCfg.LoadDlrCreditCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== DealerCreditCfg : %+v", DealerCreditCfg.DealerCreditList.DealerCreditList[0])

	//* referral data is working
	// err = ReferralDataConfig.LoadReferralCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== ReferralDataConfig : %+v", ReferralDataConfig.ReferralDataList[0])

	//* pay schedule data is working
	// err = PayScheduleCfg.LoadPayScheduleCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== PayScheduleCfg : %+v", PayScheduleCfg.PayScheduleList[0])

	//* loan fee is working
	// err = LoanFeeAdderCfg.LoadLoanFeeAdderCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== LoanFeeAdderCfg : %+v", LoanFeeAdderCfg.LoanFeeAdderList.LoanFeeAdderList[0])

	//* dealer override data is working
	// err = DealerOverrideConfig.LoadRDealerOverrideCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== DealerOverrideConfig : %+v", DealerOverrideConfig.DealerOverrideList.DealersList[0])

	//! dealer override data is not working
	err = AutoAdderCfg.LoadAutoAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== AutoAdderCfg : %+v", AutoAdderCfg.AutoAdderList[0])

	return err
}