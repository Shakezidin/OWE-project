/**************************************************************************
 * File       	   : supersetReportsApiModels.go
 * DESCRIPTION     : This file contains models for superset_reports CRUD api
 * DATE            : 22-Dec-2024
**************************************************************************/
package models

// Create Api

type CreateSupersetReportRequest struct {
	Category    string `json:"category"`
	Title       string `json:"title"`
	Subtitle    string `json:"subtitle"`
	DashboardId string `json:"dashboard_id"`
}

// ...

// Delete Api

type DeleteSupersetReportRequest struct {
	ReportIds []int64 `json:"report_ids"`
}

// ...

// Get Api

type GetSupersetReportsResponseItem struct {
	Id          int64  `json:"id"`
	Title       string `json:"title"`
	Subtitle    string `json:"subtitle"`
	DashboardId string `json:"dashboard_id"`
}

// Supperset Reports Mapped by category
type GetSupersetReportsResponse map[string][]GetSupersetReportsResponseItem
