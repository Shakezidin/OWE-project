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

func GetOutlookEvent(request models.EventGetRequest) (graphmodels.Eventable, error) {
	var err error
	log.EnterFn(0, "CreateSubscription")
	defer func() { log.ExitFn(0, "CreateSubscription", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient

	headers := abstractions.NewRequestHeaders()
	headers.Add("Prefer", "outlook.timezone=\"Pacific Standard Time\"")

	requestParameters := &graphusers.ItemEventsEventItemRequestBuilderGetQueryParameters{
		Select: []string{"subject", "body", "bodyPreview", "organizer", "attendees", "start", "end", "location", "hideAttendees"},
	}
	configuration := &graphusers.ItemEventsEventItemRequestBuilderGetRequestConfiguration{
		Headers:         headers,
		QueryParameters: requestParameters,
	}

	events, err := graphClient.Users().ByUserId(request.OwnerMail).Events().ByEventId(request.EventId).Get(context.Background(), configuration)
	if err != nil {
		return nil, err
	}

	return events, nil
}
