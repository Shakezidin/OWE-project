/**************************************************************************
 *	Function	: getReportstargetModels.go
 *	DESCRIPTION : Files contains struct for get reports achived models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type GetReportsTargetModelsReq struct {
	TargetType int64  `json:"target_type"`
	Month      string `json:"month"`
	Year       string `json:"year"`
}

// type MonthlyData struct {
// 	Month          string `json:"name"`                       // Name of the month
// 	Target         int    `json:"Target"`                     // Target value
// 	Completed      *int   `json:"Completed,omitempty"`        // Completed value (optional)
// 	MoreThanTarget *int   `json:"More than Target,omitempty"` // More than Target value (optional)
// 	Inprogress     *int   `json:"Inprogress,omitempty"`       // Inprogress value (optional)
// 	Incomplete     *int   `json:"Incomplete,omitempty"`       // Incomplete value (optional)
// }

type GetReportsTargetModel struct {
	MileStone             string `json:"mile_stone"`
	YearlyAchived         int64  `json:"yearly_achived"`
	YearlyTarget          string `json:"yearly_target"`
	LastMonthTargetStatus string `json:"last_month_target_status"`
	MonthlyAchived        string `json:"monthly_achived"`
	MonthlyTarget         string `json:"monthly_target"`
	MonthlyTargetPerc     string `json:"monthly_target_perc"`
	// MonthlyDatas          []MonthlyData `json:"monthly_datas"`
}

type MilestoneTarget struct {
	Month                string
	TargetProjectsSold   float64
	TargetMwSold         float64
	TargetInstallCount   float64
	TargetMwInstalled    float64
	TargetBatteriesCount float64
}

type MonthlySale struct {
	Month       string
	SaleCount   float64
	KwSaleCount float64
}

type MonthlyAchievement struct {
	Month                  string  `json:"month"`                    // Month (e.g., "Jan", "Feb", "Mar")
	ActualSaleCount        float64 `json:"actual_sale_count"`        // Actual sale count for the month
	ActualKwSaleCount      float64 `json:"actual_kw_sale_count"`     // Actual KW sale count for the month
	TargetProjectsSold     float64 `json:"target_projects_sold"`     // Target projects sold for the month
	TargetMwSold           float64 `json:"target_mw_sold"`           // Target MW sold for the month
	PercentageSaleAchieved float64 `json:"percentage_sale_achieved"` // Percentage of sale target achieved for the month
	PercentageKwAchieved   float64 `json:"percentage_kw_achieved"`   // Percentage of KW target achieved for the month
}

type ReportTargetResponse struct {
	MonthlySales       []MonthlySale        `json:"monthly_sale"`         // List of monthly sales data
	TotalSaleCount     float64              `json:"total_sale_count"`     // Total sale count for the year
	TotalKwSaleCount   float64              `json:"total_kw_sale_count"`  // Total KW sale count for the year
	TargetSaleCount    float64              `json:"target_sale_count"`    // Total target sale count for the year
	TargetKwSaleCount  float64              `json:"target_kw_sale_count"` // Total target KW sale count for the year
	MonthlyAchievement []MonthlyAchievement `json:"monthly_achievement"`  // List of monthly achievement data
}
