package services

import (
	"OWEApp/shared/appserver"
	"net/http"
)

func GetGoalsFormData(resp http.ResponseWriter, req *http.Request) {
	responseData := make(map[string]interface{})
	responseData["states"] = getGoalStates()
	amdData, err := getGoalAMs()
	if err != nil {
		appserver.FormAndSendHttpResp(resp, "Error retrieving AMs data", http.StatusInternalServerError, nil)
		return
	}
	responseData["am"] = amdData
	appserver.FormAndSendHttpResp(resp, "States And AMs data retrieved", http.StatusOK, responseData)
}
