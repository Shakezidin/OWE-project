/**************************************************************************
 *	Function	: getDealerPayCommApiModels.go
 *	DESCRIPTION : Files contains struct for summary report models
 *	DATE        : 22-Dec-2024
 **************************************************************************/

package models

 type GuestTokenRequest struct {
	 DashboardId       string   `json:"dashboardId"`
 }
 
 type GuestTokenResponse struct {
	GuestToken    string   `json:"token"`
 }
 