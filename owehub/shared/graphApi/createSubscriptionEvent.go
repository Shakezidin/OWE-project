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
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

func CreateSubscription(request models.SubscriptionRequest) (graphmodels.Subscriptionable, error) {
	var err error
	log.EnterFn(0, "CreateSubscription")
	defer func() { log.ExitFn(0, "CreateSubscription", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient

	requestBody := graphmodels.NewSubscription()
	requestBody.SetChangeType(&request.ChangeType)
	requestBody.SetNotificationUrl(&request.NotificationURL)
	requestBody.SetResource(&request.Resource)

	expirationDateTime, _ := time.Parse(time.RFC3339, request.ExpirationDateTime)
	requestBody.SetExpirationDateTime(&expirationDateTime)

	// requestBody.SetClientState(&request.ClientState)
	// requestBody.SetLatestSupportedTlsVersion(&request.LatestSupportedTlsVersion)

	subscription, err := graphClient.Subscriptions().Post(context.Background(), requestBody, nil)
	if err != nil {
		return nil, err
	}

	return subscription, nil
}
