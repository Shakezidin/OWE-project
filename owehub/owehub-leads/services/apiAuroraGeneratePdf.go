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
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/cdp"
	"github.com/go-rod/rod/lib/launcher"
	"github.com/go-rod/rod/lib/proto"
	"github.com/ysmood/gson"
)

type SSERespPayload struct {
	Data   map[string]interface{} `json:"data"`
	IsDone bool                   `json:"is_done"`
}

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
		err                     error
		leadId                  int
		query                   string
		data                    []map[string]interface{}
		proposalUrl             string
		pdfBytes                []byte
		browser                 *rod.Browser
		browserLauncher         *launcher.Launcher
		browserClient           *cdp.Client
		page                    *rod.Page
		reader                  *rod.StreamReader
		retreiveWebProposalResp *auroraclient.RetrieveWebProposalApiResponse
		generateWebProposalResp *auroraclient.GenerateWebProposalApiResponse
	)

	const totalSteps = 11

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
	query = "SELECT aurora_design_id FROM leads_info WHERE leads_id = $1"
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

	designId, ok := data[0]["aurora_design_id"].(string)
	if !ok {
		log.FuncErrorTrace(0, "Failed to get aurora design id for lead id %d", leadId)
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
		generateWebProposalResp, err = generateWebProposalApi.Call()
		if err != nil {
			log.FuncErrorTrace(0, "Failed to call aurora api err %v", err)
			handler.SendError("Server side error")
			return
		}
		proposalUrl = *generateWebProposalResp.WebProposal.URL

	} else {
		proposalUrl = *retreiveWebProposalResp.WebProposal.URL
	}
	handler.SendData(map[string]interface{}{
		"current_step": 2,
		"total_steps":  totalSteps,
	}, false)

	// follow step 3 to 10 for generating pdf
	browserLauncher, err = launcher.NewManaged(leadsService.LeadAppCfg.RodUrl)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create rod browser launcher err %v", err)
		handler.SendError("Server side error")
		return
	}
	browserLauncher.Headless(true)

	browserClient, err = browserLauncher.Client()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to create rod browser launcher client err %v", err)
		handler.SendError("Server side error")
		return
	}

	browser = rod.New().Client(browserClient)
	err = browser.Connect()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to connect rod browser err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: Browser connected")
	defer browser.Close()
	handler.SendData(map[string]interface{}{
		"current_step": 3,
		"total_steps":  totalSteps,
	}, false)

	page, err = browser.Page(proto.TargetCreateTarget{URL: proposalUrl})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to load rod page err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: Page loaded")
	handler.SendData(map[string]interface{}{
		"current_step": 4,
		"total_steps":  totalSteps,
	}, false)

	err = page.WaitLoad()
	if err != nil {
		log.FuncErrorTrace(0, "Failed to wait load rod page err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: Page loaded")
	handler.SendData(map[string]interface{}{
		"current_step": 5,
		"total_steps":  totalSteps,
	}, false)

	err = page.WaitIdle(time.Second * 2)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to wait idle rod page err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: Page idle")
	handler.SendData(map[string]interface{}{
		"current_step": 6,
		"total_steps":  totalSteps,
	}, false)

	err = page.WaitDOMStable(time.Second*2, 0)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to wait DOM stable rod page err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: DOM stable")
	handler.SendData(map[string]interface{}{
		"current_step": 7,
		"total_steps":  totalSteps,
	}, false)

	page.WaitRequestIdle(time.Second*2, nil, nil, nil)()
	log.FuncDebugTrace(0, "PDF GENERATION: Request idle")
	handler.SendData(map[string]interface{}{
		"current_step": 8,
		"total_steps":  totalSteps,
	}, false)

	reader, err = page.PDF(&proto.PagePrintToPDF{
		PreferCSSPageSize: true,
		PrintBackground:   true,
		GenerateTaggedPDF: true,
		Landscape:         true,
		PaperWidth:        gson.Num(8.3),
		MarginTop:         gson.Num(0),
		MarginBottom:      gson.Num(0),
		MarginLeft:        gson.Num(0),
		MarginRight:       gson.Num(0),
	})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to generate pdf err %v", err)
		handler.SendError("Server side error")
		return
	}
	log.FuncDebugTrace(0, "PDF GENERATION: PDF generated")
	handler.SendData(map[string]interface{}{
		"current_step": 9,
		"total_steps":  totalSteps,
	}, false)

	// upload to s3
	pdfBytes, err = io.ReadAll(reader)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to read pdf bytes err %v", err)
		handler.SendError("Server side error")
		return
	}

	filename := fmt.Sprintf("%d.pdf", leadId)
	filePath := fmt.Sprintf("/leads/proposals/%s.pdf", filename)
	err = leadsService.S3PutObject(filePath, bytes.NewReader((pdfBytes)))

	if err != nil {
		log.FuncErrorTrace(0, "Failed to upload pdf to s3 err %v", err)
		handler.SendError("Server side error")
		return
	}
	handler.SendData(map[string]interface{}{
		"current_step": 10,
		"total_steps":  totalSteps,
	}, false)

	// end the response providing the url
	handler.SendData(map[string]interface{}{
		"current_step": totalSteps,
		"total_steps":  totalSteps,
		"url":          leadsService.S3GetObjectUrl(filePath),
	}, true)
}
