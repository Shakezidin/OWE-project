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
	"fmt"
	"os"
	"os/signal"

	appserver "OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
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

	err = services.ExecDlrPayInitialCalculation()
	if err != nil {
		log.FuncErrorTrace(0, "error while loading performInitialLoadAndCalculations function")
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
