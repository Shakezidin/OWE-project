/**************************************************************************
* File            : dlrPayInitCalc.go
* DESCRIPTION     : This file contains functions to perform
*                          Calculations for DealerPay
* DATE            : 28-April-2024
**************************************************************************/
 
package arcalc
 
import (
    common "OWEApp/owehub-calc/common"
    dataMgmt "OWEApp/owehub-calc/dataMgmt"
    db "OWEApp/shared/db"
    log "OWEApp/shared/logger"
    "time"
)
 
/******************************************************************************
* FUNCTION:            ExecDlrPayInitialCalculation
* DESCRIPTION:        Execute initial calculations for DealerPay
* INPUT:                       N/A
* RETURNS:             error
*****************************************************************************/
func ExecDlrPayInitialCalculation(resultChan chan string) {
    var (
        err            error
        dlrPayDataList []map[string]interface{}
    )
    log.EnterFn(0, "ExecDlrPayInitialCalculation")
    defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()
 
    for _, saleData := range dataMgmt.SaleData.SaleDataList {
        var dlrPayData map[string]interface{}
        dlrPayData, err = CalculateDlrPayProject(saleData)
        if err != nil || dlrPayData == nil {
            if len(saleData.UniqueId) <= 0 {
                log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data for unique id : %+v err: %+v", saleData.UniqueId, err)
            } else {
                log.FuncErrorTrace(0, "Failed to calculate DLR Pay Data err : %+v", err)
            }
        } else {
            dlrPayDataList = append(dlrPayDataList, dlrPayData)
        }
    }
    /* Update Calculated and Fetched data AR.Data Table */
    err = db.AddMultipleRecordInDB(db.OweHubDbIndex, db.TableName_DLR_PAY_APCALC, dlrPayDataList)
    if err != nil {
        log.FuncErrorTrace(0, "Failed to insert initial AR Data in DB err: %v", err)
    }
 
    resultChan <- "SUCCESS"
}
 
