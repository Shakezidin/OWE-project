/**************************************************************************
 *      Function        : utilsErrorCode.go
 *      DESCRIPTION     : This file contains error codes
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package types

/**************************************************************************
 *      3GPP TS-29.500: 5.2.7.2-1 Defined Error Codes
 **************************************************************************/
const (
	INVALID_API uint16 = iota + 1
	INVALID_MSG_FORMAT
	INVALID_QUERY_PARAM
	INCORRECT_MANDATORY_QUERY_PARAM
	INCORRECT_OPTIONAL_QUERY_PARAM
	MISSING_MANDATORY_QUERY_PARAM
	INCORRECT_MANDATORY_IE
	INCORRECT_OPTIONAL_IE
	MISSING_MANDATORY_IE
	FAILURE_MSG_UNSPECIFIED
	MODIFICATION_NOT_ALLOWED         //403 Forbidden
	SUBSCRIPTION_NOT_FOUND           //404 Not Found
	RESOURCE_URI_STRUCTURE_NOT_FOUND //404 Not Found
	INCORRECT_LENGTH                 //411 Length Required
	NF_CONGESTION_RISK               //429 Too Many Requests
	INSUFFICIENT_RESOURCES           //500 Internal Server Error
	UNSPECIFIED_NF_FAILURE           //500 Internal Server Error
	SYSTEM_FAILURE                   //500 Internal Server Error
	SERVICE_NOT_AVAILABLE            //503 Service Unavailable
)

const (
	/* 1XX INFORMATIONAL */
	CONTINUE            uint16 = 100
	SWITCHING_PROTOCOLS uint16 = 101
	PROCESSING          uint16 = 102
	EARLY_HINTS         uint16 = 103

	/* 2XX SUCCESFUL */
	STATUS_200_OK                 uint16 = 200
	CREATED                       uint16 = 201
	ACCEPTED                      uint16 = 202
	NON_AUTHORITATIVE_INFORMATION uint16 = 203
	NON_CONTENT                   uint16 = 204
	RESET_CONTENT                 uint16 = 205
	PARTIAL_CONTENT               uint16 = 206
	MULTI_STATUS                  uint16 = 207
	ALREADY_REPORTED              uint16 = 208
	IM_USED                       uint16 = 226

	/* 3XX REDIRECTION	 */
	MULTIPLE_CHOICES                   uint16 = 300
	MOVED_PERMANENTLY                  uint16 = 301
	FOUND_PREVIOUSLY_MOVED_TEMPORARILY uint16 = 302
	SEE_OTHER                          uint16 = 303
	NOT_MODIFIED                       uint16 = 304
	USE_PROXY                          uint16 = 305
	SWITCH_PROXY                       uint16 = 306
	TEMPORARY_REDIRECT                 uint16 = 307
	PERMANENT_REDIRECT                 uint16 = 308

	/* 4XX CLIENT ERROR */
	BAD_REQUEST                     uint16 = 400
	UNAUTHORIZED                    uint16 = 401
	PAYMENT_REQUIRED                uint16 = 402
	FORBIDDEN                       uint16 = 403
	NOT_FOUND                       uint16 = 404
	METHOD_NOT_ALLOWED              uint16 = 405
	NOT_ACCEPTABLE                  uint16 = 406
	PROXY_AUTHENTICATION_REQUIRED   uint16 = 407
	REQUEST_TIMEOUT                 uint16 = 408
	CONFLICT                        uint16 = 409
	GONE                            uint16 = 410
	LENGTH_REQUIRED                 uint16 = 411
	PRECONDITION_FAILED             uint16 = 412
	PAYLOAD_TOO_LARGE               uint16 = 413
	URI_TOO_LONG                    uint16 = 414
	UNSUPPORTED_MEDIA_TYPE          uint16 = 415
	RANGE_NOT_SATISFIABLE           uint16 = 416
	EXPECTATION_FAILED              uint16 = 417
	I_AM_A_TEAPOT                   uint16 = 418
	MISDIRECTED_REQUEST             uint16 = 421
	UNPROCESSABLE_ENTITY            uint16 = 422
	LOCKED                          uint16 = 423
	FAILED_DEPENDENCY               uint16 = 424
	TOO_EARLY                       uint16 = 425
	UPGRADE_REQUIRED                uint16 = 426
	PRECONDITION_REQUIRED           uint16 = 428
	TOO_MANY_REQUESTS               uint16 = 429
	REQUEST_HEADER_FIELDS_TOO_LARGE uint16 = 431
	UNAVAILABLE_FOR_LEGAL_REASONS   uint16 = 451

	/* 5XX SERVER ERROR */
	INTERNAL_SERVER_ERROR           uint16 = 500
	NOT_IMPLEMENTED                 uint16 = 501
	BAD_GATEWAY                     uint16 = 502
	SERVICE_UNAVAILABLE             uint16 = 503
	GATEWAY_TIMEOUT                 uint16 = 504
	HTTP_VERSION_NOT_SUPPORTED      uint16 = 505
	VARIANT_ALSO_NEGOTIATES         uint16 = 506
	INSUFFICIENT_STORAGE            uint16 = 507
	LOOP_DETECTED                   uint16 = 508
	NOT_EXTENDED                    uint16 = 510
	NETWORK_AUTHENTICATION_REQUIRED uint16 = 511
)

