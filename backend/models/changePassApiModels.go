/**************************************************************************
 *	Function	: changePassApiModels.go
 *	DESCRIPTION : Files contains struct for chnage password API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type ChangePasswordReq struct {
	CurrentPassword string `json:"current_password"`
	NewPassword     string `json:"new_password"`
}
