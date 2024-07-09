/**************************************************************************
 * File            : types.go
 * DESCRIPTION     : This file contains common types required for AR, DLR PAY & REP PAY
 * DATE            : 28-April-2024
 **************************************************************************/

package Common

import "time"

type Project_Status string

/*Common Project Status*/
const (
	PTO     Project_Status = "PTO"
	Install Project_Status = "Install"
	Cancel  Project_Status = "CANCEL"
	Shaky   Project_Status = "Shaky"
	Permits Project_Status = "Permits"
	NTP     Project_Status = "NTP"
	Sold    Project_Status = "Sold"
	Null    Project_Status = "Null"
)

var (
	ARWc1FilterDate     time.Time = time.Date(2021, time.April, 1, 0, 0, 0, 0, time.UTC)
	DlrPayWc1FilterDate time.Time = time.Date(2021, time.July, 1, 0, 0, 0, 0, time.UTC)
)
