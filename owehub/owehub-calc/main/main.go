/**************************************************************************
 *      Function        : main.go
 *      DESCRIPTION     : This file contains main function for
 *						 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package main

import (
	"OWEApp/shared/types"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/signal"
	"time"

	// arCalc "OWEApp/owehub-calc/arcalc"
	datamgmt "OWEApp/owehub-calc/dataMgmt"
	// repPayCalc "OWEApp/owehub-calc/reppaycalc"
	log "OWEApp/shared/logger"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
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
	router := createApiRouter()
	var err error
	arCalcResult := make(chan string)
	dlrPayResult := make(chan string)
	repPayResult := make(chan string)

	/* Start HTTP Server */
	if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
		startServiceServer("HTTP", true, router)
	} else {
		startServiceServer("HTTP", false, router)
	}
	/* Start HTTPS Server */
	if types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.HttpsSupport == "YES" {
		if types.CommGlbCfg.SvcSrvCfg.OpenStdHTTPPort {
			startServiceServer("HTTPS", true, router)
		} else {
			startServiceServer("HTTPS", false, router)
		}
	}

	/* Load Raw data and Configurations */
	err = datamgmt.LoadConfigurations()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get config from DB err: %+v", err)
		panic("Failed to load config from DB")
	}

	err = datamgmt.SaleData.LoadSaleData(nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get sale data from DB err: %+v", err)
		panic("Failed to load sale data from DB")
	}

	/* Perform Initial AR Calcualtion*/
	// go arCalc.ExecArInitialCalculation(arCalcResult)

	/* Perform Initial DLR PAY Calcualtion*/
	// dlrPayCalc.ExecDlrPayInitialCalculation(dlrPayResult)

	/* Perform Initial REP PAY Calcualtion*/
	// go repPayCalc.ExecRepPayInitialCalculation(repPayResult)

	repPayRs := <-repPayResult
	dlrPayRs := <-dlrPayResult
	arRs := <-arCalcResult

	if arRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for AR")
		panic("Failed to perform initial calculations for AR")
	} else {
		log.FuncDebugTrace(0, "AR Initial calculation completed sucessfully.")
	}

	if dlrPayRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for DealerPay")
		panic("Failed to perform initial calculations for DealerPay")
	} else {
		log.FuncDebugTrace(0, "DLR Pay Initial calculation completed sucessfully.")
	}

	if repPayRs != "SUCCESS" {
		log.FuncErrorTrace(0, "Failed to perform initial calculations for RepPay")
		panic("Failed to perform initial calculations for RepPay")
	} else {
		log.FuncDebugTrace(0, "Rep Pay Initial calculation completed sucessfully.")
	}

	/*Closing channels*/
	close(arCalcResult)
	close(repPayResult)
	close(dlrPayResult)

	/* Spawn signal handler routine*/
	go signalHandler()
	/*Execute app inifinetly until it gets exit indication*/
	err = <-types.ExitChan

	/*Close exit channel*/
	close(types.ExitChan)

	log.ExitFn(0, "main", nil)
	log.FuncErrorTrace(0, "Exiting Comm-App : reason=%v", err)
}

/******************************************************************************
 * FUNCTION:        startServiceServer
 *
 * DESCRIPTION:     function to start HTTP server
 * INPUT:	httpSrvType, port type, router
 * RETURNS: http server
 ******************************************************************************/
func startServiceServer(httpSrvType string, isStandardAddr bool, router *mux.Router) (server *http.Server) {
	log.EnterFn(0, "startServiceServer")
	var err error
	defer func() { log.ExitFn(0, "startServiceServer", err) }()

	h2s := &http2.Server{IdleTimeout: time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.IdleTimeout) * time.Second}
	server = &http.Server{
		Handler:           h2c.NewHandler(router, h2s),
		ReadTimeout:       time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadTimeout) * time.Second,
		ReadHeaderTimeout: time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadHeaderTimeout) * time.Second,
		WriteTimeout:      time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.WriteTimeout) * time.Second,
		IdleTimeout:       time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.IdleTimeout) * time.Second,
		MaxHeaderBytes:    types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.MaxHeaderBytes,
	}
	go func() {
		if httpSrvType == "HTTP" {
			if isStandardAddr {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.AddrStd
			} else {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.Addr
			}
			err = server.ListenAndServe()
			log.FuncInfoTrace(0, "Spawning Commissions HTTP service on %s ...", server.Addr)
			types.ExitChan <- err
		} else {
			if isStandardAddr {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddrStd
			} else {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddr
			}
			log.FuncInfoTrace(0, "Spawning Commissions HTTPS service on %s ...", server.Addr)
			_ = configureTLS(server)
			err = server.ListenAndServeTLS(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerCertFile, types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerKeyFile)
			types.ExitChan <- err
		}
		if err != http.ErrServerClosed {
			log.FuncErrorTrace(0, "%v-HTTP Server is down: %v", httpSrvType, err)
		}
	}()
	time.Sleep(1 * time.Second)
	return server
}

