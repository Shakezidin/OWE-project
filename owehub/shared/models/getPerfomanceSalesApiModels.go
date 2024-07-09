/**************************************************************************
 *	Function	: getMarketingFeesApiModels.go
 *	DESCRIPTION : Files contains struct for get Marketing Fees user models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetPerfomanceReq struct {
	Email        string   `json:"email"`
	DealerName   interface{}
}

type PerfomanceSales struct {
	Type    string  `json:type`
	Sales   int64   `json:"sales"`
	SalesKw float64 `json:"sales_kw"`
}

type PerfomanceCommission struct {
	SalesPeriod        float64 `json:sales_period`
	CancellationPeriod float64   `json:"cancellation_period"`
	InstallationPeriod float64 `json:"installation_period"`
}

type PerfomanceMetricsResp struct {
	PerfomanceSalesMetrics      []PerfomanceSales    `json:"perfomance_sales_metrics"`
	PerfomanceCommissionMetrics PerfomanceCommission `json:"perfomance_commission_metrics"`
}
