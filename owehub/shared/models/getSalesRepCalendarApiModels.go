/**************************************************************************
 *	Function	: getSalesRepCalendarApiModels.go
 *	DESCRIPTION : Files contains struct for get performance tile data models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

import "time"

 type TimeSlot struct {
	Start time.Time
	End   time.Time
}

type CalendarDay struct {
	Date               string   `json:"date"`
	ColorCode          string   `json:"colorcode"`
	AvailableTimeSlots []string `json:"available_time_range"`
}

type CalendarResponse struct {
	CustomerEmail string        `json:"customer_email"`
	Status        int           `json:"status"`
	Message       string        `json:"message"`
	Details       []CalendarDay `json:"details"`
}