/******************************************************************************
 * FUNCTION:        UtilsGetErrStr
 *
 * DESCRIPTION:     This function to error code to error string
 * INPUT:           error code
 * RETURNS:         error string
 ******************************************************************************/
func UtilsGetErrStr(eCode uint16) (eStr string) {
	errorStrings := map[uint16]string{
		INVALID_API:                        "INVALID_API",
		INVALID_MSG_FORMAT:                 "INVALID_MSG_FORMAT",
		INVALID_QUERY_PARAM:                "INVALID_QUERY_PARAM",
		INCORRECT_MANDATORY_QUERY_PARAM:    "INCORRECT_MANDATORY_QUERY_PARAM",
		INCORRECT_OPTIONAL_QUERY_PARAM:     "INCORRECT_OPTIONAL_QUERY_PARAM",
		MISSING_MANDATORY_QUERY_PARAM:      "MISSING_MANDATORY_QUERY_PARAM",
		INCORRECT_MANDATORY_IE:             "INCORRECT_MANDATORY_IE",
		INCORRECT_OPTIONAL_IE:              "INCORRECT_OPTIONAL_IE",
		MISSING_MANDATORY_IE:               "MISSING_MANDATORY_IE",
		FAILURE_MSG_UNSPECIFIED:            "FAILURE_MSG_UNSPECIFIED",
		MODIFICATION_NOT_ALLOWED:           "MODIFICATION_NOT_ALLOWED",
		SUBSCRIPTION_NOT_FOUND:             "SUBSCRIPTION_NOT_FOUND",
		RESOURCE_URI_STRUCTURE_NOT_FOUND:   "RESOURCE_URI_STRUCTURE_NOT_FOUND",
		INCORRECT_LENGTH:                   "INCORRECT_LENGTH",
		NF_CONGESTION_RISK:                 "NF_CONGESTION_RISK",
		INSUFFICIENT_RESOURCES:             "INSUFFICIENT_RESOURCES",
		UNSPECIFIED_NF_FAILURE:             "UNSPECIFIED_NF_FAILURE",
		SYSTEM_FAILURE:                     "SYSTEM_FAILURE",
		SERVICE_NOT_AVAILABLE:              "SERVICE_NOT_AVAILABLE",
		CONTINUE:                           "CONTINUE",
		SWITCHING_PROTOCOLS:                "SWITCHING_PROTOCOLS",
		PROCESSING:                         "PROCESSING",
		EARLY_HINTS:                        "EARLY_HINTS",
		STATUS_200_OK:                      "STATUS_200_OK",
		CREATED:                            "CREATED",
		ACCEPTED:                           "ACCEPTED",
		NON_AUTHORITATIVE_INFORMATION:      "NON_AUTHORITATIVE_INFORMATION",
		NON_CONTENT:                        "NON_CONTENT",
		RESET_CONTENT:                      "RESET_CONTENT",
		PARTIAL_CONTENT:                    "PARTIAL_CONTENT",
		MULTI_STATUS:                       "MULTI_STATUS",
		ALREADY_REPORTED:                   "ALREADY_REPORTED",
		IM_USED:                            "IM_USED",
		MULTIPLE_CHOICES:                   "MULTIPLE_CHOICES",
		MOVED_PERMANENTLY:                  "MOVED_PERMANENTLY",
		FOUND_PREVIOUSLY_MOVED_TEMPORARILY: "FOUND_PREVIOUSLY_MOVED_TEMPORARILY",
		SEE_OTHER:                          "SEE_OTHER",
		NOT_MODIFIED:                       "NOT_MODIFIED",
		USE_PROXY:                          "USE_PROXY",
		SWITCH_PROXY:                       "SWITCH_PROXY",
		TEMPORARY_REDIRECT:                 "TEMPORARY_REDIRECT",
		PERMANENT_REDIRECT:                 "PERMANENT_REDIRECT",
		BAD_REQUEST:                        "BAD_REQUEST",
		UNAUTHORIZED:                       "UNAUTHORIZED",
		PAYMENT_REQUIRED:                   "PAYMENT_REQUIRED",
		FORBIDDEN:                          "FORBIDDEN",
		NOT_FOUND:                          "NOT_FOUND",
		METHOD_NOT_ALLOWED:                 "METHOD_NOT_ALLOWED",
		NOT_ACCEPTABLE:                     "NOT_ACCEPTABLE",
		PROXY_AUTHENTICATION_REQUIRED:      "PROXY_AUTHENTICATION_REQUIRED",
		REQUEST_TIMEOUT:                    "REQUEST_TIMEOUT",
		CONFLICT:                           "CONFLICT",
		GONE:                               "GONE",
		LENGTH_REQUIRED:                    "LENGTH_REQUIRED",
		PRECONDITION_FAILED:                "PRECONDITION_FAILED",
		PAYLOAD_TOO_LARGE:                  "PAYLOAD_TOO_LARGE",
		URI_TOO_LONG:                       "URI_TOO_LONG",
		UNSUPPORTED_MEDIA_TYPE:             "UNSUPPORTED_MEDIA TYPE",
		RANGE_NOT_SATISFIABLE:              "RANGE_NOT_SATISFIABLE",
		EXPECTATION_FAILED:                 "EXPECTATION FAILED",
		I_AM_A_TEAPOT:                      "I_AM_A_TEAPOT",
		MISDIRECTED_REQUEST:                "MISDIRECTED_REQUEST",
		UNPROCESSABLE_ENTITY:               "UNPROCESSABLE_ENTITY",
		LOCKED:                             "LOCKED",
		FAILED_DEPENDENCY:                  "FAILED_DEPENDENCY",
		TOO_EARLY:                          "TOO_EARLY",
		UPGRADE_REQUIRED:                   "UPGRADE_REQUIRED",
		PRECONDITION_REQUIRED:              "PRECONDITION_REQUIRED",
		TOO_MANY_REQUESTS:                  "TOO_MANY_REQUESTS",
		REQUEST_HEADER_FIELDS_TOO_LARGE:    "REQUEST_HEADER_FIELDS_TOO_LARGE",
		UNAVAILABLE_FOR_LEGAL_REASONS:      "UNAVAILABLE_FOR_LEGAL_REASONS",
		INTERNAL_SERVER_ERROR:              "INTERNAL_SERVER_ERROR",
		NOT_IMPLEMENTED:                    "NOT_IMPLEMENTED",
		BAD_GATEWAY:                        "BAD_GATEWAY",
		SERVICE_UNAVAILABLE:                "SERVICE_UNAVAILABLE",
		GATEWAY_TIMEOUT:                    "GATEWAY_TIMEOUT",
		HTTP_VERSION_NOT_SUPPORTED:         "HTTP_VERSION_NOT_SUPPORTED",
		VARIANT_ALSO_NEGOTIATES:            "VARIANT_ALSO_NEGOTIATES",
		INSUFFICIENT_STORAGE:               "INSUFFICIENT_STORAGE",
		LOOP_DETECTED:                      "LOOP_DETECTED",
		NOT_EXTENDED:                       "NOT_EXTENDED",
		NETWORK_AUTHENTICATION_REQUIRED:    "NETWORK_AUTHENTICATION_REQUIRED",
	}
	eStr = errorStrings[eCode]
	return
}
