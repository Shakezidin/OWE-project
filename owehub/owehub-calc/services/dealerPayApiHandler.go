package services

import (
	oweconfig "OWEApp/shared/oweconfig"
	"errors"
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

func GetFinanceFeeByItemID(financeSchedule []oweconfig.FinanceScheduleStruct, itemID int64) (float64, error) {
	for _, entry := range financeSchedule {
		if entry.ItemID == itemID {
			return entry.FinanceFee, nil
		}
	}
	return 0, errors.New("item ID not found")
}

func GetDealerCreditByUniqueID(financeSchedule []oweconfig.DealerCreditsStruct, UniqueId string) (string, error) {
	for _, entry := range financeSchedule {
		if entry.UniqueId == UniqueId {
			return entry.CreditAmount, nil
		}
	}
	return "", errors.New("item ID not found")
}

func GetDealerpaymentsByItemID(financeSchedule []oweconfig.DealerPaymentsStruct, UniqueId string) (string, error) {
	for _, entry := range financeSchedule {
		if entry.UniqueId == UniqueId {
			return entry.TypeOfPayment, nil
		}
	}
	return "", errors.New("item ID not found")
}
