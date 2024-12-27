/**************************************************************************
*	File			: apiDocusignGetSigningUrl.go
*	DESCRIPTION	: This file contains functions for getting docusign signing url
*	DATE			: 28-Aug-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/owehub-leads/docusignclient"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"encoding/base64"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strconv"

	"github.com/google/uuid"
)

/******************************************************************************
 * FUNCTION:		HandleDocusignGetSigningUrlRequest
 * DESCRIPTION:     handler for getting docusign signing url
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleDocusignGetSigningUrlRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                error
		query              string
		data               []map[string]interface{}
		leadId             int
		pdfUrl             string
		envelopeId         string
		pdfResp            *http.Response
		pdfBytes           []byte
		pdfBase64          string
		createEnvelopeResp *map[string]interface{}
	)

	const totalSteps = 7

	log.EnterFn(0, "HandleDocusignGetSigningUrlRequest")
	defer log.ExitFn(0, "HandleDocusignGetSigningUrlRequest", err)

	handler := appserver.NewSSEHandler(resp, req)
	defer func() { err = handler.EndResponse() }()

	// retreive lead id from url query
	leadIdStr := req.URL.Query().Get("leads_id")
	returnUrl := req.URL.Query().Get("return_url")

	if leadIdStr == "" {
		log.FuncErrorTrace(0, "Failed to parse get leads id from url query")
		handler.SendError("Lead id is not provided")
		return
	}

	if _, err = url.ParseRequestURI(returnUrl); err != nil {
		log.FuncErrorTrace(0, "Failed to parse return url from url query")
		handler.SendError("Return url is not provided")
		return
	}

	leadId, err = strconv.Atoi(leadIdStr)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
		handler.SendError("Invalid lead id format")
		return
	}

	// retreive design id from database
	query = `
		SELECT
			li.email_id,
			li.first_name,
			li.last_name,
			li.aurora_design_id,
			li.docusign_envelope_id
		FROM leads_info li
		WHERE li.leads_id = $1
	`
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to retrieve leads info from DB err: %v", err)
		handler.SendError("Failed to retrieve leads info from DB")
		return
	}

	if len(data) <= 0 {
		err = fmt.Errorf("leads info not found")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Lead not found")
		return
	}

	leadsEmail, ok := data[0]["email_id"].(string)
	if !ok {
		err = fmt.Errorf("email_id not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve email_id from database")
		return
	}

	leadsFirstName, ok := data[0]["first_name"].(string)
	if !ok {
		err = fmt.Errorf("first_name not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve first_name from database")
		return
	}

	leadsLastName, ok := data[0]["last_name"].(string)
	if !ok {
		err = fmt.Errorf("last_name not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve last_name from database")
		return
	}

	designId, ok := data[0]["aurora_design_id"].(string)
	if !ok {
		err = fmt.Errorf("aurora_design_id not found in database")
		log.FuncErrorTrace(0, "%v", err)
		handler.SendError("Failed to retrieve aurora_design_id from database")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 1,
		"total_steps":  totalSteps,
	}, false)

	envelopeId, ok = data[0]["docusign_envelope_id"].(string)

	if ok {
		// if docusign envelope id is present, resend the envelope
		resendEnvelopeApi := docusignclient.ResendEnvelopeApi{
			EnvelopeId: envelopeId,
			Recipients: []docusignclient.ResendEnvelopeApiRecipient{{RecipientId: leadIdStr}},
		}
		_, err = resendEnvelopeApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to resend docusign envelope err %v", err)
			handler.SendError(err.Error())
			return
		}

		handler.SendData(map[string]interface{}{
			"current_step": totalSteps,
			"total_steps":  totalSteps,
		}, true)
		return
	}

	// download proposal pdf
	pdfUrl, err = getAuroraProposalPdfUrl(designId)
	pdfResp, err = http.Get(pdfUrl)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to download proposal pdf as base64 string err: %v", err)
		handler.SendError("Failed to download proposal pdf")
		return
	}

	defer pdfResp.Body.Close()

	handler.SendData(map[string]interface{}{
		"current_step": 2,
		"total_steps":  totalSteps,
	}, false)

	pdfBytes, err = io.ReadAll(pdfResp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read proposal pdf as base64 string err: %v", err)
		handler.SendError("Failed to read proposal pdf")
		return
	}

	// write downloaded file to temp folder
	inputFilename := "/temp/" + uuid.New().String() + ".pdf"
	outputFilename := "/temp/" + uuid.New().String() + ".pdf"

	iFile, err := os.Create(inputFilename)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create file err: %v", err)
		handler.SendError("Failed to create file")
		return
	}
	defer iFile.Close()

	_, err = iFile.Write(pdfBytes)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to write file err: %v", err)
		handler.SendError("Failed to write file")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 3,
		"total_steps":  totalSteps,
	}, false)

	// compress the pdf using ghostscript
	cmd := exec.Command("gs",
		"-q",
		"-DNOPAUSE",
		"-DBATCH",
		"-dSAFER",
		"-dQUIET",
		"-sDEVICE=pdfwrite",
		"-dCompatibilityLevel=1.4",
		"-dPDFSETTINGS=/screen",
		"-dEmbedAllFonts=true",
		"-dSubsetFonts=true",
		"-dColorImageDownsampleType=/Bicubic",
		"-dColorImageResolution=144",
		"-dGrayImageDownsampleType=/Bicubic",
		"-dGrayImageResolution=144",
		"-dMonoImageDownsampleType=/Bicubic",
		"-dMonoImageResolution=144",
		"-sOutputFile="+outputFilename,
		"-",
		inputFilename,
	)
	err = cmd.Run()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to run ghostscript err: %v", err)
		handler.SendError("Failed to run ghostscript")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 4,
		"total_steps":  totalSteps,
	}, false)

	// read compressed file
	pdfBytes, err = os.ReadFile(outputFilename)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read ghostscript output file err: %v", err)
		handler.SendError("Failed to read file")
		return
	}

	log.FuncDebugTrace(0, "Ghostscript output file size: %f mb", float64(len(pdfBytes))/1024/1024)

	// delete temperory files
	err = os.Remove(inputFilename)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to remove input file err: %v", err)
		handler.SendError("Failed to remove input file")
		return
	}

	err = os.Remove(outputFilename)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to remove output file err: %v", err)
		handler.SendError("Failed to remove output file")
		return
	}

	pdfBase64 = base64.StdEncoding.EncodeToString(pdfBytes)

	handler.SendData(map[string]interface{}{
		"current_step": 5,
		"total_steps":  totalSteps,
	}, false)

	// create docusign envelope
	createEnvelopeApi := docusignclient.CreateEnvelopeApi{
		EmailSubject: string(leadsService.LeadDocusignLabelSubject),
		Documents: []docusignclient.CreateEnvelopeApiDocument{
			{
				DocumentId:     1,
				DocumentBase64: pdfBase64,
				Name:           string(leadsService.LeadDocusignLabelDocumentName),
				FileExtension:  "pdf",
			},
		},
		Recipients: []docusignclient.CreateEnvelopeApiRecipient{
			{
				Email:       leadsEmail,
				Name:        fmt.Sprintf("%s %s", leadsFirstName, leadsLastName),
				FirstName:   leadsFirstName,
				LastName:    leadsLastName,
				RecipientId: fmt.Sprintf("%d", leadId),
			},
		},
	}
	createEnvelopeResp, err = createEnvelopeApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create docusign envelope err %v", err)
		handler.SendError(err.Error())
		return
	}

	envelopeId, ok = (*createEnvelopeResp)["envelopeId"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get envelope id")
		handler.SendError("Failed to get envelope id")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 6,
		"total_steps":  totalSteps,
	}, false)

	query = `
			UPDATE leads_info SET
			docusign_envelope_id = $1,
			docusign_envelope_completed_at = NULL,
			docusign_envelope_declined_at = NULL,
			docusign_envelope_voided_at = NULL,
			docusign_envelope_sent_at = CURRENT_TIMESTAMP
			WHERE leads_id = $2
		`
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{envelopeId, leadId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to update docusign envelope id err %v", err)
		handler.SendError(err.Error())
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": totalSteps,
		"total_steps":  totalSteps,
	}, true)
}
