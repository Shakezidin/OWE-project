/**************************************************************************
 *      Function        : CreateOutlookEvent.go
 *      DESCRIPTION     : to create the outlook event
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package graphapi

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"context"

	abstractions "github.com/microsoft/kiota-abstractions-go"
	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
	graphusers "github.com/microsoftgraph/msgraph-sdk-go/users"
)

func CreateOutlookEvent(request models.OutlookEventRequest) (graphmodels.Eventable, error) {

	var err error
	log.EnterFn(0, "CreateOutlookEvent")
	defer func() { log.ExitFn(0, "CreateOutlookEvent", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient

	headers := abstractions.NewRequestHeaders()
	headers.Add("Prefer", "outlook.timezone=\""+request.TimeZone+"\"")
	configuration := &graphusers.ItemEventsRequestBuilderPostRequestConfiguration{
		Headers: headers,
	}

	requestBody := graphmodels.NewEvent()
	requestBody.SetSubject(&request.Subject)

	body := graphmodels.NewItemBody()
	contentType := graphmodels.HTML_BODYTYPE
	body.SetContentType(&contentType)
	body.SetContent(&request.Body)
	requestBody.SetBody(body)

	start := graphmodels.NewDateTimeTimeZone()
	startDateTime := request.StartTime
	start.SetDateTime(&startDateTime)
	start.SetTimeZone(&request.TimeZone)
	requestBody.SetStart(start)

	end := graphmodels.NewDateTimeTimeZone()
	endDateTime := request.EndTime
	end.SetDateTime(&endDateTime)
	end.SetTimeZone(&request.TimeZone)
	requestBody.SetEnd(end)

	if request.Location != "" {
		location := graphmodels.NewLocation()
		location.SetDisplayName(&request.Location)
		requestBody.SetLocation(location)
	}

	if len(request.AttendeeEmails) > 0 {
		attendees := make([]graphmodels.Attendeeable, len(request.AttendeeEmails))
		for i, att := range request.AttendeeEmails {
			attendee := graphmodels.NewAttendee()
			emailAddress := graphmodels.NewEmailAddress()
			emailAddress.SetAddress(&att.Email)
			emailAddress.SetName(&att.Name)
			attendee.SetEmailAddress(emailAddress)

			var attendeeType graphmodels.AttendeeType
			switch att.Type {
			case "optional":
				attendeeType = graphmodels.OPTIONAL_ATTENDEETYPE
			case "resource":
				attendeeType = graphmodels.RESOURCE_ATTENDEETYPE
			default:
				attendeeType = graphmodels.REQUIRED_ATTENDEETYPE
			}

			attendee.SetTypeEscaped(&attendeeType)
			attendees[i] = attendee
		}
		requestBody.SetAttendees(attendees)
	}

	requestBody.SetAllowNewTimeProposals(&request.AllowNewTimeProposals)
	requestBody.SetTransactionId(&request.TransactionID)

	event, err := graphClient.Users().ByUserId(request.OwnerMail).Events().Post(context.Background(), requestBody, configuration)
	if err != nil {
		return nil, err
	}

	return event, nil
}
