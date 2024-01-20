/**************************************************************************
 * File       	   : authorizeMiddleware.go
 * DESCRIPTION     : This file contains middleware for api authorization
 * DATE            : 19-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/logger"
	"OWEApp/types"
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func AuthorizeAPIAccess(rolesAccessAllowed []types.UserRoles, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var (
			err error
		)

		log.EnterFn(0, "AuthorizeAPIAccess")
		defer func() { log.ExitFn(0, "AuthorizeAPIAccess", err) }()

		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
			err = fmt.Errorf("Authorization Field is missing in the request")
			return
		}

		token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(types.JwtKey), nil
		})

		if err != nil || !token.Valid {
			FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
			err = fmt.Errorf("Unauthorized API Access")
			return
		}

		/* Now Validate if user role has permission to access the respource */
		claims, ok := token.Claims.(*Claims)
		if !ok || time.Now().Unix() > claims.ExpiresAt {
			FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
			err = fmt.Errorf("Failed to get the claims, unauthorized access")
			return
		}

		if len(claims.RoleName) < 0 {
			FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
			err = fmt.Errorf("Empty RoleName is not allowed")
			return
		}

		for _, roleAllowed := range rolesAccessAllowed {
			if roleAllowed == types.UserRoles(claims.RoleName) {
				/* Resource Access is allowed for this Role */
				log.FuncInfoTrace(0, "Access is allowed for role: %v", claims.RoleName)

				ctx := context.WithValue(r.Context(), "emailid", claims.EmailId)
				ctx = context.WithValue(ctx, "rolename", claims.RoleName)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
		}

		FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
		err = fmt.Errorf("User for %v Role is not allowed to access resource", claims.RoleName)
		return
	})
}
