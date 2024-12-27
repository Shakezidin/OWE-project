/**************************************************************************
* File			: outlook.go
* DESCRIPTION	: This file contains outlook related helpers for leads service
* DATE			: 28-Aug-2024
**************************************************************************/
package common

import (
	graphapi "OWEApp/shared/graphApi"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	timerHandler "OWEApp/shared/timer"
	"fmt"
	"strings"
	"time"

	graphmodels "github.com/microsoftgraph/msgraph-sdk-go/models"
)

type OutlookWebhookInfo struct {
	SubscriptionId string
	Expiry         time.Time
}

// isSubscriptionEndpoint returns true if the given url is one of the configured outlook webhook endpoints
func isSubscriptionEndpoint(url *string) bool {
	for _, endPt := range LeadAppCfg.OutlookSubscriptionEndpoints {
		if *url == endPt {
			return true
		}
	}
	return false
}

/**************************************************************************
 * FUNCTION:        SetupOutlookWebhooks
 *
 * DESCRIPTION:     This function sets up the outlook webhooks for the leads
 *                  service
 *
 * INPUT:           VOID
 *
 * RETURNS:         error
 **************************************************************************/
func SetupOutlookWebhooks() error {
	const subscriptionDuration = time.Hour * 24 * 5
	var (
		err           error
		subscriptions []graphmodels.Subscriptionable
	)

	log.EnterFn(0, "SetupOutlookWebhooks")
	defer func() { log.ExitFn(0, "SetupOutlookWebhooks", err) }()

	subscriptions, err = graphapi.ListSubscriptions()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to list subscriptions err: %v", err)
		return err
	}

	relevantSubscriptions := make(map[string]OutlookWebhookInfo)

	// iterate over subscriptions, extract info into above map
	for _, subscription := range subscriptions {
		url := subscription.GetNotificationUrl()
		if url == nil {
			log.FuncErrorTrace(0, "Subscription url is nil for subscription %v", subscription.GetId())
			continue
		}

		// if subscription is not for the appointment sender, skip it
		if !strings.Contains(*subscription.GetResource(), LeadAppCfg.AppointmentSenderEmail) {
			continue
		}

		// if subscription is not for the configured outlook webhook endpoints, skip it
		if !isSubscriptionEndpoint(url) {
			continue
		}

		_, ok := relevantSubscriptions[*url]

		// duplicate subscriptions, delete this one
		if ok {
			err = graphapi.DeleteSubscription(*subscription.GetId())
			if err != nil {
				log.FuncErrorTrace(0, "failed to delete subscription with url %s, err: %v", *url, err)
			}
			continue
		}

		relevantSubscriptions[*url] = OutlookWebhookInfo{
			SubscriptionId: *subscription.GetId(),
			Expiry:         *subscription.GetExpirationDateTime(),
		}

		log.FuncDebugTrace(0, "Subscription found with url %s, expiry %v", *url, relevantSubscriptions[*url].Expiry)
	}

	// add timers to renew subscriptions
	for _, endPt := range LeadAppCfg.OutlookSubscriptionEndpoints {

		webhook, ok := relevantSubscriptions[endPt]

		// no subscription with this url, create one
		if !ok {
			log.FuncDebugTrace(0, "No subscription with url %v, creating one", endPt)

			webhook.Expiry = time.Now().Add(time.Hour * 24 * 5)

			sub, err := graphapi.CreateSubscription(models.SubscriptionRequest{
				ChangeType:         "updated,created,deleted",
				Resource:           fmt.Sprintf("/users/%s/events", LeadAppCfg.AppointmentSenderEmail),
				NotificationURL:    endPt,
				ExpirationDateTime: webhook.Expiry.Format(time.RFC3339),
			})
			if err != nil {
				log.FuncErrorTrace(0, "failed to create subscription with url %s, err: %v", endPt, err)
			}

			webhook.SubscriptionId = *sub.GetId()
		}

		// if expires within an hour, renew it
		if webhook.Expiry.Before(time.Now().Add(-time.Hour)) {
			webhook.Expiry = time.Now().Add(subscriptionDuration)
			_, err = graphapi.RenewSubscription(webhook.SubscriptionId, webhook.Expiry.Format(time.RFC3339))
			if err != nil {
				log.FuncErrorTrace(0, "failed to renew subscription with url %s, err: %v", endPt, err)
				continue
			}
			log.FuncDebugTrace(0, "Subscription with url %v expired, renewed to %v", endPt, webhook.Expiry)
			continue
		}

		secondsToExpire := int32(webhook.Expiry.Sub(time.Now().Add(time.Minute * 45)).Seconds())
		log.FuncDebugTrace(0, "Timer to expire %s in %v seconds", endPt, secondsToExpire)
		timerHandler.StartTimer(timerHandler.TimerData{
			Recurring:    false,
			TimeToExpire: secondsToExpire,
			FuncHandler: func(timerType int32, data interface{}) {
				// renew subscription
				_, err := graphapi.RenewSubscription(webhook.SubscriptionId, time.Now().Add(subscriptionDuration).Format(time.RFC3339))
				if err != nil {
					log.FuncErrorTrace(0, "failed to renew subscription with url %s, err: %v", endPt, err)
				}

				secondsToExpire := 5*24*60*60 - 60*60 // 5 days - 1 hour
				timerHandler.StartTimer(timerHandler.TimerData{
					Recurring:    true,
					TimeToExpire: int32(secondsToExpire),
					FuncHandler: func(timerType int32, data interface{}) {
						_, err := graphapi.RenewSubscription(webhook.SubscriptionId, time.Now().Add(subscriptionDuration).Format(time.RFC3339))
						if err != nil {
							log.FuncErrorTrace(0, "failed to renew subscription with url %s, err: %v", endPt, err)
						}
					},
				})
			},
		})
	}

	return nil
}
