package models

type DbLogReq struct {
	PageNumber int    `json:"page_number"`
	PageSize   int    `json:"page_size"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	Username   string
}

type DbLogResp struct {
	Username     string `json:"username"`
	DbName       string `json:"db_name"`
	TimeDate     string `json:"time_date"`
	QueryDetails string `json:"query_details"`
}

type DbLogListResp struct {
	DbLogList []DbLogResp `json:"dblog_list_response"`
}

var DbColumnToFields = map[string]string{
	"usename":     "Username",
	"datname":     "DbName",
	"query_start": "TimeDate",
	"query":       "QueryDetails",
}
