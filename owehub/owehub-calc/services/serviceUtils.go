package services

import (
	log "OWEApp/shared/logger"
	types "OWEApp/shared/types"
	"encoding/binary"
	"encoding/json"
	"fmt"

	"math/rand"
	"net/http"
	"time"
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

func GenerateRandomNumWithLen(len int) (randNumber string, err error) {

	log.EnterFn(0, "GenerateRandomNumWithLen")
	defer func() { log.ExitFn(0, "GenerateRandomNumWithLen", err) }()

	if len <= 0 {
		err = fmt.Errorf("Length should be greater than 0")
		return randNumber, err
	}

	// Calculate the maximum value based on the desired length
	maxValue := 1
	for i := 0; i < len-1; i++ {
		maxValue *= 10
	}

	// Generate enough random bytes to cover the desired length
	randomBytes := make([]byte, 4)
	_, err = rand.Read(randomBytes)
	if err != nil {
		return randNumber, err
	}

	// Convert the random bytes to an unsigned 32-bit integer
	randomNumber := binary.BigEndian.Uint32(randomBytes)

	// Create an OTP with the desired length
	otp := int(randomNumber) % maxValue

	// Format the OTP to ensure it has leading zeros if necessary
	formatString := fmt.Sprintf("%%0%dd", len)
	return fmt.Sprintf(formatString, otp), nil
}

func FormAndSendHttpResp(httpResp http.ResponseWriter, message string, httpStatusCode int, data types.Data, dbRecCount ...int64) {
	log.EnterFn(0, "FormAndSendHttpResp")
	defer func() { log.ExitFn(0, "FormAndSendHttpResp", nil) }()
	// Check if dbRecCount is provided
	var count int64
	if len(dbRecCount) > 0 {
		count = dbRecCount[0]
	}

	response := types.ApiResponse{
		Status:     httpStatusCode,
		Message:    message,
		DbRecCount: count,
		Data:       data,
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
