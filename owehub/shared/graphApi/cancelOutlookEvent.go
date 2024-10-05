/**************************************************************************
 *      Function        : CancelOutlookEvent.go
 *      DESCRIPTION     : to cancel the outlook event
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package graphapi

import (
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"OWEApp/shared/types"
	"context"

	abstractions "github.com/microsoft/kiota-abstractions-go"
	graphusers "github.com/microsoftgraph/msgraph-sdk-go/users"
)

func CancelOutlookEvent(request models.EventCancellationRequest) error {
	var err error
	log.EnterFn(0, "CancelOutlookEvent")
	defer func() { log.ExitFn(0, "CancelOutlookEvent", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient
	headers := abstractions.NewRequestHeaders()
	headers.Add("Prefer", "outlook.timezone=\"Pacific Standard Time\"")

	requestBody := graphusers.NewItemCalendarEventsItemCancelPostRequestBody()
	comment := request.Comment
	requestBody.SetComment(&comment)

	configuration := &graphusers.ItemEventsItemCancelRequestBuilderPostRequestConfiguration{
		Headers: headers,
	}
	err = graphClient.Users().ByUserId(request.OwnerMail).Events().ByEventId(request.EventId).Cancel().Post(context.Background(), requestBody, configuration)
	if err != nil {
		return err
	}

	return nil
}
