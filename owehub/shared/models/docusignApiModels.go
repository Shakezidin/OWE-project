/**************************************************************************
 *	File            : docusignApiModels.go
 * 	DESCRIPTION     : This file contains models for docusign apis
 *	DATE            : 28-Sep-2024
**************************************************************************/

package models

type DocusignCreateEnvelopeRequest struct {
	LeadsId               int64  `json:"leads_id"`
	EmailSubject          string `json:"email_subject"`
	DocumentBase64        string `json:"document_base64"`
	DocumentId            string `json:"document_id"`
	DocumentName          string `json:"document_name"`
	DocumentFileExtension string `json:"document_file_extension"`
	Status                string `json:"status"`
}
