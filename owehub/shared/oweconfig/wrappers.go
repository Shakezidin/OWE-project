/**************************************************************************
 *	Function	: wrappers.go
 *	DESCRIPTION : Files contains utility functions for required for config
 *	DATE        : 20-June-2024
 **************************************************************************/

package oweconfig

import "time"

/* Helper functions for type assertions and defaults */
func getInt64(item map[string]interface{}, key string) int64 {
	if value, ok := item[key].(int64); ok {
		return value
	}
	return 0
}

func getString(item map[string]interface{}, key string) string {
	if value, ok := item[key].(string); ok {
		return value
	}
	return ""
}

func getFloat64(item map[string]interface{}, key string) float64 {
	if value, ok := item[key].(float64); ok {
		return value
	}
	return 0
}

func getTime(item map[string]interface{}, key string) time.Time {
	if value, ok := item[key].(time.Time); ok {
		return value
	}
	return time.Time{} // Return zero value
}
