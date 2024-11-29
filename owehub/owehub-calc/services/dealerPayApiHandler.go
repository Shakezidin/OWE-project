package services

import (
	log "OWEApp/shared/logger"
	oweconfig "OWEApp/shared/oweconfig"
	"regexp"
	"strconv"
	"time"
)

/*
* Calculate Total Gross Commissions For Dealer Pay
* Total Gross Commission	 = Net EPC - RL * (Sys Size*1000)
* CalculateTotalGrossCommission computes the Total Gross Commission.
* Parameters:
* - netEPC: Net EPC value
* - rl: RL value
* - sysSize: System Size
 */
func CalcTotalGrossCommissionDealerPay(netEPC float64, rl float64, sysSize float64) float64 {
	totalGrossCommission := netEPC - rl*(sysSize*1000)
	return totalGrossCommission
}

/*
* Calculate Total Net Commissions For Dealer Pay
* Parameters:
* - totalGrossCommissions: Total Gross Commissions value
* - dlrOverdAmount: DLR OVRD Amount
* - sysSize: System Size
* - mktFee: Marketing Fee
* - payments: Total Payments (single value)
 */
func CalcTotalNetCommissionsDealerPay(totalGrossCommissions float64, dlrOverdAmount float64, sysSize float64, mktFee float64, payments float64) float64 {
	totalNetCommissions := totalGrossCommissions - (dlrOverdAmount * sysSize) - mktFee - payments
	return totalNetCommissions
}

/*
* Calculate Total M1 and M2 Payments For Dealer Pay
* Parameters:
* - totalNetCommissions: Total Net Commissions value
* - drawPercent: Draw percentage (as a decimal)
* - drawMax: Maximum allowable draw
 */
func CalcPaymentsDealerPay(totalNetCommissions float64, drawPercent float64, drawMax float64) (float64, float64) {
	/* Calculate M1 Payment */
	m1Payment := totalNetCommissions * drawPercent

	/* Check against Draw Max */
	if m1Payment > drawMax {
		m1Payment = drawMax
	}

	/* Calculate M2 Payment */
	m2Payment := totalNetCommissions - m1Payment

	return m1Payment, m2Payment
}

func CalcAmountDealerPay(NtpCompleteDate, PvComplettionDate time.Time, m1Payment, m2Payment float64) (amount float64) {
	if !NtpCompleteDate.IsZero() {
		amount = m1Payment
	} else if !PvComplettionDate.IsZero() {
		amount = m2Payment
	}
	return amount
}

func GetCreditByUniqueID(dealerCredit []oweconfig.DealerCreditsStruct, UniqueId string) string {
	for _, entry := range dealerCredit {
		if entry.UniqueId == UniqueId {
			return entry.CreditAmount
		}
	}
	return ""
}

func CalcLoanFeeCommissionDealerPay(financeSchedule []oweconfig.FinanceScheduleStruct, financeType, financeCompany, state string, saleDate time.Time) (loanfee float64) {
	for _, entry := range financeSchedule {
		if entry.FinanceType == financeType && entry.FinanceCompany == financeCompany && entry.State3 == state {
			loanfee += entry.FinanceFee
		}
	}
	return loanfee
}

func CalcAmtPaidByDealer(dealerPayments []oweconfig.DealerPaymentsStruct, dealer string) (amtPaid float64) {
	for _, entry := range dealerPayments {
		if entry.SalesPartner == dealer {
			// Convert PaymentAmount from string to float64
			paymentAmount, err := strconv.ParseFloat(entry.PaymentAmount, 64)
			if err != nil {
				continue // Skip this entry if conversion fails
			}
			amtPaid += paymentAmount
		}
	}
	return amtPaid
}

func CalcAmtPaidByDealerForProjectId(dealerPayments []oweconfig.DealerPaymentsStruct, dealer string, uniqueId string) (amtPaid float64) {
	for _, entry := range dealerPayments {
		if entry.SalesPartner == dealer && entry.UniqueId == uniqueId {
			// Handle currency prefix if present (e.g., "USD ")
			paymentAmountStr := entry.PaymentAmount
			if len(paymentAmountStr) > 4 && paymentAmountStr[:4] == "USD " {
				paymentAmountStr = paymentAmountStr[4:] // Remove "USD " prefix
			}

			// Convert cleaned payment amount string to float64
			paymentAmount, err := strconv.ParseFloat(paymentAmountStr, 64)
			if err != nil {
				log.FuncErrorTrace(0, "error while converting string to float with err %v", err)
				continue // Skip this entry if conversion fails
			}
			amtPaid += paymentAmount
		}
	}
	return amtPaid
}

func CalcDealerOvrdCommissionDealerPay(dealerOvrd []oweconfig.DealerOverrideStruct, dealer string) (dealerovrd float64) {
	for _, entry := range dealerOvrd {
		if entry.Dealer == dealer {
			dealerovrd += entry.PayRate
		}
	}
	return dealerovrd
}

func CalcDrawPercDrawMaxRedLineCommissionDealerPay(partnerPaySchedule []oweconfig.PartnerPayScheduleStruct, dealer, financePartner, state string, contractDate time.Time) (drawPerc, drawMax, redline float64) {
	partnerRegex := regexp.MustCompile(`^(.*?)(?: -|-)`)
	for _, entry := range partnerPaySchedule {
		matches := partnerRegex.FindStringSubmatch(entry.Finance_partner)
		partnerName := entry.Finance_partner
		if len(matches) > 1 {
			partnerName = matches[1] // Capture the portion before " -" or "-"
		}
		if entry.Sales_partner == dealer && entry.State == state && partnerName == financePartner && entry.ActiveDateStart.Before(contractDate) && entry.ActiveDateEnd.After(contractDate) {
			// Convert M1SalesPartnerDrawPercentage from string to float64
			percentage, err := strconv.ParseFloat(entry.M1SalesPartnerDrawPercentage, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting M1SalesPartnerDrawPercentage to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}
			drawPerc = percentage

			// Convert M1SalesPartnerNotToExceed from string to float64
			M1SalesPartnerNotToExceed := entry.M1SalesPartnerNotToExceed
			if len(M1SalesPartnerNotToExceed) > 4 && M1SalesPartnerNotToExceed[:4] == "USD " {
				M1SalesPartnerNotToExceed = M1SalesPartnerNotToExceed[4:] // Remove "USD " prefix
			}

			notToExceed, err := strconv.ParseFloat(M1SalesPartnerNotToExceed, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting M1SalesPartnerNotToExceed to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}
			drawMax = notToExceed

			redLine, err := strconv.ParseFloat(entry.Redline, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting redline to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}
			redline = redLine
		}
	}
	return drawPerc, drawMax, redline
}
