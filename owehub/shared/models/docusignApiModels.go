/**************************************************************************
 *	File            : docusignApiModels.go
 * 	DESCRIPTION     : This file contains models for docusign apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

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

type DocusignCreateEnvelopeRequest struct {
	LeadsId      int64  `json:"leads_id"`
	EmailSubject string `json:"email_subject"`
	DocumentName string `json:"document_name"`
}

type DocusignCreateRecipientViewRequest struct {
	LeadsId   int64  `json:"leads_id"`
	ReturnUrl string `json:"return_url"`
}

type DocusignGetDocumentRequest struct {
	LeadsId int64 `json:"leads_id"`
}

type DocusignConnectListenerRequest struct {
	Event string `json:"event"`
	// Uri               string                 `json:"uri"`
	// RetryCount        string                 `json:"retryCount"`
	// ConfigurationId   string                 `json:"configurationId"`
	// ApiVersion        string                 `json:"apiVersion"`
	// GeneratedDateTime string                 `json:"generatedDateTime"`
	Data map[string]interface{} `json:"data"`
}
