/**************************************************************************
 *      Function        : utilsEnv.go
 *      DESCRIPTION     : This file contains func to read env variables
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package types

import (
	"os"
	"strconv"
	"strings"
	//"net"
)

/******************************************************************************
 * FUNCTION:        UtilsGetInt
 *
 * DESCRIPTION:     GetInt converts given environment value to int
 *                   and return the same.
 * INPUT:
 * RETURNS:         returns default value if env is not set or in case of error.
 ******************************************************************************/
func UtilsGetInt(key string, def int) (int, error) {
	str, set := os.LookupEnv(key)
	if !set {
		return def, nil
	}
	val, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return def, err
	}
	return int(val), nil
}

/******************************************************************************
 * FUNCTION:        UtilsGetString
 *
 * DESCRIPTION:     GetInt returns string value of given environment if set.
 *                   and return the same.
 * INPUT:
 * RETURNS:         returns default value if env is not set or in case of error.
 ******************************************************************************/
func UtilsGetString(key, def string) string {
	val, set := os.LookupEnv(key)
	if !set {
		return def
	}
	return val
}

/******************************************************************************
 * FUNCTION:        UtilsGetStringTokens
 *
 * DESCRIPTION:     GetStringSlice converts given environment value to tokens
 *                     of string based on given separater
 * INPUT:
 * RETURNS:         returns default value if env is not set or in case of error.
 ******************************************************************************/
func UtilsGetStringTocken(key, sep string, def []string) []string {
	val, set := os.LookupEnv(key)
	if !set {
		return def
	}
	slice := strings.Split(val, sep)
	return slice
}

/******************************************************************************
 * FUNCTION:        UtilsGetBool
 *
 * DESCRIPTION:     GetBool converts given environment value to bool and return the same.
 * INPUT:
 * RETURNS:         returns default value if env is not set or in case of error.
 ******************************************************************************/
func UtilsGetBool(key string, def bool) (bool, error) {
	str, set := os.LookupEnv(key)
	if !set {
		return def, nil
	}
	val, err := strconv.ParseBool(str)
	if err != nil {
		return def, err
	}
	return val, nil
}

/******************************************************************************
 * FUNCTION:        UtilsGetStringBool
 *
 * DESCRIPTION:     GetStringBool converts YES/NO value of given environment to bool.
 * INPUT:
 * RETURNS:         returns default value if env is not set or in case of error.
 ******************************************************************************/
func UtilsGetStringBool(key string, def bool) bool {
	str, set := os.LookupEnv(key)
	if !set {
		return def
	}
	val := false
	if strings.ToUpper(str) == "YES" {
		val = true
	}
	return val
}

/******************************************************************************
 * FUNCTION:        ValidateHostNPort
 *
 * DESCRIPTION:     Validate IP and Port
 * INPUT:
 * RETURNS:         returns sucess/failure.
 ******************************************************************************/
func ValidateHostNPort(host string) (bool, string, int) {

	hostItems := strings.Split(host, ":")

	switch len(hostItems) {
	case 0, 1:
		// empty host or port
		return false, "", 0
	case 2:
		host, port := hostItems[0], hostItems[1]

		if len(host) == 0 || len(port) == 0 {
			return false, "", 0
		}

		lportInt, lerr := strconv.Atoi(port)
		if nil != lerr {
			return false, "", 0
		}

		if lportInt < 1024 || lportInt > 65535 {
			return false, "", 0
		}

		/*hostIp := net.ParseIP(host)
		if hostIp == nil {
			return false, "", 0
		}*/
		return true, host, lportInt
	default:
		return false, "", 0
	}
}
