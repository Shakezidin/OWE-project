/**************************************************************************
 *	Function	: getDbTableModel.go
 *	DESCRIPTION : Files contains struct for get user management onboarding models
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type Table struct {
	TableName string `json:"table_name"`
}

type TableList struct {
	DbTables []Table `json:"db_tables"`
}
