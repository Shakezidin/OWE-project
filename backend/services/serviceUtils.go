package services

import (
	log "OWEApp/logger"
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

func FormAndSendHttpResp(httpResp http.ResponseWriter, reqBody string, httpStatusCode int) {
	log.EnterFn(0, "FormAndSendHttpResp")
	httpResp.Header().Set("Content-Type", "application/json; charset=UTF-8")
	httpResp.WriteHeader(httpStatusCode)
	httpResp.Write([]byte(reqBody))
	log.ExitFn(0, "FormAndSendHttpResp", nil)
}
