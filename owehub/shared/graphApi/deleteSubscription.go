/**************************************************************************
 * Function : DeleteSubscription.go
 * DESCRIPTION : to delete an outlook subscription
 * DATE : 06-Oct-2024
 **************************************************************************/
package graphapi

import (
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"context"
)

func DeleteSubscription(subscriptionID string) error {
	var err error
	log.EnterFn(0, "DeleteSubscription")
	defer func() { log.ExitFn(0, "DeleteSubscription", err) }()

	graphClient := types.CommGlbCfg.ScheduleGraphApiClient

	err = graphClient.Subscriptions().BySubscriptionId(subscriptionID).Delete(context.Background(), nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to delete subscription: %v", err)
		return err
	}

	return nil
}
