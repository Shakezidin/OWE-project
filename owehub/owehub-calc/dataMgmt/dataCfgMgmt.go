/**************************************************************************
* File            : dataCfgMgmt.go
* DESCRIPTION     : This file contains the functionsto access data and
					 configs
* DATE            : 10-May-2024
**************************************************************************/

package datamgmt

import log "OWEApp/shared/logger"

func LoadConfigurations() (err error) {

	log.EnterFn(0, "LoadConfigurations")
	defer func() { log.ExitFn(0, "LoadConfigurations", err) }()

	/* Feth Config from DB */
	//* ar config is working
	err = ArCfgData.LoadARCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
		return err
	}

	//* ar schedule is working
	err = ArSkdConfig.LoadArSkdCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Skd Config from DB err: %+v", err)
		return err
	}

	//* adder data is working
	err = AdderDataCfg.LoadAdderDataCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== adder data : %+v", AdderDataCfg.AdderDataList.AdderDataList[0])

	//* adjustemnts is working
	err = AdjustmentsConfig.LoadAdjustmentsCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adjustments Config from DB err: %+v", err)
		return err
	}

	//* ap rep is working
	err = ApRepCfg.LoadApRepCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AP-Rep Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== ApRepCfg : %+v", ApRepCfg.ApRepList.ApRepList[0])

	//* rebate data is working
	err = RebateCfg.LoadRebateCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RebateCfg : %+v", RebateCfg.RebateList[0])

	//* dealer credit data is working
	err = DealerCreditCfg.LoadDlrCreditCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerCreditCfg : %+v", DealerCreditCfg.DealerCreditList.DealerCreditList[0])

	//* referral data is working
	err = ReferralDataConfig.LoadReferralCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== ReferralDataConfig : %+v", ReferralDataConfig.ReferralDataList[0])

	//* pay schedule data is working
	err = PayScheduleCfg.LoadPayScheduleCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== PayScheduleCfg : %+v", PayScheduleCfg.PayScheduleList[0])

	//* loan fee is working
	// err = LoanFeeAdderCfg.LoadLoanFeeAdderCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== LoanFeeAdderCfg : %+v", LoanFeeAdderCfg.LoanFeeAdderList.LoanFeeAdderList[0])

	//* dealer override data is working
	err = DealerOverrideConfig.LoadRDealerOverrideCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerOverrideConfig : %+v", DealerOverrideConfig.DealerOverrideList[0])

	err = ApDealerCfg.LoadApDealerCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== ApDealerCfg : %+v", PayScheduleCfg.PayScheduleList[0])

	err = LoanFeeCfg.LoadLoanFeeCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get LoanFeeCfg from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== LoadLoanFeeCfg : %+v", LoanFeeCfg.LoanFeeCfg.LoanFeeList[0])

	err = TierLoanFeeCfg.LoadTierLoanFeeCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get LoadTierLoanFeeCfg from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== LoadTierLoanFeeCfg : %+v", TierLoanFeeCfg.TierLoanFeeList.TierLoanFeeList[0])

	// err = TierLoanFeeCfg.LoadTierLoanFeeCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get LoadTierLoanFeeCfg from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== LoadTierLoanFeeCfg : %+v", TierLoanFeeCfg.TierLoanFeeList.TierLoanFeeList[0])

	// err = TierLoanFeeCfg.LoadTierLoanFeeCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get DealerRepaymentBonus from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== LoadTierLoanFeeCfg : %+v", TierLoanFeeCfg.TierLoanFeeList.TierLoanFeeList[0])

	//! dealer override data is not working, no need for now
	// err = AutoAdderCfg.LoadAutoAdderCfg()
	// if err != nil {
	// 	log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
	// 	return err
	// }
	// log.FuncErrorTrace(0, "===== AutoAdderCfg : %+v", AutoAdderCfg.AutoAdderList[0])
	err = DealerRepayConfig.LoadDealerRepaymentCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DealerRepaymentConfig from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerRepaymentConfig : %+v", DealerRepayConfig.DealerRepaymentList[0])

	return err
}
