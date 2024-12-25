package services

import "time"

func getString(item map[string]interface{}, key string) string {
	if val, ok := item[key]; ok && val != nil {
		if strVal, ok := val.(string); ok {
			return strVal
		}
	}
	return ""
}

func getTime(item map[string]interface{}, key string) time.Time {
	if val, ok := item[key]; ok && val != nil {
		if timeVal, ok := val.(time.Time); ok {
			return timeVal
		}
	}
	return time.Time{}
}
