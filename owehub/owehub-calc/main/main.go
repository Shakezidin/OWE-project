/**************************************************************************
 *      Function        : main.go
 *      DESCRIPTION     : This file contains main function for
 *						 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package main

import (
	"OWEApp/owehub-calc/services"
	"OWEApp/shared/types"
	"context"
	"fmt"
	"os"
	"os/signal"
	"sync"

	appserver "OWEApp/shared/appserver"
	log "OWEApp/shared/logger"

	"github.com/segmentio/kafka-go"
)

/******************************************************************************
 * FUNCTION:        main
 *
 * DESCRIPTION:     main function to start the service
 * INPUT:
 * RETURNS:
 ******************************************************************************/

var deleteIds []string
var uniqueIDs = make(map[string]string)
var mu sync.Mutex

func main() {
	log.EnterFn(0, "main")
	router := appserver.CreateApiRouter(apiRoutes)
	var err error
	/* Start HTTP Server */
	if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
		appserver.StartServiceServer("HTTP", true, router)
	} else {
		appserver.StartServiceServer("HTTP", false, router)
	}
	/* Start HTTPS Server */
	if types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.HttpsSupport == "YES" {
		if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
			appserver.StartServiceServer("HTTPS", true, router)
		} else {
			appserver.StartServiceServer("HTTPS", false, router)
		}
	}

	err = services.ClearDlrPay()
	if err != nil {
		log.FuncInfoTrace(0, "error while clearing dlr_pay with err : %v", err)
	}

	err = services.ExecDlrPayInitialCalculation("", "")
	if err != nil {
		log.FuncErrorTrace(0, "error while loading performInitialLoadAndCalculations function")
		return
	}

	err = services.ClearAgingRp()
	if err != nil {
		log.FuncInfoTrace(0, "error while calling ClearAgingRp func: %v", err)
		return
	}

	err = services.ExecAgingReportInitialCalculation("", "")
	if err != nil {
		log.FuncErrorTrace(0, "error while loading ExecAgingReportInitialCalculation function")
		return
	}

	/* Spawn signal handler routine*/
	go signalHandler()
	/*Execute app inifinetly until it gets exit indication*/
	err = <-types.ExitChan

	/*Close exit channel*/
	close(types.ExitChan)

	log.ExitFn(0, "main", nil)
	log.FuncErrorTrace(0, "Exiting Calc-App : reason=%v", err)
}

/******************************************************************************
 * FUNCTION:        signalHandler
 *
 * DESCRIPTION:     Signal handler function
 * INPUT:
 * RETURNS:    VOID
 ******************************************************************************/
func signalHandler() {
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt)
	sig := <-sigChan
	types.ExitChan <- fmt.Errorf("%+v signal", sig)
}

/******************************************************************************
 * FUNCTION:        kafkaListener
 *
 * DESCRIPTION:     Kafka consumer that listens to all topics
 * INPUT:
 * RETURNS:        VOID
 ******************************************************************************/
func kafkaListener() {
	log.EnterFn(0, "kafkaListener")
	/*TODO: need to prepare list of topics to be listen*/
	topic := "postgres_db_latest_1.public.demo_table"
	partition := 0

	// Create a new Kafka reader
	r := kafka.NewReader(kafka.ReaderConfig{
		/*TODO: kafka host need to be updated as per new deployment*/
		Brokers:   []string{"kafka:29092"},
		Topic:     topic,
		Partition: partition,
		MinBytes:  10e3, // Minimum 10KB per fetch
		MaxBytes:  10e6, // Maximum 10MB per fetch
	})

	// Create a signal channel to handle graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, os.Interrupt)

	// Listen for messages
	log.FuncDebugTrace(0, "Listening for Kafka messages...")
	for {
		select {
		case <-sigChan:
			log.FuncDebugTrace(0, "Shutting down Kafka consumer...")
			r.Close()
			return
		default:
			// Read a message
			msg, err := r.ReadMessage(context.Background())
			if err != nil {
				log.FuncDebugTrace(0, "Error reading message: %s\n", err)
				continue
			}

			// // Parse project_id and operation_type
			// projectID, operationType, parseErr := parseKafkaMessage(msg.Value)
			// if parseErr != nil {
			// 	log.FuncDebugTrace(0, "Error parsing message: %s\n", parseErr)
			// 	continue
			// }

			// // Store project data with thread-safe access
			// mu.Lock()
			// // Store entire project data for "create" or "update", only operation for "delete"
			// if operationType == "delete" {
			// 	deleteIds = append(deleteIds, projectID)
			// } else {
			// 	uniqueIDs[projectID] = operationType
			// }
			// mu.Unlock()

			// Print the message for debugging
			log.FuncDebugTrace(0, "Received message: Topic: %s, Partition: %d, Offset: %d, Key: %s, Value: %s\n",
				msg.Topic, msg.Partition, msg.Offset, string(msg.Key), string(msg.Value))
		}
	}
	log.ExitFn(0, "kafkaListener", nil)
	log.FuncErrorTrace(0, "Exiting Calc-App kafkaListener: reason")
}

// func parseKafkaMessage(message []byte) (string, string, error) {
// 	var data map[string]interface{}
// 	if err := json.Unmarshal(message, &data); err != nil {
// 		return "", "", fmt.Errorf("failed to parse Kafka message: %w", err)
// 	}

// 	projectID, ok := data["project_id"].(string)
// 	if !ok {
// 		return "", "", fmt.Errorf("project_id missing or invalid in Kafka message")
// 	}

// 	operationType, ok := data["operation_type"].(string)
// 	if !ok {
// 		return "", "", fmt.Errorf("operation_type missing or invalid in Kafka message")
// 	}

// 	return projectID, operationType, nil
// }

// func batchProcessProjects() {
// 	// Create a ticker that ticks every 10 minutes
// 	ticker := time.NewTicker(10 * time.Minute)
// 	defer ticker.Stop() // Ensure ticker is stopped when function exits

// 	for {
// 		select {
// 		case <-ticker.C:
// 			// Lock the mutex for thread-safe access
// 			mu.Lock()
// 			if len(deleteIds) > 0 {
// 				services.DeleteFromDealerPay(deleteIds) // Call delete function
// 				deleteIds = []string{}                  // Clear after processing
// 			}
// 			if len(deleteIds) > 0 {
// 				services.ExecDlrPayInitialCalculation(uniqueIDs) // Process and send project data
// 				uniqueIDs = map[string]string{}
// 			} // Clear projectOps after processing
// 			mu.Unlock()
// 		}
// 	}
// }
