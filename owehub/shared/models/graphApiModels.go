/**************************************************************************
 *      Function        : graphApiModels.go
 *      DESCRIPTION     : contains structure for Graph API
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package models

import (
	"time"
)

type OutlookEventRequest struct {
	Subject               string
	Body                  string
	StartTime             string
	EndTime               string
	TimeZone              string
	Location              string
	AttendeeEmails        []Attendee
	AllowNewTimeProposals bool
	TransactionID         string
	OwnerMail             string // This is the mail from which the event is created
}

type Attendee struct {
	Email string
	Name  string
	Type  string // Can be "required", "optional", or "resource"
}

type SubscriptionRequest struct {
	ChangeType string /* e.g., "created", "updated", "deleted".
	This can be comma seperated if required to add multiple values */
	NotificationURL           string // URL where notifications will be sent
	Resource                  string // e.g., "me/mailFolders('Inbox')/messages"
	ExpirationDateTime        string
	ClientState               string // A unique client state used to verify notifications
	LatestSupportedTlsVersion string // e.g., "v1_2"
}

type EventGetRequest struct {
	EventId   string
	OwnerMail string // This is the mail from which the event is created
}

type EventCancellationRequest struct {
	Comment   string // give reason why are you cancelling the event
	EventId   string
	OwnerMail string // This is the mail from which the event is created
}

type SubscriptionReq struct {
	SubscriptionId                 string `json:"subscriptionId"`
	SubscriptionExpirationDateTime string `json:"subscriptionExpirationDateTime"`
	ChangeType                     string `json:"changeType"`
	Resource                       string `json:"resource"`
}

type EventDetails struct {
	Date            string
	Day             string
	StartTime       string
	EndTime         string
	StartDate       time.Time
	EndDate         time.Time
	TransactionID   string
	EventId         string
	SurveyorEntraId string
	EventStatus string
}
