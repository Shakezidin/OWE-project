/**************************************************************************
 *	File            : docusignApiModels.go
 * 	DESCRIPTION     : This file contains models for docusign apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type DocusignCreateEnvelopeRequest struct {
	LeadsId        int64  `json:"leads_id"`
	EmailSubject   string `json:"email_subject"`
	DocumentBase64 string `json:"document_base64"`
	DocumentName   string `json:"document_name"`
	Status         string `json:"status"`
	AccessToken    string `json:"access_token"`
	BaseUri        string `json:"base_uri"`
}

type DocusignOauthRequest struct {
	Action            string `json:"action"`
	RedirectUri       string `json:"redirect_uri"`
	LeadsId           int64  `json:"leads_id"`
	AuthorizationCode string `json:"authorization_code"`
}

type DocusginOauthResponse struct {
	URL          string      `json:"url,omitempty"`
	AccessToken  string      `json:"access_token,omitempty"`
	RefreshToken string      `json:"refresh_token,omitempty"`
	TokenType    string      `json:"token_type,omitempty"`
	ExpiresIn    int64       `json:"expires_in,omitempty"`
	UserInfo     interface{} `json:"user_info,omitempty"`
}
