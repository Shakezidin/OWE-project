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
	//* reconcile is working
	err = ReconcileCfgData.LoadReconcileCfg()
	if err != nil {
		// log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "=== ReconcileCfgData ->: %+v", ReconcileCfgData.ReconcileList.ReconcileList[0])

	// ar config is working
	err = ArCfgData.LoadARCfg()
	if err != nil {
		// log.FuncErrorTrace(0, "Failed to get AR Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "=== ArCfgData ->: %+v", ArCfgData.arCfgList[0])

	//* ar schedule is working
	err = ArSkdConfig.LoadArSkdCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get AR Skd Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "=== ArSkdConfig ->: %+v", ArSkdConfig.ArSkdConfigList[0])

	//* dealer tier is working
	err = DealerTierCfg.LoadDealerTierCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get dealer tier Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== dealer tier : %+v", DealerTierCfg.DealerTierList.DealersTierList[0])

	//* adder data is working
	err = AdderDataCfg.LoadAdderDataCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adder Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== AdderDataCfg : %+v", AdderDataCfg.AdderDataList[0])

	//* adjustemnts is working
	err = AdjustmentsConfig.LoadAdjustmentsCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Adjustments Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "=== AdjustmentsConfig ->: %+v", AdjustmentsConfig.AdjustmentsConfigList.AdjustmentsList[0])

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

	//* pay schedule data is working
	err = PayScheduleCfg.LoadPayScheduleCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== PayScheduleCfg : %+v", PayScheduleCfg.PayScheduleList[0])

	//* loan fee is working
	err = LoanFeeAdderCfg.LoadLoanFeeAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== LoanFeeAdderCfg : %+v", LoanFeeAdderCfg.LoanFeeAdderList[0])

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
	log.FuncErrorTrace(0, "===== ApDealerCfg : %+v", ApDealerCfg.ApDealerList[0])

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

	err = AutoAdderCfg.LoadAutoAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rebate Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== AutoAdderCfg : %+v", AutoAdderCfg.AutoAdderList[0])

	err = DealerRepayConfig.LoadDealerRepaymentCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DealerRepaymentConfig from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DealerRepaymentConfig : %+v", DealerRepayConfig.DealerRepaymentList[0])

	//! auto adder
	err = AutoAdderCfg.LoadAutoAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Auto Adder Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== AutoAdder : %+v", AdderDataCfg.AdderDataList[0])

	//! comm rate
	err = CmmsnRatesCfg.LoadcmmsnRatesCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Comm Rate Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== CommRate : %+v", CmmsnRatesCfg.cmmsnRatesList[0])

	//! DBA
	err = DBACfg.LoadDBACfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get DBA Data Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== DBA : %+v", DBACfg.DBAList[0])

	//! loan fee adder
	err = LoanFeeAdderCfg.LoadLoanFeeAdderCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Loan Fee Adder Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== LoanFeeAdder : %+v", LoanFeeAdderCfg.LoanFeeAdderList[0])

	//! rate adjustments
	err = RateAdjustmentsCfg.LoadRateAdjustmentsCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Rate Adjustments Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RateAdjustments : %+v", RateAdjustmentsCfg.RateAdjustmentsList[0])

	//! referral data
	err = ReferralDataConfig.LoadReferralCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get Referral Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== ReferralDataConfig : %+v", ReferralDataConfig.ReferralDataList[0])

	//! rep credit
	err = RepCreditCfg.LoadRepCreditlCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rep credit Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RepCredit : %+v", RepCreditCfg.RepCreditList[0])

	//! rep incent
	err = RepIncentCfg.LoadRepIncentCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rep incent Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RepIncent : %+v", RepIncentCfg.RepIncentList[0])

	//! rep pay
	err = RepPayCfg.LoadRepPayCfg()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get rep pay Config from DB err: %+v", err)
		return err
	}
	log.FuncErrorTrace(0, "===== RepPay : %+v", RepPayCfg.RepPayList.RepPaySettingsList[0])

	return err
}
