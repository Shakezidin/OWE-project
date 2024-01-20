/**************************************************************************
 *	Function	: forgotPassApiModels.go
 *	DESCRIPTION : Files contains struct for forgot password API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type ForgotPasswordReq struct {
	EmailId     string `json:"emailid"`
	Otp         string `json:"otp"`
	NewPassword string `json:"newpassword"`
}
