/**************************************************************************
 *      Function        : emailConfig.go
 *      DESCRIPTION     : contains structure for email configuration
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package models

type EmailCfg struct {
	SendgridKey string `json:"sendgridKey"`
	SenderEmail string `json:"senderEmail"`
	SenderName  string `json:"senderName"`
}
