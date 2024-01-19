package services

import (
	log "OWEApp/logger"
	types "OWEApp/types"
	"encoding/json"

	"math/rand"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func Contains(slice []string, item string) bool {
	set := make(map[string]struct{}, len(slice))
	for _, s := range slice {
		set[s] = struct{}{}
	}
	_, ok := set[item]
	return ok
}

func GenerateRandomNumInRange(low, hi int) int {
	rand.Seed(time.Now().UnixNano())
	return low + rand.Intn(hi-low)
}

func GenerateHashPassword(value string) (hashedValue []byte, err error) {
	log.EnterFn(0, "GenerateHashPassword")
	defer func() { log.ExitFn(0, "GenerateHashPassword", err) }()

	hashedValue, err = bcrypt.GenerateFromPassword([]byte(value), bcrypt.DefaultCost)
	return hashedValue, err
}

func CompareHashPassword(hashPassword string, password string) (err error) {
	log.EnterFn(0, "CompareHashPassword")
	defer func() { log.ExitFn(0, "CompareHashPassword", err) }()

	err = bcrypt.CompareHashAndPassword([]byte(hashPassword), []byte(password))
	return err
}

func FormAndSendHttpResp(httpResp http.ResponseWriter, message string, httpStatusCode int, data types.Data) {
	log.EnterFn(0, "FormAndSendHttpResp")
	defer func() { log.ExitFn(0, "FormAndSendHttpResp", nil) }()

	response := types.ApiResponse{
		Status:  httpStatusCode,
		Message: message,
		Data:    data,
	}

	jsonResp, err := json.Marshal(response)
	if err != nil {
		httpResp.Header().Set("Content-Type", "application/json; charset=UTF-8")
		httpResp.WriteHeader(http.StatusInternalServerError)
		httpResp.Write([]byte("Error marshaling response"))
		return
	} else {
		httpResp.Header().Set("Content-Type", "application/json; charset=UTF-8")
		httpResp.WriteHeader(httpStatusCode)
		httpResp.Write([]byte(jsonResp))
	}
}