/******************************************************************************
 * FUNCTION:        configureTLS
 *
 * DESCRIPTION:     function to configure TLS related parameters
 * INPUT:	httpSrvType
 * RETURNS: error
 ******************************************************************************/
func configureTLS(server *http.Server) (err error) {
	log.EnterFn(0, "configureTLS")
	defer func() { log.ExitFn(0, "configureTLS", err) }()
	tlsCfg := &tls.Config{}
	switch types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientAuthType {
	case "REQUIRE_AND_VERIFY_CLIENT_CERT":
		tlsCfg.ClientAuth = tls.RequireAndVerifyClientCert
	case "REQUEST_CLIENT_CERT":
		tlsCfg.ClientAuth = tls.RequestClientCert
	case "REQUIRE_ANY_CLIENT_CERT":
		tlsCfg.ClientAuth = tls.RequireAnyClientCert
	case "VERIFY_CLIENT_CERT_IF_GIVEN":
		tlsCfg.ClientAuth = tls.VerifyClientCertIfGiven
	case "NO_CLIENT_CERT":
		tlsCfg.ClientAuth = tls.NoClientCert
	default:
		tlsCfg.ClientAuth = tls.NoClientCert
	}
	/* Client-Certificate-Authorities */
	caCertPool := x509.NewCertPool()
	for _, cliCAFile := range types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientCAFile {
		if cliCAFile != "" {
			caCert, err := ioutil.ReadFile(cliCAFile)
			if err != nil {
				log.ConfErrorTrace(0, " Failed to CA FILE: %v", err)
				return err
			}
			caCertPool.AppendCertsFromPEM(caCert)
		}
	}
	tlsCfg.ClientCAs = caCertPool

	/* Client certificate */
	for i, cliCertFile := range types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientCertFile {
		keyFile := types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ClientKeyFile[i]
		if cliCertFile != "" && keyFile != "" {
			cert, err := tls.LoadX509KeyPair(cliCertFile, keyFile)
			if err != nil {
				log.ConfErrorTrace(0, " Failed to CA CERT FILE: %v", err)
				return err
			}
			tlsCfg.Certificates = append(tlsCfg.Certificates, cert)
		}
	}
	tlsCfg.BuildNameToCertificate()
	server.TLSConfig = tlsCfg
	return nil
}

/******************************************************************************
 * FUNCTION:        createApiRouter
 *
 * DESCRIPTION:     function to create mux router
 * INPUT:	httpSrvType
 * RETURNS: error
 ******************************************************************************/
func createApiRouter() *mux.Router {
	log.EnterFn(0, "createApiRouter")
	defer func() { log.ExitFn(0, "createApiRouter", nil) }()

	router := mux.NewRouter().StrictSlash(true)
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE"},
		AllowedHeaders: []string{"User-Agent", "Referer", "Content-Type", "Authorization", "Access-Control-Allow-Credentials", "Access-Control-Allow-Origin"},
	}).Handler

	for _, route := range apiRoutes {
		var handler http.Handler = route.Handler

		if types.CommGlbCfg.SvcSrvCfg.ValidateOAuthReq == "YES" {
			//handler = OAuth2ReqValidatePlugin(handler)
		}

		handler = corsMiddleware(handler)

		router.
			Methods(route.Method).
			Path(route.Pattern).
			Handler(handler)

		router.
			Methods(http.MethodOptions).
			Path(route.Pattern).
			Handler(handler)
	}
	return router
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
