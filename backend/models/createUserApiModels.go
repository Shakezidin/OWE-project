/**************************************************************************
 *	Function	: createUserApiModels.go
 *	DESCRIPTION : Files contains struct for create user API
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateUserReq struct {
	FirstName    string `json:"firstname"`
	LastName     string `json:"lastname"`
	EmailId      string `json:"emailid"`
	MobileNumber string `json:"mobilenumber"`
}
