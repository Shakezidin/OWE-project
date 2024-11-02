/**************************************************************************
* File			: listSubscriptions.go
* DESCRIPTION	: This file contains functions to list subscriptions
* DATE			: 28-Aug-2024
**************************************************************************/
package graphapi

import (
	"OWEApp/shared/types"
	"context"

	log "OWEApp/shared/logger"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

/******************************************************************************
 * FUNCTION:		    ListSubscriptions
 * DESCRIPTION:      handler for list subscriptions request
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/

func ListSubscriptions() ([]graphmodels.Subscriptionable, error) {
	var (
		err           error
		subscriptions graphmodels.SubscriptionCollectionResponseable
	)

	log.EnterFn(0, "ListSubscriptions")
	defer func() { log.ExitFn(0, "ListSubscriptions", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient

	subscriptions, err = graphClient.Subscriptions().Get(context.Background(), nil)

	if err != nil {
		return nil, err
	}

	return subscriptions.GetValue(), nil
}
