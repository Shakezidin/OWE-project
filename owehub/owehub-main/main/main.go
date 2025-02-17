/**************************************************************************
 *      Function        : main.go
 *      DESCRIPTION     : This file contains main function for
 *						 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package main

import (
	appserver "OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	"OWEApp/shared/types"
	"fmt"
	"os"
	"os/signal"
)

/******************************************************************************
 * FUNCTION:        main
 *
 * DESCRIPTION:     main function to start the service
 * INPUT:
 * RETURNS:
 ******************************************************************************/
func main() {
	log.EnterFn(0, "main")

	// Force local testing port when running locally
	os.Setenv("local", "true")

	//var apiRoutes = appserver.ApiRoutes{
	//	{
	//		strings.ToUpper("POST"),
	//		"/owe-main-service/v1/get_perfomance_leaderboard_data",
	//		apiHandler.HandleGetLeaderBoardRequest,
	//		true,
	//		[]types.UserGroup{types.GroupEveryOne},
	//	},
	//}
	router := appserver.CreateApiRouter(apiRoutes)
	fmt.Println("Starting HTTP server on http://localhost:8080")

	/* Start HTTP Server */
	appserver.StartServiceServer("HTTP", true, router)

	/* Start HTTPS Server */
	if types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.HttpsSupport == "YES" {
		appserver.StartServiceServer("HTTPS", true, router)
	}

	/* Spawn signal handler routine*/
	go signalHandler()
	/*Execute app inifinetly until it gets exit indication*/
	err := <-types.ExitChan

	log.ExitFn(0, "main", nil)
	log.FuncErrorTrace(0, "Exiting Comm-App : reason=%v", err)
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
