/**************************************************************************
 *	File            : aurora.go
 * 	DESCRIPTION     : This file contains common aurora config and helpers
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

type LeadAppConfig struct {
	AuroraTenantId         string `json:"auroraTenantId"`
	AuroraBearerToken      string `json:"auroraBearerToken"`
	AuroraApiBaseUrl       string `json:"auroraApiBaseUrl"`
	AppointmentSenderEmail string `json:"appointmentSenderEmail"`
	AwsS3Bucket            string `json:"awsS3Bucket"`
	AwsS3Region            string `json:"awsS3Region"`
	AwsS3AccessKeyId       string `json:"awsS3AccessKeyId"`
	AwsS3SecretKey         string `json:"awsS3SecretKey"`
	DocusignApiBaseUrl     string `json:"docusignApiBaseUrl"`
	DocusignOathBaseUrl    string `json:"docusignOauthBaseUrl"`
	DocusignAccountId      string `json:"docusignAccountId"`
	DocusignIntegrationKey string `json:"docusignIntegrationKey"`
	DocusignUserId         string `json:"docusignUserId"`
	DocusignRsaPrivateKey  string `json:"docusignRsaPrivateKey"`
	DocusignRsaPublicKey   string `json:"docusignRsaPublicKey"`
	DocusignSecretKey      string `json:"docusignSecretKey"`
}

var LeadAppCfg LeadAppConfig
