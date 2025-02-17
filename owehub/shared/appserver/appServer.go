/**************************************************************************
 * Function        : appServer.go
 * DESCRIPTION     : This file contains function for web server
 * DATE            : 16-Sept-2024
 **************************************************************************/

package appserver

import (
	"OWEApp/shared/types"
	"crypto/tls"
	"crypto/x509"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	log "OWEApp/shared/logger"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
)

/* constains api execution information
*  service names, methods, patterns and
*  handler function*/
type ServiceApiRoute struct {
	Method             string
	Pattern            string
	Handler            http.HandlerFunc
	IsAuthReq          bool
	GroupAllowedAccess []types.UserGroup
}

type ApiRoutes []ServiceApiRoute

/******************************************************************************
 * FUNCTION:        StartServiceServer
 *
 * DESCRIPTION:     function to start HTTP server
 * INPUT:	httpSrvType, port type, router
 * RETURNS: http server
 ******************************************************************************/
func StartServiceServer(httpSrvType string, isStandardAddr bool, router *mux.Router) (server *http.Server) {
	log.EnterFn(0, "StartServiceServer")
	var err error
	defer func() { log.ExitFn(0, "StartServiceServer", err) }()

	h2s := &http2.Server{IdleTimeout: time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.IdleTimeout) * time.Second}
	server = &http.Server{
		Handler:           h2c.NewHandler(router, h2s),
		ReadTimeout:       time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadTimeout) * time.Second,
		ReadHeaderTimeout: time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ReadHeaderTimeout) * time.Second,
		WriteTimeout:      time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.WriteTimeout) * time.Second,
		IdleTimeout:       time.Duration(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.IdleTimeout) * time.Second,
		MaxHeaderBytes:    types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.MaxHeaderBytes,
	}

	// Set local testing port
	if os.Getenv("local") == "true" {
		server.Addr = ":8080"
	} else {
		// Use configured address
		if httpSrvType == "HTTP" {
			if isStandardAddr {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.AddrStd
			} else {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.Addr
			}
		} else {
			if isStandardAddr {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddrStd
			} else {
				server.Addr = types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.SslAddr
			}
		}
	}

	go func() {
		log.FuncInfoTrace(0, "Starting %s service on %s ...", httpSrvType, server.Addr)
		if httpSrvType == "HTTP" {
			err = server.ListenAndServe()
		} else {
			_ = configureTLS(server)
			err = server.ListenAndServeTLS(types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerCertFile, types.CommGlbCfg.SvcSrvCfg.SrvHttpCfg.ServerKeyFile)
			types.ExitChan <- err
		}
		if err != http.ErrServerClosed {
			log.FuncErrorTrace(0, "%v-HTTP Server is down: %v", httpSrvType, err)
			types.ExitChan <- err
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
 * FUNCTION:        CreateApiRouter
 *
 * DESCRIPTION:     function to create mux router
 * INPUT:	httpSrvType
 * RETURNS: error
 ******************************************************************************/
func CreateApiRouter(apiRoutes ApiRoutes) *mux.Router {
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

		/* If API required authorization then add middleware in it */
		if route.IsAuthReq {
			handler = AuthorizeAPIAccess(route.GroupAllowedAccess, handler)
		}

		/* Add Recovery Middle Ware for Panic Handling */
		handler = RecoveryMiddleware(handler)

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
