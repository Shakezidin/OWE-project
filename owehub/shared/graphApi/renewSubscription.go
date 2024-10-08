/**************************************************************************
 *      Function        : CreateOutlookEvent.go
 *      DESCRIPTION     : to create the outlook event
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package graphapi

import (
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"context"
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

func RenewSubscription(subscriptionID string, newExpirationTime string) (graphmodels.Subscriptionable, error) {
	var err error
	log.EnterFn(0, "RenewSubscription")
	defer func() { log.ExitFn(0, "RenewSubscription", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient
	requestBody := graphmodels.NewSubscription()
	expirationDateTime, _ := time.Parse(time.RFC3339, newExpirationTime)

	requestBody.SetExpirationDateTime(&expirationDateTime)

	subscription, err := graphClient.Subscriptions().BySubscriptionId(subscriptionID).Patch(context.Background(), requestBody, nil)
	if err != nil {
		return nil, err
	}
	return subscription, err
}
