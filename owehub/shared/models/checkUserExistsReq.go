/**************************************************************************
 *	Function	: checkUserExists.go
 *	DESCRIPTION : Files contains struct for chnage password API
 *	DATE        : 10-May-2024
 **************************************************************************/

package models

type CheckUserExists struct {
	Email string `json:"email"`
}

type CheckUserExistsResp struct {
	Email  string `json:"email"`
	Exists bool   `json:"exists"`
}
