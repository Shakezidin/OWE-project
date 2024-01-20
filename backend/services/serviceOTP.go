/**************************************************************************
 * File			: serviceOTP.go
 * DESCRIPTION  : This file contains functions for OTP specific services
 * DATE         : 20-Jan-2024
 **************************************************************************/

package services

import (
	log "OWEApp/logger"
	"fmt"
	"net/smtp"
	"sync"
	"time"
)

const (
	ForgotPasswordOTPLen     = 8
	ForgotPassOtpExpireInMin = 5
	FromEmailId              = "developg5gsystem@gmail.com"
	FromPassword             = "abcd@1234"
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

	log.EnterFn(0, "SendOTPToClient")
	defer func() { log.ExitFn(0, "SendOTPToClient", nil) }()

	to := email
	subject := "OTP for Password Reset"
	body := fmt.Sprintf("Your OTP for password reset is: %s\nOTP is valid for %v Minutes", otp, ForgotPassOtpExpireInMin)

	// Set up the authentication
	auth := smtp.PlainAuth("", FromEmailId, FromPassword, "smtp.gmail.com")

	// Set up the email content
	msg := []byte("To: " + to + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body)

	log.FuncDebugTrace(0, "Shushank %+v", string(msg))

	// Connect to the SMTP server
	err = smtp.SendMail("smtp.gmail.com:587", auth, FromEmailId, []string{to}, msg)
	if err != nil {
		return err
	}

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
