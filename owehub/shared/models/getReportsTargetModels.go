/**************************************************************************
 *	Function	: getReportstargetModels.go
 *	DESCRIPTION : Files contains struct for get reports achived models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

// Get Reports Achieved (homepage) models

type GetReportsTargetReq struct {
	TargetType       string `json:"target_type"`
	TargetPercentage int    `json:"target_percentage"`
	Month            string `json:"month"`
	Year             string `json:"year"`
}

type ProductionTargetOrAchievedItem struct {
	ProjectsSold float64 `json:"projects_sold"`
	MwSold       float64 `json:"mw_sold"`
	InstallCt    float64 `json:"install_ct"`
	MwInstalled  float64 `json:"mw_installed"`
	BatteriesCt  float64 `json:"batteries_ct"`
}

type ProductionTargetOrAchievedPercentage struct {
	ProjectsSold float64 `json:"projects_sold"`
	MwSold       float64 `json:"mw_sold"`
	InstallCt    float64 `json:"install_ct"`
	MwInstalled  float64 `json:"mw_installed"`
	BatteriesCt  float64 `json:"batteries_ct"`
}

type GetReportsTargetRespSummaryItem struct {
	Target            interface{} `json:"target"`
	Achieved          interface{} `json:"achieved"`
	LastMonthAcheived float64     `json:"last_month_acheived"`
}

type GetReportsTargetRespProgressItem struct {
	Target             interface{} `json:"target"`
	Achieved           interface{} `json:"achieved"`
	PercentageAchieved float64     `json:"percentage_achieved"`
}

type GetReportsTargetRespOverviewItem struct {
	Month    string      `json:"month"`
	Target   interface{} `json:"target"`
	Achieved interface{} `json:"achieved"`
}

type GetReportsTargetRespStatsItem struct {
	Month          string      `json:"month"`
	Completed      interface{} `json:"completed,omitempty"`
	Incomplete     interface{} `json:"incomplete,omitempty"`
	Inprogress     interface{} `json:"in_progress,omitempty"`
	MoreThanTarget interface{} `json:"more_than_target,omitempty"`
	Target         interface{} `json:"target,omitempty"`
}

type GetReportsTargetResp struct {
	Summary         map[string]GetReportsTargetRespSummaryItem  `json:"summary"`
	Progress        map[string]GetReportsTargetRespProgressItem `json:"progress"`
	MonthlyOverview []GetReportsTargetRespOverviewItem          `json:"monthly_overview"`
	MonthlyStats    []GetReportsTargetRespStatsItem             `json:"monthly_stats"`
}

// Get production targets by year models

type ProductionTargetsByYearReq struct {
	Year             int `json:"year"`
	TargetPercentage int `json:"target_percentage"`
}

type ProductionTargetsByYearRespItem struct {
	Month        string  `json:"month"`
	ProjectsSold float64 `json:"projects_sold"`
	MwSold       float64 `json:"mw_sold"`
	InstallCt    float64 `json:"install_ct"`
	MwInstalled  float64 `json:"mw_installed"`
	BatteriesCt  float64 `json:"batteries_ct"`
}

// Update production targets models

type UpdateProductionTargetsReqItem struct {
	Year             int     `json:"year"`
	Month            int     `json:"month"`
	TargetPercentage int     `json:"target_percentage"`
	ProjectsSold     float64 `json:"projects_sold"`
	MwSold           float64 `json:"mw_sold"`
	InstallCt        float64 `json:"install_ct"`
	MwInstalled      float64 `json:"mw_installed"`
	BatteriesCt      float64 `json:"batteries_ct"`
}

type UpdateProductionTargetsReq struct {
	Targets []UpdateProductionTargetsReqItem `json:"targets"`
}

// type MonthlyData struct {
// 	Month          string `json:"name"`                       // Name of the month
// 	Target         int    `json:"Target"`                     // Target value
// 	Completed      *int   `json:"Completed,omitempty"`        // Completed value (optional)
// 	MoreThanTarget *int   `json:"More than Target,omitempty"` // More than Target value (optional)
// 	Inprogress     *int   `json:"Inprogress,omitempty"`       // Inprogress value (optional)
// 	Incomplete     *int   `json:"Incomplete,omitempty"`       // Incomplete value (optional)
// }

// type GetReportsTargetModel struct {
// 	MileStone             string `json:"mile_stone"`
// 	YearlyAchived         int64  `json:"yearly_achived"`
// 	YearlyTarget          string `json:"yearly_target"`
// 	LastMonthTargetStatus string `json:"last_month_target_status"`
// 	MonthlyAchived        string `json:"monthly_achived"`
// 	MonthlyTarget         string `json:"monthly_target"`
// 	MonthlyTargetPerc     string `json:"monthly_target_perc"`
// 	// MonthlyDatas          []MonthlyData `json:"monthly_datas"`
// }

// type MilestoneTarget struct {
// 	Month                string
// 	TargetProjectsSold   float64
// 	TargetMwSold         float64
// 	TargetInstallCount   float64
// 	TargetMwInstalled    float64
// 	TargetBatteriesCount float64
// }

// type MonthlySale struct {
// 	Month       string
// 	SaleCount   float64
// 	KwSaleCount float64
// }

// type MonthlyAchievement struct {
// 	Month                  string  `json:"month"`                    // Month (e.g., "Jan", "Feb", "Mar")
// 	ActualSaleCount        float64 `json:"actual_sale_count"`        // Actual sale count for the month
// 	ActualKwSaleCount      float64 `json:"actual_kw_sale_count"`     // Actual KW sale count for the month
// 	TargetProjectsSold     float64 `json:"target_projects_sold"`     // Target projects sold for the month
// 	TargetMwSold           float64 `json:"target_mw_sold"`           // Target MW sold for the month
// 	PercentageSaleAchieved float64 `json:"percentage_sale_achieved"` // Percentage of sale target achieved for the month
// 	PercentageKwAchieved   float64 `json:"percentage_kw_achieved"`   // Percentage of KW target achieved for the month
// }

// type ReportTargetResponse struct {
// 	MonthlySales       []MonthlySale        `json:"monthly_sale"`         // List of monthly sales data
// 	TotalSaleCount     float64              `json:"total_sale_count"`     // Total sale count for the year
// 	TotalKwSaleCount   float64              `json:"total_kw_sale_count"`  // Total KW sale count for the year
// 	TargetSaleCount    float64              `json:"target_sale_count"`    // Total target sale count for the year
// 	TargetKwSaleCount  float64              `json:"target_kw_sale_count"` // Total target KW sale count for the year
// 	MonthlyAchievement []MonthlyAchievement `json:"monthly_achievement"`  // List of monthly achievement data
// }
