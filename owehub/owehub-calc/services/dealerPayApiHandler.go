package services

import (
	log "OWEApp/shared/logger"
	oweconfig "OWEApp/shared/oweconfig"
	"regexp"
	"strconv"
	"strings"
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
	totalGrossCommission := (netEPC - rl) * (sysSize * 1000)
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
func CalcTotalNetCommissionsDealerPay(totalGrossCommissions float64, dlrOverdAmount float64, sysSize float64, amt_paid float64) float64 {
	totalNetCommissions := totalGrossCommissions - (dlrOverdAmount * sysSize) - amt_paid
	return totalNetCommissions
}

/*
* Calculate Total M1 and M2 Payments For Dealer Pay
* Parameters:
* - totalNetCommissions: Total Net Commissions value
* - drawPercent: Draw percentage (as a decimal)
* - drawMax: Maximum allowable draw
 */
func CalcPaymentsDealerPay(totalNetCommissions float64, drawPercent float64, drawMax float64, amtpaid float64) (float64, float64) {
	/* Calculate M1 Payment */
	m1Payment := totalNetCommissions * drawPercent

	/* Check against Draw Max */
	if m1Payment > drawMax {
		m1Payment = drawMax
	}

	/* Calculate M2 Payment */
	m2Payment := totalNetCommissions - amtpaid

	return m1Payment, m2Payment
}

func CalcAmountDealerPay(dealerPayments []oweconfig.DealerPaymentsStruct, uniqueId string) (amount float64) {
	for _, entry := range dealerPayments {
		if entry.UniqueId == uniqueId {
			// Handle currency prefix and potential negative sign
			paymentAmountStr := entry.PaymentAmount
			isNegative := false

			// Check for negative sign before "USD"
			if len(paymentAmountStr) > 4 && paymentAmountStr[0] == '-' && paymentAmountStr[1:4] == "USD" {
				isNegative = true
				paymentAmountStr = paymentAmountStr[4:] // Remove "-USD" prefix
			} else if len(paymentAmountStr) > 3 && paymentAmountStr[:3] == "USD" {
				paymentAmountStr = paymentAmountStr[3:] // Remove "USD" prefix
			}

			// Remove commas from the string
			paymentAmountStr = strings.ReplaceAll(paymentAmountStr, ",", "")

			// Convert cleaned payment amount string to float64
			paymentAmount, err := strconv.ParseFloat(paymentAmountStr, 64)
			if err != nil {
				log.FuncErrorTrace(0, "error while converting string to float with err %v", err)
				continue // Skip this entry if conversion fails
			}

			// Apply negative sign if necessary
			if isNegative {
				paymentAmount = -paymentAmount
			}

			// Add to total amount
			amount += paymentAmount
		}
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

func CalcLoanFeeCommissionDealerPay(financeSchedule []oweconfig.FinanceScheduleStruct, financeType, financeCompany, state string) (loanfee float64) {
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

func CalcAmtPaidByDealerForProjectId(dealerPayments []oweconfig.DealerPaymentsStruct, uniqueId string, dealer string) (amtPaid float64) {
	for _, entry := range dealerPayments {
		if entry.UniqueId == uniqueId && entry.SalesPartner == dealer {
			// Handle currency prefix and potential negative sign
			paymentAmountStr := entry.PaymentAmount

			// Check for negative sign before "USD"
			isNegative := false
			if len(paymentAmountStr) > 4 && paymentAmountStr[0] == '-' && paymentAmountStr[1:4] == "USD" {
				isNegative = true
				paymentAmountStr = paymentAmountStr[4:] // Remove "-USD" prefix
			} else if len(paymentAmountStr) > 3 && paymentAmountStr[:3] == "USD" {
				paymentAmountStr = paymentAmountStr[3:] // Remove "USD" prefix
			}

			// Remove commas from the string
			paymentAmountStr = strings.ReplaceAll(paymentAmountStr, ",", "")

			// Convert cleaned payment amount string to float64
			paymentAmount, err := strconv.ParseFloat(paymentAmountStr, 64)
			if err != nil {
				log.FuncErrorTrace(0, "error while converting string to float with err %v", err)
				continue // Skip this entry if conversion fails
			}

			// Apply negative sign if necessary
			if isNegative {
				paymentAmount = -paymentAmount
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

func CalcDrawMaxRedLineCommissionDealerPay(partnerPaySchedule []oweconfig.PartnerPayScheduleStruct, dealer, financePartner, state string, contractDate time.Time) (drawMax, redline float64) {
	partnerRegex := regexp.MustCompile(`^(.*?)(?: -|-)`)
	for _, entry := range partnerPaySchedule {
		matches := partnerRegex.FindStringSubmatch(entry.Finance_partner)
		partnerName := entry.Finance_partner
		if len(matches) > 1 {
			partnerName = matches[1] // Capture the portion before " -" or "-"
		}

		if entry.Sales_partner == dealer && entry.State == state && partnerName == financePartner &&
			entry.ActiveDateStart.Before(contractDate) && entry.ActiveDateEnd.After(contractDate) {

			// Handle M1SalesPartnerNotToExceed
			M1SalesPartnerNotToExceed := entry.M1SalesPartnerNotToExceed
			isNegative := false
			if len(M1SalesPartnerNotToExceed) > 4 && M1SalesPartnerNotToExceed[0] == '-' && M1SalesPartnerNotToExceed[1:4] == "USD" {
				isNegative = true
				M1SalesPartnerNotToExceed = M1SalesPartnerNotToExceed[4:] // Remove "-USD" prefix
			} else if len(M1SalesPartnerNotToExceed) > 3 && M1SalesPartnerNotToExceed[:3] == "USD" {
				M1SalesPartnerNotToExceed = M1SalesPartnerNotToExceed[3:] // Remove "USD" prefix
			}

			// Remove commas from the string
			M1SalesPartnerNotToExceed = strings.ReplaceAll(M1SalesPartnerNotToExceed, ",", "")

			// Convert cleaned string to float64
			notToExceed, err := strconv.ParseFloat(M1SalesPartnerNotToExceed, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting M1SalesPartnerNotToExceed to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}

			// Apply negative sign if necessary
			if isNegative {
				notToExceed = -notToExceed
			}
			drawMax = notToExceed

			// Handle Redline
			redlineStr := entry.Redline
			isRedlineNegative := false
			if len(redlineStr) > 0 && redlineStr[0] == '-' {
				isRedlineNegative = true
				redlineStr = redlineStr[1:] // Remove negative sign
			}

			// Remove commas from the string
			redlineStr = strings.ReplaceAll(redlineStr, ",", "")

			redLine, err := strconv.ParseFloat(redlineStr, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting redline to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}

			// Apply negative sign if necessary
			if isRedlineNegative {
				redLine = -redLine
			}
			redline = redLine
		}
	}
	return drawMax, redline
}

func CalcDrawPercCommissionDealerPay(partnerPaySchedule []oweconfig.PartnerPayScheduleStruct, dealer string, contractDate time.Time) (drawPerc float64) {
	for _, entry := range partnerPaySchedule {
		if entry.Sales_partner == dealer && entry.ActiveDateStart.Before(contractDate) && entry.ActiveDateEnd.After(contractDate) {
			// Convert M1SalesPartnerDrawPercentage from string to float64
			percentage, err := strconv.ParseFloat(entry.M1SalesPartnerDrawPercentage, 64)
			if err != nil {
				log.FuncErrorTrace(0, "Error converting M1SalesPartnerDrawPercentage to float: %v", err)
				continue // Skip this entry if there's a conversion error
			}
			drawPerc = percentage
		}
	}
	return drawPerc
}
