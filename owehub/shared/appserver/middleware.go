/**************************************************************************
 * File       	   : authorizeMiddleware.go
 * DESCRIPTION     : This file contains middleware for api authorization
 * DATE            : 19-Jan-2024
 **************************************************************************/

package appserver

import (
	log "OWEApp/shared/logger"
	types "OWEApp/shared/types"
	"context"
	"fmt"
	"net/http"
	"runtime"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func RecoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.EnterFn(0, "RecoveryMiddleware")
		defer func() {
			log.ExitFn(0, "RecoveryMiddleware", nil)
			if rec := recover(); rec != nil {
				// Log the panic and stack trace
				buf := make([]byte, 1<<16)
				runtime.Stack(buf, true)
				log.FuncErrorTrace(0, "Recovered from panic: %v\nStack Trace: %s", rec, buf)

				// Send a generic internal server error response
				FormAndSendHttpResp(w, "Internal Server Error", http.StatusInternalServerError, nil)
			}
		}()
		// Call the next handler
		next.ServeHTTP(w, r)
	})
}

func AuthorizeAPIAccess(groupsAccessAllowed []types.UserGroup, next http.Handler) http.Handler {
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

		token, err := jwt.ParseWithClaims(tokenString, &types.Claims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte(types.JwtKey), nil
		})

		if err != nil || !token.Valid {
			FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
			err = fmt.Errorf("Unauthorized API Access")
			return
		}

		/* Now Validate if user role has permission to access the resource */
		claims, ok := token.Claims.(*types.Claims)
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

		// Check if user's role is included in any allowed group
		userRole := types.UserRoles(claims.RoleName)

		for _, groupAllowed := range groupsAccessAllowed {
			if isUserInAllowedGroup(userRole, groupAllowed) {
				/* Resource Access is allowed for this Group */
				log.FuncInfoTrace(0, "Access is allowed for group: %v", groupAllowed)

				ctx := context.WithValue(r.Context(), "emailid", claims.EmailId)
				ctx = context.WithValue(ctx, "rolename", claims.RoleName)
				next.ServeHTTP(w, r.WithContext(ctx))
				return
			}
		}

		FormAndSendHttpResp(w, "Unauthorized API Access", http.StatusUnauthorized, nil)
		err = fmt.Errorf("User for %v Role does not belong to any allowed group", claims.RoleName)
		return
	})
}

// Function to check if user's role is allowed for the given group
func isUserInAllowedGroup(role types.UserRoles, group types.UserGroup) bool {
	allowedRoles, ok := types.UserRoleGroupMap[group]
	if !ok {
		// Group not found in the mapping
		return false
	}
	for _, allowedRole := range allowedRoles {
		if role == allowedRole {
			return true
		}
	}
	return false
}
