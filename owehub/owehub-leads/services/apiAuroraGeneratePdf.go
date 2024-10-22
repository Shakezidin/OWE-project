/**************************************************************************
 *	File            : apiAuroraCreateProposal.go
 * 	DESCRIPTION     : This file contains api calls to create a project in aurora
 *	DATE            : 28-Sep-2024
**************************************************************************/

package services

import (
	leadsService "OWEApp/owehub-leads/common"
	"OWEApp/shared/appserver"
	log "OWEApp/shared/logger"
	"net/http"
	"time"

	"github.com/go-rod/rod"
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
		err     error
		fileUrl string
	)

	const totalSteps = 10

	log.EnterFn(0, "HandleAuroraGeneratePdfRequest")
	defer func() { log.ExitFn(0, "HandleAuroraGeneratePdfRequest", err) }()

	handler := appserver.NewSSEHandler(resp, req)
	defer handler.EndResponse(map[string]interface{}{
		"current_step": totalSteps,
		"total_steps":  totalSteps,
		"url":          fileUrl,
	})

}

func GeneratePdfForUrl(url string) error {
	var (
		err      error
		browser  *rod.Browser
		page     *rod.Page
		reader   *rod.StreamReader
		pdfBytes []byte
	)

	browser = rod.New()

	err = browser.Connect()
	if err != nil {
		return err
	}

	page, err = browser.Page(proto.TargetCreateTarget{URL: url})
	if err != nil {
		return err
	}

	err = page.WaitLoad()
	if err != nil {
		return err
	}

	err = page.WaitIdle(time.Second * 2)
	if err != nil {
		return err
	}

	err = page.WaitDOMStable(time.Second*2, 0)
	if err != nil {
		return err
	}

	page.WaitRequestIdle(time.Second*2, nil, nil, nil)()

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
		return err
	}

	err = leadsService.S3PutObject("", reader)

	return nil
}
