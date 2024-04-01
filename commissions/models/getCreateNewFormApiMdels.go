/**************************************************************************
 *	Function	: getCreateNewFormApiMdels.go
 *	DESCRIPTION : Files contains struct for get create new form data request
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type CreateNewFormDataRequest struct {
	TableNames []string `json:"tableNames"`
}

// NewFormData holds the data for each category
type NewFormData struct {
	Categories map[string][]string `json:"categories"`
}

// NewFormDataResponse holds the response format for new form data
type NewFormDataResponse struct {
	Data NewFormData `json:"data"`
}
