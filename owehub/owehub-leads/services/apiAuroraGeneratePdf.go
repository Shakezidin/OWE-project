/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	"OWEApp/owehub-leads/auroraclient"
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"bytes"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

/******************************************************************************
 * FUNCTION:        HandleAuroraGeneratePdfRequest
 *
 * DESCRIPTION:     This function will handle the request to generate a pdf
 *                  in aurora
 * INPUT:			resp, req
 * RETURNS:    		N/A
 ******************************************************************************/
func HandleAuroraGeneratePdfRequest(resp http.ResponseWriter, req *http.Request) {
	var (
		err                          error
		leadId                       int
		query                        string
		data                         []map[string]interface{}
		auroraPdfUrl                 string
		auororaPdfRespBytes          []byte
		auroraPdfResp                *http.Response
		runProposalPdfGenerationResp *auroraclient.RunProposalPdfGenerationApiResponse
		retreiveWebProposalResp      *auroraclient.RetrieveWebProposalApiResponse
	)

	const totalSteps = 8

	log.EnterFn(0, "HandleAuroraGeneratePdfRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGeneratePdfRequest", err) }()

	handler := appserver.NewSSEHandler(resp, req)
	defer func() { err = handler.EndResponse() }()

	// retreive lead id from url query
	leadIdStr := req.URL.Query().Get("leads_id")

	if leadIdStr == "" {
		log.FuncErrorTrace(0, "Failed to parse get leads id from url query")
		handler.SendError("Lead id is not provided")
		return
	}

	leadId, err = strconv.Atoi(leadIdStr)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to parse leads id err %v", err)
		handler.SendError("Invalid lead id format")
		return
	}

	// retreive design id from database
	query = "SELECT first_name, last_name, aurora_design_id, proposal_pdf_key FROM leads_info WHERE leads_id = $1"
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{leadId})

	if err != nil {
		log.FuncErrorTrace(0, "Failed to query database err %v", err)
		handler.SendError("Server side error")
		return
	}

	if len(data) == 0 {
		log.FuncErrorTrace(0, "Failed to find aurora design id for lead id %d", leadId)
		handler.SendError("Lead not found")
		return
	}

	// try to get proposal_pdf_key, if found, skip to last step
	pdfKey, ok := data[0]["proposal_pdf_key"].(string)
	if ok {
		log.FuncDebugTrace(0, "PDF key found in DB: %s", pdfKey)
		handler.SendData(map[string]interface{}{
			"current_step": totalSteps,
			"total_steps":  totalSteps,
			"url":          leadsService.S3GetObjectUrl(pdfKey),
		}, true)
		return
	}

	designId, ok := data[0]["aurora_design_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get aurora design id for lead id %d", leadId)
		handler.SendError("Server side error")
		return
	}

	firstName, ok := data[0]["first_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get first name for lead id %d", leadId)
		handler.SendError("Server side error")
		return
	}

	lastName, ok := data[0]["last_name"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get last name for lead id %d", leadId)
		handler.SendError("Server side error")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 1,
		"total_steps":  totalSteps,
	}, false)

	// retrieve proposal url from aurora, if not found, generate it
	retrieveWebProposalApi := auroraclient.RetrieveWebProposalApi{DesignId: designId}
	retreiveWebProposalResp, err = retrieveWebProposalApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
		handler.SendError("Server side error")
		return
	}

	if retreiveWebProposalResp.WebProposal.URL == nil ||
		retreiveWebProposalResp.WebProposal.URLExpired {

		generateWebProposalApi := auroraclient.GenerateWebProposalApi{DesignId: designId}
		_, err = generateWebProposalApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
			handler.SendError("Server side error")
			return
		}
	}

	handler.SendData(map[string]interface{}{
		"current_step": 2,
		"total_steps":  totalSteps,
	}, false)

	// aurora api calls to generate pdf
	runProposalPdfGenerationApi := auroraclient.RunProposalPdfGenerationApi{
		DesignId: designId,
	}

	runProposalPdfGenerationResp, err = runProposalPdfGenerationApi.Call()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
		handler.SendError("Server side error")
		return
	}

	handler.SendData(map[string]interface{}{
		"current_step": 3,
		"total_steps":  totalSteps,
	}, false)

	jobId, ok := runProposalPdfGenerationResp.ProposalPdfGenerationJob["job_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get job_id from run pdf generation: %+v", runProposalPdfGenerationResp.ProposalPdfGenerationJob)
		handler.SendError("Server side error")
		return
	}

	pdfGenUrl, ok := runProposalPdfGenerationResp.ProposalPdfGenerationJob["url"].(string)
	if ok {
		log.FuncDebugTrace(0, "Got URL from run pdf generation: %s", pdfGenUrl)
		auroraPdfUrl = pdfGenUrl
	} else {
		auroraPdfUrl, err = getAuroraPdfUrlByPooling(designId, jobId)
		if err != nil {
			log.FuncErrorTrace(0, "Failed to get aurora pdf url by pooling err %v", err)
			handler.SendError("Server side error")
			return
		}
	}
	handler.SendData(map[string]interface{}{
		"current_step": 4,
		"total_steps":  totalSteps,
	}, false)

	// download pdf from aurora
	auroraPdfResp, err = http.Get(auroraPdfUrl)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to download pdf from aurora err %v", err)
		handler.SendError("Server side error")
		return
	}
	handler.SendData(map[string]interface{}{
		"current_step": 5,
		"total_steps":  totalSteps,
	}, false)
	defer auroraPdfResp.Body.Close()

	auororaPdfRespBytes, err = io.ReadAll(auroraPdfResp.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read response body from aurora api err %v", err)
		handler.SendError("Server side error")
		return
	}
	handler.SendData(map[string]interface{}{
		"current_step": 6,
		"total_steps":  totalSteps,
	}, false)

	// upload to s3
	filename := getLeadPdfFilename(firstName, lastName)
	filePath := fmt.Sprintf("/leads/proposals/%s", filename)
	err = leadsService.S3PutObject(filePath, bytes.NewReader(auororaPdfRespBytes))

	if err != nil {
		log.FuncErrorTrace(0, "Failed to upload pdf to s3 err %v", err)
		handler.SendError("Server side error")
		return
	}
	handler.SendData(map[string]interface{}{
		"current_step": 7,
		"total_steps":  totalSteps,
	}, false)

	// update leads info
	query = "UPDATE leads_info SET proposal_pdf_key = $1 WHERE leads_id = $2"
	err, _ = db.UpdateDataInDB(db.OweHubDbIndex, query, []interface{}{filePath, leadId})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to update leads info err %v", err)
		handler.SendError("Server side error")
		return
	}

	// end the response providing the url
	handler.SendData(map[string]interface{}{
		"current_step": totalSteps,
		"total_steps":  totalSteps,
		"url":          leadsService.S3GetObjectUrl(filePath),
	}, true)
}

