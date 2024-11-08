/**************************************************************************
 *      Function        : configLoader.go
 *      DESCRIPTION     : This file contains function to load email config
 *      				  and initialize email templates
 *      DATE            : 11-Jan-2024
 **************************************************************************/
package email

import (
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"OWEApp/shared/types"
	"encoding/json"
	"os"
)

// flag to check if email config is loaded in interfacing functions
var isLoaded = false

/******************************************************************************
 * FUNCTION:        FetchEmailCfg
 *
 * DESCRIPTION:     This function will read the email config file. Must be
 *                  called in the init function of service that uses email.
 * INPUT:           configFilePath
 * RETURNS:         error
 ******************************************************************************/
func FetchEmailCfg(configFilePath string) error {
	var (
		err      error
		cfgFile  []byte
		emailCfg models.EmailCfg
	)

	log.EnterFn(0, "FetchEmailCfg")
	defer func() { log.ExitFn(0, "FetchEmailCfg", err) }()

	cfgFile, err = os.ReadFile(configFilePath)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read email config file err: %v", err)
		return err
	}

	log.FuncDebugTrace(0, "Email config file: %v", string(cfgFile))

	err = json.Unmarshal(cfgFile, &emailCfg)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to Urmarshal email config file err: %v", err)
		return err
	}

	types.CommGlbCfg.EmailCfg = emailCfg
	isLoaded = true

	// initialize the email templates
	_, err = getEmailTemplate()

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get email template err: %v", err)
		return err
	}

	return nil
}
