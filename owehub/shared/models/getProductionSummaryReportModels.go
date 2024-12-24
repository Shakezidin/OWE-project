/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 23-Dec-2024
 **************************************************************************/

package models

type ProductionSummaryReportRequest struct {
    Year       string   `json:"year"`
    Week       string   `json:"week"`
    Day        string   `json:"day"`
    ReportType string   `json:"report_type"`
    Office     []string `json:"office"`
    StartDate  string   `json:"start_date"`
    EndDate    string   `json:"end_date"`
}

type WeeklyData struct {
    Week       int                `json:"week"`
    OfficeData map[string]float64 `json:"office_data"`
}

type PendingInstallsBarGraphData struct {
    Office                        string  `json:"office"`
    CompletedPendingCompletionPhotos float64 `json:"completed_pending_completion_photos"`
    PendingMaterial               float64 `json:"pending_material"`
    PendingHOA                    float64 `json:"pending_hoa"`
    PendingCustomerShaky          float64 `json:"pending_customer_shaky"`
    PendingScheduling             float64 `json:"pending_scheduling"`
    PendingDesignChange           float64 `json:"pending_design_change"`
    PendingChangeOrder            float64 `json:"pending_change_order"`
    PendingReschedule             float64 `json:"pending_reschedule"`
    PendingAHJ                    float64 `json:"pending_ahj"`
    PendingCompletion             float64 `json:"pending_completion"`
    CompletedDay2_3               float64 `json:"completed_day_2_3"`
}

type PendingBatteryBarGraphData struct {
    Office                        string  `json:"office"`
    NewProjectPendingPermits      int     `json:"new_project_pending_permits"`
    ReadyToSchedule               int     `json:"ready_to_schedule"`
    Scheduled                     int     `json:"scheduled"`
    PreWorkScheduled              int     `json:"pre_work_scheduled"`
    BatteryInstalledReturnTripRequired int `json:"battery_installed_return_trip_required"`
    PrepWorkNeeded                int     `json:"prep_work_needed"`
}

type PendingServiceBarGraphData struct {
    Office             string `json:"office"`
    Scheduled          int    `json:"scheduled"`
    Rescheduled        int    `json:"rescheduled"`
    PendingAction      int    `json:"pending_action"`
    Opened             int    `json:"opened"`
    ReturnTripRequired int    `json:"return_trip_required"`
    ReadyToSchedule    int    `json:"ready_to_schedule"`
    CompletedDay1_2    int    `json:"completed_day_1_2"`
    OnSite             int    `json:"on_site"`
}

type PendingMPUBarGraphData struct {
    Office             string `json:"office"`
    Scheduled          int    `json:"scheduled"`
    Opened             int    `json:"opened"`
    Rescheduled        int    `json:"rescheduled"`
    PendingAction      int    `json:"pending_action"`
    ReturnTripRequired int    `json:"return_trip_required"`
    ReadyToSchedule    int    `json:"ready_to_schedule"`
    OnSite             int    `json:"on_site"`
}

type PendingDerateBarGraphData struct {
    Office                        string `json:"office"`
    Scheduled                     int    `json:"scheduled"`
    QuoteRequested                int    `json:"quote_requested"`
    PendingPermittingICApproval   int    `json:"pending_permitting_ic_approval"`
    OrderPurchasedPendingDelivery int    `json:"order_purchased_pending_delivery"`
    PendingScheduling             int    `json:"pending_scheduling"`
    OnHoldPendingCustomer         int    `json:"on_hold_pending_customer"`
}

type ProductionSummarySubReport struct {
    SubReportName string                 `json:"sub_report_name"`
    Fields        []string               `json:"fields,omitempty"`
    Data          []map[string]interface{} `json:"data,omitempty"`
    WeeklyData    []WeeklyData           `json:"weekly_data,omitempty"`
    BarGraphData  interface{}            `json:"bar_graph_data,omitempty"`
}

type ProductionSummaryReportResponse struct {
    ReportType string                    `json:"report_type"`
    Year       string                    `json:"year"`
    Week       string                    `json:"week"`
    Day        string                    `json:"day"`
    SubReports []ProductionSummarySubReport `json:"sub_reports"`
}
