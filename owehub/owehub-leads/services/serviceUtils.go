package services

import (
	log "OWEApp/shared/logger"
	types "OWEApp/shared/types"
	"encoding/binary"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"

	"math/rand"
	"net/http"
	"time"

	models "OWEApp/shared/models"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
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

// Log details in user related apis: create, update & delete user apis
func initUserApiLogging(req *http.Request) (
	logUserApi func(string), closeUserLog func(error),
) {
	var (
		urlParts           []string
		apiName            string
		logBuilder         strings.Builder
		authenticatedEmail string
		startTime          string
		logFile            *os.File
		logFileOpenErr     error
	)

	log.EnterFn(0, "startUserApiLogging")
	defer func() { log.ExitFn(0, "startUserApiLogging", logFileOpenErr) }()

	// initialize log parameters for the api call

	urlParts = strings.Split(req.URL.Path, "/")
	apiName = urlParts[len(urlParts)-1]
	authenticatedEmail = req.Context().Value("emailid").(string)
	startTime = time.Now().Format("2006-01-02T15:04:05.999Z")

	logFile, logFileOpenErr = os.OpenFile("/var/log/owe/owe-users.log", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0644)

	// initial logs for the api call
	if logFileOpenErr != nil {
		log.FuncErrorTrace(0, "Cannot open user log file err: %v", logFileOpenErr)
	} else {
		// write authenticatedEmail and apiName
		_, err := logBuilder.WriteString(fmt.Sprintf("\n[%s] %s invoked by user %s\n", startTime, apiName, authenticatedEmail))
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to user log builder err: %v", err)
		}
	}

	logUserApi = func(message string) {
		if logFileOpenErr != nil {
			return
		}
		_, err := logBuilder.WriteString(fmt.Sprintf("%s\n", message))
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to user log builder err: %v", err)
		}
	}

	// Record end of api call (Call this in a deferred func)
	closeUserLog = func(err error) {

		if logFileOpenErr != nil {
			return
		}

		// only write log on api success
		if err != nil {
			return
		}

		_, err = logFile.WriteString(logBuilder.String())
		if err != nil {
			log.FuncErrorTrace(0, "Cannot write to user log file err: %v", err)
		}

		err = logFile.Close()
		if err != nil {
			log.FuncErrorTrace(0, "Cannot close log file: %v", err)
		}
	}
	return logUserApi, closeUserLog
}

// ValidateCreateLeadsRequest validates the input data in the CreateLeadsRequest
func ValidateCreateLeadsRequest(req models.CreateLeadsReq) error {
	if len(req.FirstName) <= 0 || len(req.LastName) <= 0 || len(req.EmailId) <= 0 || len(req.PhoneNumber) <= 0 {
		return errors.New("empty input fields in API are not allowed")
	}
	return nil
}

// return true or false
// true - transaction commit
// false - transaction rollback
// this function will send the email to the client that your appointment is on this date and our sales
// representative will come to you and talk to you
// about client email ?
func sentAppointmentEmail(ClientEmail, dateTime string) bool {

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	to := mail.NewEmail("Client", ClientEmail)

	// Create the email content
	subject := "Appointment Confirmation"
	plainTextContent := fmt.Sprintf("Dear Customer, your appointment is scheduled for %s.", dateTime)
	htmlContent := fmt.Sprintf("<strong>Dear Customer,</strong><br>Your appointment is scheduled for <b>%s</b>.", dateTime)

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)

	client := sendgrid.NewSendClient("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")

	_, err := client.Send(message)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to send email to %s : %v", ClientEmail, err)
		return false
	}

	// Log success and return true if email is sent successfully
	//FormAndSendHttpResp(resp, "Email send succesfully", http.StatusAccepted, fmt.Sprintf("email sent succesfully to %v", ClientEmail), 1)
	return true
}
