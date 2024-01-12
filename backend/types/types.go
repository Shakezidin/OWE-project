/**************************************************************************
 *      File            : types.go
 *      DESCRIPTION     : This file contains common structures used across all packages in
 *							 service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package types

import (
	CfgModels "config/configModels"
)

var (
	CommGlbCfg CfgModels.SvcConfig
	ExitChan   chan error
)
