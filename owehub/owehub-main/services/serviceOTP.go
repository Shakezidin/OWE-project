/**************************************************************************
 * File			: serviceOTP.go
 * DESCRIPTION  : This file contains functions for OTP specific services
 * DATE         : 20-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/shared/logger"
	"fmt"
	"sync"
	"time"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

const (
	ForgotPasswordOTPLen     = 8
	ForgotPassOtpExpireInMin = 5
	FromEmailId              = "ourworldenergy17@gmail.com"
	FromPassword             = "qilkzsylqrpjwppj"
	createUserReqPassword    = "Welcome@123"
)

type OtpInfo struct {
	Otp        string
	CreateTime time.Time
}

type OtpMapInfo struct {
	OTPMap map[string]OtpInfo
	Mutex  sync.Mutex
}

var ForgotPassOTPMap OtpMapInfo

/******************************************************************************
 * FUNCTION:		InitializeOTPServices
 * DESCRIPTION:     function to Initilaize the OTP Services
 * INPUT:			None
 * RETURNS:    		None
 ******************************************************************************/
func InitializeOTPServices() {
	ForgotPassOTPMap.OTPMap = make(map[string]OtpInfo)
}

/******************************************************************************
 * FUNCTION:		SendOTPToClient
 * DESCRIPTION:     function to send the OTP to client
 * INPUT:			email, otp
 * RETURNS:    		void
 ******************************************************************************/
func SendOTPToClient(email string, otp string) (err error) {

	from := mail.NewEmail("OWE", "it@ourworldenergy.com")
	subject := "OTP for Password Reset"
	to := mail.NewEmail("", email)

	plainTextContent := fmt.Sprintf("OTP for password reset. Valid for %v Minutes", ForgotPassOtpExpireInMin)
	htmlContent := fmt.Sprintf(`
    <div style="
        border: 2px solid black;
        padding: 10px;
        font-size: 24px;
        width: fit-content;
        margin: auto;
    ">
        <strong>%s</strong>
    </div>
`, otp)

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient("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")
	response, err := client.Send(message)
	if err != nil {
		fmt.Println(err)
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}

	log.EnterFn(0, "SendOTPToClient")
	defer func() { log.ExitFn(0, "SendOTPToClient", nil) }()
	return nil
}

/******************************************************************************
 * FUNCTION:		StoreForgotPassOTP
 * DESCRIPTION:     function to store the forgot password OTP
 * INPUT:			email, otp
 * RETURNS:    		void
 ******************************************************************************/
func StoreForgotPassOTP(email string, otp string) {

	log.EnterFn(0, "StoreForgotPassOTP")
	defer func() {
		ForgotPassOTPMap.Mutex.Unlock()
		log.ExitFn(0, "StoreForgotPassOTP", nil)
	}()

	ForgotPassOTPMap.Mutex.Lock()
	ForgotPassOTPMap.OTPMap[email] = OtpInfo{Otp: otp, CreateTime: time.Now()}
}

/******************************************************************************
 * FUNCTION:		ValidateForgotPassOTP
 * DESCRIPTION:     function to check the forgot password OTP
 * INPUT:			email, otp
 * RETURNS:    		true if OTP valid, false otherwise
 ******************************************************************************/
func ValidateForgotPassOTP(email string, otp string) bool {

	log.EnterFn(0, "ValidateForgotPassOTP")
	defer func() {
		ForgotPassOTPMap.Mutex.Unlock()
		log.ExitFn(0, "ValidateForgotPassOTP", nil)
	}()

	ForgotPassOTPMap.Mutex.Lock()

	storedOTP, exists := ForgotPassOTPMap.OTPMap[email]
	if !exists {
		log.FuncInfoTrace(0, "OTP is not found in MAP")
		return false
	}

	/* Check if the OTP is still valid (not expired) */
	expirationTime := storedOTP.CreateTime.Add(ForgotPassOtpExpireInMin * time.Minute)
	isOtpValid := time.Now().Before(expirationTime) && storedOTP.Otp == otp

	if !isOtpValid {
		log.FuncInfoTrace(0, "Invalid OTP or OTP is Expired")
	}
	return isOtpValid
}