/******************************************************************************
 * FUNCTION:        getAuroraPdfUrlByPooling
 * DESCRIPTION:     This function will get aurora pdf url by pooling
 * INPUT:			designId, jobId
 * RETURNS:    		string, error
 ******************************************************************************/
func getAuroraPdfUrlByPooling(designId, jobId string) (string, error) {
	var (
		err                               error
		auroraPdfUrl                      string
		retrieveProposalPdfGenerationResp *auroraclient.RetrieveProposalPdfGenerationApiResponse
	)

	startTimeUnix := time.Now().Unix()
	for {
		<-time.After(time.Second * 5)
		log.FuncDebugTrace(0, "PDF generation: Checking PDF generation status")

		retrieveProposalPdfGenerationApi := auroraclient.RetrieveProposalPdfGenerationApi{
			DesignId: designId,
			JobId:    jobId,
		}

		retrieveProposalPdfGenerationResp, err = retrieveProposalPdfGenerationApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
			return "", err
		}

		pdfGenerationJobStatus, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["status"].(string)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get status from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
			return "", err
		}

		if pdfGenerationJobStatus == "running" {
			log.FuncDebugTrace(0, "PDF generation: PDF generation still running")
			continue
		}

		if pdfGenerationJobStatus == "failed" {
			pdfGenerationError, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["error"].(map[string]string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get error from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
				return "", errors.New("PDF generation failed")
			}
			log.FuncErrorTrace(0, "PDF generation: PDF generation failed with error: %s", pdfGenerationError["message"])
			return "", errors.New("PDF generation failed")
		}

		if pdfGenerationJobStatus == "succeeded" {
			log.FuncDebugTrace(0, "PDF generation: PDF generation completed")
			pdfGenerationUrl, ok := retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob["url"].(string)
			if !ok {
				log.FuncErrorTrace(0, "Failed to get url from retrieve pdf generation: %+v", retrieveProposalPdfGenerationResp.ProposalPdfGenerationJob)
				return "", errors.New("PDF generation failed")
			}
			auroraPdfUrl = pdfGenerationUrl
			log.FuncDebugTrace(0, "PDF generation: Got URL from retrieve pdf generation: %s", pdfGenerationUrl)
			break
		}

		// timeout after 10 minutes
		if time.Now().Unix()-startTimeUnix > 1200 {
			log.FuncErrorTrace(0, "PDF generation: PDF generation timed out")
			return "", errors.New("PDF generation timed out")
		}
	}

	return auroraPdfUrl, nil
}