/******************************************************************************
* FUNCTION:        CalculateDlrPayProject
* DESCRIPTION:     calculate the calculated data for DLR Pay
* RETURNS:         outData
*****************************************************************************/
func CalculateDlrPayProject(saleData dataMgmt.SaleDataStruct) (outData map[string]interface{}, err error) {
    var (
        status        string
        dealer        string    // a
        partner       string    // b
        installer     string    // c
        source        string    // d
        types         string    // e
        loanType      string    // f
        uniqueId      string    // g
        homeOwner     string    // h
        streetAddress string    // i
        city          string    // j
        st            string    // k
        zip           string    // l
        rep_1         string    // m
        rep_2         string    // n
        ApptSetter    string    // o
        SysSize       float64   // p
        kwh           float64   // q
        contract      float64   // r
        epc           float64   // s
        created       time.Time // T
        wc            time.Time // u
        pp            time.Time // v
        ntp           time.Time // w
        permSub       time.Time // x
        permApp       time.Time // y
        icSub         time.Time // z
        icApp         time.Time // aa
        hand          bool      // ab -- doubt
        cancel        time.Time // ac
        instSys       time.Time // ad
        instElec      time.Time // ae
        fca           time.Time // af
        pto           time.Time // ag
 
        status             string    // aj
        statusDate         time.Time // ak
        contractCalc       float64   // am
        epcCalc            float64   // an
        dealer             string    // ap
        dealerDba          string    // aq
        rl                 float64   // ar
        credit             float64   // as
        repPay             float64   // at
        payRateSemi        float64   // au
        addr               float64   // av
        expense            float64   // aw
        autoAdder          float64   // ax
        loanFee            float64   // ay
        rebate             float64   // az
        referral           float64   // ba
        adderTot           float64   // bb
        adderLF            float64   // bc
        epc                float64   // bd
        netEpc             float64   // be
        adderPerKw         float64   // bf
        payRate            float64   // bg
        commTotal          float64   // bh
        statusCheck        float64   // bi
        dealerPaymentBonus float64   // bj
        parentDlr          string    // bk
        payRate            float64   // bl
        dealerDba          string    // bm
        overdTotal         float64   // bn
 
        DlrDrawPerc  float64   // bp
        DlrDrawMax   float64   // bq
        r1DrawAmt    float64   // bs
        r1DrawPaid   float64   // bt
        amtCheck     float64   // bu
        r1CommPaid   float64   // bv
        r1Balance    float64   // bw
        ovrdPaid     float64   // by
        ovrdBalance  float64   // bz
        Status       string    // cb
        StatusDate   time.Time // cc
        repCount     float64   // cd
        perRepSales  float64   // ce
        perRepkW     float64   // cf
        contractCalc float64   // ch
        epcCalc      float64   // ci
        loanFee2     float64   // cj unocomment if referred
        rep1Team     string    // ck
        rep2Team     string    // cl
        teamCount    float64   // cm
        perTeamSales float64   // cn
        perTeamKw    float64   // co
 
        r1Name            string  // cq
        rep1Dba           float64 // cr
        r1PayScale        float64 // cs
        position          float64 // ct
        rl                string  // cu
        r1Rate            string  // cv
        r1Incentive       string  // cz
        r1Credit          float64 // da
        r1PayRateSemi     float64 // db
        r1AddrResp        float64 // dc
        r1Addr            float64 // dd
        r1AutoAddr        float64 // de
        r1LoanFee         float64 // df
        r1Rebate          float64 // dg
        r1Referral        float64 // dh
        r1Rr              float64 // di
        r1AdderTotal      float64 // dj
        r1AdderPerKw      float64 // dk
        r1PayRateSubTotal float64 // dl
        r1NetEpc          float64 // dm
        r1MinmaxCorrect   float64 // dn
        r1CommTotal       float64 // do
        r1CommStatusCheck float64 // dp
 
        r2Name            string  // dr
        rep2Dba           float64 // ds
        r2PayScale        string  // dt
        position2         string  // du
        rl                string  // dv
        r2Rate            string  // dw
        r2Incentive       string  // ea
        r2Credit          float64 // eb
        r2PayRateSemi     float64 // ec
        r2AddrResp        float64 // ed
        r2Addr            float64 // ee
        r2AutoAddr        float64 // ef
        r2LoanFee         float64 // eg
        r2Rebate          float64 // eh
        r2Referral        float64 // ei
        r2Rr              float64 // ej
        r2AdderTotal      float64 // ek
        r2AdderPerKw      float64 // el
        r2PayRateSubTotal float64 // em
        r2NetEpc          float64 // en
        r2MinmaxCorrect   float64 // eo
        r2CommTotal       float64 // ep
        r2CommStatusCheck float64 // eq
    )
 
    log.EnterFn(0, "CalculateDlrPayProject")
    defer func() { log.ExitFn(0, "CalculateDlrPayProject", err) }()
 
    outData = make(map[string]interface{})
 
    // this is from sales data
    outData["dealer"] = saleData.Dealer
    outData["partner"] = saleData.Partner
    outData["instl"] = saleData.Installer
    outData["source"] = saleData.Source
    outData["loan_type"] = saleData.LoanType
    outData["unique_id"] = saleData.UniqueId
    outData["home_owner"] = saleData.HomeOwner
    outData["street_address"] = saleData.Address
    outData["st"] = saleData.State
    outData["rep_1"] = saleData.PrimarySalesRep
    outData["rep_2"] = saleData.SecondarySalesRep
    outData["sys_size"] = saleData.SystemSize
    outData["contract"] = saleData.ContractTotal
    outData["epc"] = saleData.NetEpc
    outData["wc"] = saleData.WC1
    outData["ntp"] = saleData.NtpDate
    outData["perm_sub"] = saleData.PermitSubmittedDate
    outData["perm_app"] = saleData.PermitApprovedDate
    outData["ic_sub"] = saleData.IcSubmittedDate
    outData["ic_app"] = saleData.IcApprovedDate
    outData["cancel"] = saleData.CancelledDate
    outData["inst_sys"] = saleData.PvInstallCompletedDate
    outData["pto"] = saleData.PtoDate
 
    status = saleData.ProjectStatus
    contractCalc = common.CalculateContractAmount(saleData.NetEpc, outData["contract"].(float64), outData["sys_size"].(float64))
    epcCalc = common.CalculateEPCCalc(contractCalc, saleData.WC1, saleData.NetEpc, saleData.SystemSize, common.DlrPayWc1FilterDate)
    // credit = dataMgmt.PayScheduleCfg.CalculateCreaditForUniqueId(saleData.Dealer, saleData.UniqueId)
    adderLF = CalculateAdderLf(saleData.Dealer, addr, expense, autoAdder, loanFee, rebate, referral)
    epc = CalculateAdderEPC(epcCalc, contractCalc, loanFee, SysSize)
    dealer = saleData.Dealer
    // loanFee2 = dataMgmt.LoanFeeAdder.CalculateLoanFee2(saleData.LoanType)
    // r1Credit =
 
    //first sheet calculation
    rl = dataMgmt.PayScheduleCfg.CalculateRL(saleData.Dealer, saleData.Partner, saleData.Installer, saleData.LoanType, saleData.State, saleData.WC1.Format("2006-01-02"))
    payRateSemi = CalculatePayRateSemi(saleData.Dealer, rl, epcCalc)
    addr = dataMgmt.AdderDataCfg.CalculateAddr(saleData.Dealer, saleData.UniqueId)
    expense = dataMgmt.AdderDataCfg.CalculateExpence(saleData.Dealer, saleData.UniqueId)
    autoAdder = dataMgmt.AutoAdderCfg.CalculateAutoAddr(saleData.Dealer, saleData.UniqueId, saleData.ChargeDlr)
    loanFee = dataMgmt.LoanFeeAdderCfg.CalculateLoanFee(saleData.Dealer, saleData.UniqueId)
    rebate = dataMgmt.RebateCfg.CalculateRebate(saleData.Dealer, saleData.UniqueId)
    referral = dataMgmt.ReferralDataConfig.CalculateReferralForUniqueId(saleData.Dealer, saleData.UniqueId)
    parentDlr = dataMgmt.DealerOverrideConfig.CalculateParentDealer(saleData.Dealer, saleData.WC1.Format("2006-01-02"))
    repPay = dataMgmt.ApRepCfg.CalculateApRepForUniqueId(dealer, saleData.UniqueId)
    adderTot = calculateAdderTotal(saleData.UniqueId, addr, autoAdder, rebate, referral)
    netEpc = calculateEpcCalc(epcCalc, contractCalc, adderLF, SysSize)
    adderPerKw = calculateAdderPerKW(dealer, adderLF, SysSize)
    payRate = calculatePayRateSubTotal(dealer, payRateSemi, adderPerKw)
    commTotal = calculateCommTotal(dealer, payRate, SysSize, dealerPaymentBonus)
    overdTotal = calculateOVRDTotal(dealer, payRate, SysSize)
    statusCheck = calculateStatusCheck(dealer, status, expense, commTotal, credit, repPay)
 
    //second sheet calculations
    r1DrawAmt = CalculateR1DrawAmt(statusCheck, DlrDrawMax, DlrDrawPerc)
    // DlrDrawPerc = dataMgmt.PayScheduleCfg.CalculateDlrDrawPerc(saleData.Dealer, saleData.Partner, saleData.Installer, saleData.LoanType, saleData.State, saleData.StartDate.Format("2006-01-02"), saleData.EndDate.Format("2006-01-02"), saleData.WC1.Format("2006-01-02"))
    amtCheck = CalculateAmtCheck(r1DrawPaid, r1DrawAmt)
    r1Balance = calculateR1Balance(dealer, statusCheck, r1CommPaid)
    ovrdBalance = CalculateOvrdBalance(dealer, overdTotal, ovrdPaid)
    status = CalculateStatus(uniqueId, hand, pto, instSys, cancel, ntp, permSub, wc)
    statusDate = CalculateStatusDate(uniqueId, hand, pto, instSys, cancel, ntp, permSub, wc)
    repCount = calculateRepCount(rep_1, netEpc, adderPerKw)
    perRepSales = calculateRepSales(rep_1, netEpc, adderPerKw)
    perRepkW = calculateRepKw(rep_1, netEpc, SysSize, adderPerKw)
    contractCalc = calculateContractCalc(epc, contract, SysSize)
    // epcCalc = calculateEPCCalc(dealer, wc, epc, SysSize) // problem mention in sheet
    teamCount = calculateTeamCount(rep1Team, rep2Team, credit, repPay)
    perTeamSales = calculatePerTeamSales(rep1Team, rep2Team, credit, repPay)
    perTeamKw = calculatePerTeamKw(rep1Team, rep2Team, credit, repPay, SysSize)
 
    r1Name = saleData.PrimarySalesRep
    r1PayRateSemi = calculateRPayRateSemi(rep_1, adderLF, epc, netEpc, commTotal, 0.0)                    //  problem mention in sheet                                                        // function not completed
    r1Rr = calculateRRR(rep_1, DlrDrawPerc, DlrDrawPerc)                                                  //  problem mention in sheet
    r1AdderTotal = calculateRAdderTotal(rep_1, payRate, overdTotal, overdTotal, DlrDrawPerc, DlrDrawPerc) //  problem mention in sheet
    r1AdderPerKw = calculateRAdderPerKw(rep_1, epcCalc, epcCalc)                                          //  problem mention in sheet
    r1PayRateSubTotal = calculateRPayRateSubTotal(rep_1, dealerPaymentBonus, r1DrawAmt)
    r1NetEpc = calculateRNetEpc(epcCalc, overdTotal, overdTotal, overdTotal, rl, SysSize) //  problem mention in sheet
    r1MinmaxCorrect = calculateRminmaxCorrect(rep_1, r1DrawPaid, adderPerKw, payRate)
    r1CommTotal = calculateRCommTotal(rep_1, r1MinmaxCorrect, perRepkW, r1Credit)
    r1CommStatusCheck = calculateRStatusCommCheck(rep_1, status, r1Balance)
 
    r2Name = saleData.SecondarySalesRep
    r2PayRateSemi = calculateR2PayRateSemi(rep_1, repCount, perRepSales, perRepkW, epcCalc, 0.0)         //  problem mention in sheet
    r2Rr = calculateRRR(rep_2, DlrDrawPerc, DlrDrawPerc)                                                 //  problem mention in sheet
    r2AdderTotal = calculateRAdderTotal(rep_2, teamCount, perTeamSales, perTeamKw, perTeamKw, perTeamKw) //  problem mention in sheet
    r2AdderPerKw = calculateRAdderPerKw(rep_2, r1PayScale, epcCalc)                                      //  problem mention in sheet
    r2PayRateSubTotal = calculateRPayRateSubTotal(rep_2, position, position)                             //  problem mention in sheet
    r2NetEpc = calculateRNetEpc(ovrdBalance, r1PayScale, r1PayScale, perTeamKw, rl, SysSize)             //  problem mention in sheet
    r2MinmaxCorrect = calculateRminmaxCorrect(rep_2, rl, contractCalc, contractCalc)                     //  problem mention in sheet
    r2CommTotal = calculateRCommTotal(rep_2, epcCalc, epcCalc, loanFee2)                                 //  problem mention in sheet
    r2CommStatusCheck = calculateRStatusCommCheck(rep_2, status, contractCalc)                           //  problem mention in sheet
 
    /* =========================== short words used ============================
    nocal = here we are not calculating anything, need to sort where value comes
 
    arValue := "1000"
 
    adderData := map[string]int{
        "G3": 10,
        "G4": 20,
        "G5": 30,
    }
 
    payRateSemi = common.CalculatePayRateSemi(epcCalc, arValue)
    addr = common.CalculateADDR(saleData.UniqueId, adderData)
    loanFee = common.CalculateExpense(saleData.UniqueId, adderData)
    rebate = common.CalculateAutoAddr(saleData.UniqueId, LoanFeeAdder)
    referral = common.CalculateLoanFee(saleData.UniqueId, rebateData)
    referral = common.CalculateRebate(saleData.UniqueId, referralData)
    referral = common.CalculateReferral(saleData.UniqueId, adderData)
 
    Saquib
 
    =========================== short words used ============================ */
 
    // this is for 1st sheet
    outData["rl"] = rl
    outData["pay_rate_semi"] = payRateSemi
    outData["addr"] = addr
    outData["expense"] = expense
    outData["auto_adder"] = autoAdder
    outData["loan_fee"] = loanFee
    outData["rebate"] = rebate
    outData["referral"] = referral
    outData["parent_dlr"] = parentDlr
    outData["rep_pay"] = repPay
    outData["adder_total"] = adderTot
    outData["net_epc"] = netEpc
    outData["adder_per_kw"] = adderPerKw
    outData["pay_rate"] = payRate
    outData["comm_total"] = commTotal
    outData["ovrd_total"] = overdTotal
    outData["status_check"] = statusCheck
 
    // this is for 2nd sheet
    outData["dlr_draw_max"] = DlrDrawMax // nocal
    outData["r1_draw_amt"] = r1DrawAmt
    outData["amt_check"] = amtCheck
    outData["r1_balance"] = r1Balance
    outData["ovrd_balance"] = ovrdBalance
    outData["status"] = status
    outData["status_date"] = statusDate
    outData["rep_count"] = repCount
    outData["per_rep_sales"] = perRepSales
    outData["per_rep_kw"] = perRepkW
    outData["contract_calc"] = contractCalc
    outData["epc_calc"] = epcCalc
    outData["rl"] = rl
    outData["pay_rate_semi"] = payRateSemi
    outData["expence"] = expense
    outData["loan_fee"] = loanFee
    outData["team_count"] = teamCount
    outData["per_team_sales"] = perTeamSales
    outData["per_team_kw"] = perTeamKw
 
    // this is for 2nd sheet R1
    outData["r1_name"] = r1Name
    outData["r1_pay_rate_semi"] = r1PayRateSemi
    outData["r1_r_r"] = r1Rr
    outData["r1_adder_total"] = r1AdderTotal
    outData["r1_adder_per_kw"] = r1AdderPerKw
    outData["r1_pay_rate_sub_total"] = r1PayRateSubTotal
    outData["r1_net_epc"] = r1NetEpc
    outData["r1_min_max_correct"] = r1MinmaxCorrect
    outData["r1_comm_total"] = r1CommTotal
    outData["r1_comm_status_check"] = r1CommStatusCheck
 
    // this is for 2nd sheet R2
    outData["r2_name"] = r2Name
    outData["r2_pay_rate_semi"] = r2PayRateSemi
    outData["r2_r_r"] = r2Rr
    outData["r2_adder_total"] = r2AdderTotal
    outData["r2_adder_per_kw"] = r2AdderPerKw
    outData["r2_pay_rate_sub_total"] = r2PayRateSubTotal
    outData["r2_net_epc"] = r2NetEpc
    outData["r2_min_max_correct"] = r2MinmaxCorrect
    outData["r2_comm_total"] = r2CommTotal
    outData["r2_comm_status_check"] = r2CommStatusCheck
 
    return outData, err
}