package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/json"
	"net/http"
)

// UserRole represents the structure of user roles retrieved from the database
type UserRole struct {
	RoleID   int64  `json:"role_id"`
	RoleName string `json:"role_name"`
}

/******************************************************************************
 * FUNCTION:        HandleGetUserRoles
 * DESCRIPTION:     Handler for retrieving user roles from the database
 * INPUT:           resp, req
 * RETURNS:         void
 ******************************************************************************/
func HandleGetUserRoles(resp http.ResponseWriter, req *http.Request) {
	var (
		err   error
		data  []map[string]interface{}
		roles []UserRole
	)

	log.EnterFn(0, "HandleGetUserRoles")
	defer func() { log.ExitFn(0, "HandleGetUserRoles", err) }()

	query := "SELECT user_roles.role_id, user_roles.role_name FROM user_roles"

	// Execute the query
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, nil)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to fetch user roles from DB err: %v", err)
		http.Error(resp, "Failed to fetch user roles", http.StatusInternalServerError)
		return
	}

	if len(data) == 0 {
		log.FuncErrorTrace(0, "No user roles found")
		http.Error(resp, "No user roles found", http.StatusNotFound)
		return
	}

	// Convert data to UserRole slice
	for _, row := range data {
		role := UserRole{}
		if roleID, ok := row["role_id"].(int64); ok {
			role.RoleID = roleID
		}
		if roleName, ok := row["role_name"].(string); ok {
			role.RoleName = roleName
		}
		roles = append(roles, role)
	}

	// Convert roles to JSON and send response
	respData, err := json.Marshal(roles)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to marshal user roles: %v", err)
		http.Error(resp, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	resp.Header().Set("Content-Type", "application/json")
	resp.WriteHeader(http.StatusOK)
	resp.Write(respData)
}
