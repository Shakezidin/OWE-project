package services

import (
	log "OWEApp/shared/logger"
	types "OWEApp/shared/types"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"strings"

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

func BytesToStringArray(raw []byte) []string {
	str := string(raw)
	str = strings.Trim(str, "{}\"") // Remove curly braces
	log.FuncDebugTrace(0, "Before: %+v, After: %+v", string(raw), str)
	strArray := strings.Split(str, ",") // Split by comma
	for i := range strArray {
		strArray[i] = strings.TrimSpace(strArray[i]) // Trim spaces
	}
	return strArray
}

// Paginate a list using slicing
func StaticPaginate[T any](data []T, pageNumber int64, pageSize int64) []T {
	start := (pageNumber - 1) * pageSize
	if start >= int64(len(data)) {
		return []T{}
	}

	end := start + pageSize
	if end > int64(len(data)) {
		end = int64(len(data))
	}

	return data[start:end]
}

// Chunkify splits a slice into chunks of the specified size.
func Chunkify[T any](slice []T, chunkSize int) [][]T {
	if chunkSize <= 0 {
		return nil
	}

	var chunks [][]T
	for i := 0; i < len(slice); i += chunkSize {
		end := i + chunkSize
		if end > len(slice) {
			end = len(slice)
		}
		chunks = append(chunks, slice[i:end])
	}
	return chunks
}
