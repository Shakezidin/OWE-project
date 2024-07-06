/**************************************************************************
 * File            : arSkdCfg.go
 * DESCRIPTION     : This file contains the model and data form ArSkd
 * DATE            : 05-May-2024
 **************************************************************************/

 package datamgmt

 import (
	 db "OWEApp/shared/db"
	 log "OWEApp/shared/logger"
	 "time"
 )
 
 type GetArScheduleTemp struct {
	 RecordId      int64   `json:"record_id"`
	 PartnerName   string  `json:"partner_name"`
	 InstallerName string  `json:"installer_name"`
	 SaleTypeName  string  `json:"sale_type_name"`
	 StateName     string  `json:"state_name"`
	 RedLine       float64 `json:"red_line"`
	 CalcDate      string  `json:"calc_date"`
	 PermitPay     float64 `json:"permit_pay"`
	 PermitMax     float64 `json:"permit_max"`
	 InstallPay    float64 `json:"install_pay"`
	 PtoPay        float64 `json:"pto_pay"`
	 StartDate     string  `json:"start_date"`
	 EndDate       string  `json:"end_date"`
 }
 
 type ArSkdCfgStruct struct {
	 ArSkdConfigList []GetArScheduleTemp
 }
 
 var (
	 ArSkdConfig ArSkdCfgStruct
 )
 
 func (ArSkdConfig *ArSkdCfgStruct) LoadArSkdCfg() (err error) {
	 var (
		 data         []map[string]interface{}
		 whereEleList []interface{}
		 query        string
	 )
	 log.EnterFn(0, "LoadArSkdCfg")
	 defer func() { log.ExitFn(0, "LoadArSkdCfg", err) }()
 
	 query = `
	 SELECT ar.id AS record_id, ar.red_line, ar.calc_date, ar.permit_pay, ar.permit_max, ar.install_pay, ar.pto_pay, ar.start_date, ar.end_date, st.name AS state_name, pr_partner.partner_name AS partner_name, pr_installer.partner_name AS installer_name, sy.type_name AS sale_type_name   
	 FROM ar_schedule ar
	 JOIN states st ON st.state_id = ar.state_id
	 JOIN partners pr_partner ON pr_partner.partner_id = ar.partner
	 JOIN partners pr_installer ON pr_installer.partner_id = ar.installer
	 JOIN sale_type sy ON sy.id = ar.sale_type_id`
 
	 data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, whereEleList)
	 if err != nil || len(data) == 0 {
		 return err
	 }
 
	 ArSkdConfig.ArSkdConfigList = ArSkdConfig.ArSkdConfigList[:0]
	 for _, item := range data {
		 arSchedule := GetArScheduleTemp{
			 RecordId:      getInt64(item, "record_id"),
			 PartnerName:   getString(item, "partner_name"),
			 InstallerName: getString(item, "installer_name"),
			 SaleTypeName:  getString(item, "sale_type_name"),
			 StateName:     getString(item, "state_name"),
			 RedLine:       getFloat64(item, "red_line"),
			 CalcDate:      getString(item, "calc_date"),
			 PermitPay:     getFloat64(item, "permit_pay"),
			 PermitMax:     getFloat64(item, "permit_max"),
			 InstallPay:    getFloat64(item, "install_pay"),
			 PtoPay:        getFloat64(item, "pto_pay"),
			 StartDate:     getTimeString(item, "start_date"),
			 EndDate:       getTimeString(item, "end_date"),
		 }
		 ArSkdConfig.ArSkdConfigList = append(ArSkdConfig.ArSkdConfigList, arSchedule)
	 }
 
	 return err
 }
 
 func truncateToDay(t time.Time) time.Time {
	 return t.Truncate(24 * time.Hour)
 }
 
 func (ArSkdConfig *ArSkdCfgStruct) GetArSkdForSaleData(saleData *SaleDataStruct) (redLine float64, permitPayM1 float64, permitMax float64, installPayM2 float64) {
	 log.FuncErrorTrace(0, "uniqueId = %v", saleData.UniqueId)
	 var (
		 err   error
		 today = truncateToDay(time.Now())
	 )
	 log.EnterFn(0, "GetArSkdForSaleData")
	 defer func() { log.ExitFn(0, "GetArSkdForSaleData", err) }()
 
	 st := getStateAbbreviation(saleData.State)
	 if st == "" {
		 return
	 }
 
	 for _, arSkd := range ArSkdConfig.ArSkdConfigList {
		 startDate, endDate, err := parseDates(arSkd.StartDate, arSkd.EndDate)
		 if err != nil {
			 continue
		 }

		 if arSkd.InstallerName == "One World Energy" {
			arSkd.InstallerName = "OWE"
		}
 
		 if matchesInstallCriteria(arSkd, saleData, st, startDate, endDate) {
			 return arSkd.RedLine, arSkd.PermitPay, arSkd.PermitMax, arSkd.InstallPay
		 }
	 }
 
	 for _, arSkd := range ArSkdConfig.ArSkdConfigList {
		 startDate, endDate, err := parseDates(arSkd.StartDate, arSkd.EndDate)
		 if err != nil {
			 continue
		 }

		 if arSkd.InstallerName == "One World Energy" {
			arSkd.InstallerName = "OWE"
		}
 
		 if matchesCreatedCriteria(arSkd, saleData, st, startDate, endDate) {
			 return arSkd.RedLine, arSkd.PermitPay, arSkd.PermitMax, arSkd.InstallPay
		 }
	 }
 
	 for _, arSkd := range ArSkdConfig.ArSkdConfigList {
		 startDate, endDate, err := parseDates(arSkd.StartDate, arSkd.EndDate)
		 if err != nil {
			 continue
		 }

		 if arSkd.InstallerName == "One World Energy" {
			arSkd.InstallerName = "OWE"
		}
 
		 if matchesTodayCriteria(arSkd, saleData, st, startDate, endDate, today) {
			 return arSkd.RedLine, arSkd.PermitPay, arSkd.PermitMax, arSkd.InstallPay
		 }
	 }
 
	 return
 }
 
 func getInt64(item map[string]interface{}, key string) int64 {
	 value, ok := item[key].(int64)
	 if !ok {
		 return 0
	 }
	 return value
 }
 
 func getString(item map[string]interface{}, key string) string {
	 value, ok := item[key].(string)
	 if !ok {
		 return ""
	 }
	 return value
 }
 
 func getFloat64(item map[string]interface{}, key string) float64 {
	 value, ok := item[key].(float64)
	 if !ok {
		 return 0.0
	 }
	 return value
 }
 
 func getTimeString(item map[string]interface{}, key string) string {
	 value, ok := item[key].(time.Time)
	 if !ok {
		 return ""
	 }
	 return value.Format("2006-01-02")
 }
 
 func getStateAbbreviation(state string) string {
	 if len(state) > 6 {
		 return state[6:]
	 }
	 return ""
 }
 
 func parseDates(startDateStr, endDateStr string) (time.Time, time.Time, error) {
	 startDate, err := time.Parse("2006-01-02", startDateStr)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to convert StartDate:%+v to time.Time err: %+v", startDateStr, err)
		 return time.Time{}, time.Time{}, err
	 }
 
	 endDate, err := time.Parse("2006-01-02", endDateStr)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to convert EndDate:%+v to time.Time err: %+v", endDateStr, err)
		 return time.Time{}, time.Time{}, err
	 }
 
	 return startDate, endDate, nil
 }
 
 func matchesInstallCriteria(arSkd GetArScheduleTemp, saleData *SaleDataStruct, st string, startDate, endDate time.Time) bool {
	 return arSkd.PartnerName == saleData.Partner &&
		 arSkd.InstallerName == saleData.Installer &&
		 arSkd.SaleTypeName == saleData.Type &&
		 arSkd.StateName == st &&
		 arSkd.CalcDate == "INSTALL" &&
		 (truncateToDay(startDate).Before(truncateToDay(saleData.PvInstallCompletedDate)) || truncateToDay(startDate).Equal(truncateToDay(saleData.PvInstallCompletedDate))) &&
		 (truncateToDay(endDate).After(truncateToDay(saleData.PvInstallCompletedDate)) || truncateToDay(endDate).Equal(truncateToDay(saleData.PvInstallCompletedDate)))
 }
 
 func matchesCreatedCriteria(arSkd GetArScheduleTemp, saleData *SaleDataStruct, st string, startDate, endDate time.Time) bool {
 
	 return arSkd.PartnerName == saleData.Partner &&
		 arSkd.InstallerName == saleData.Installer &&
		 arSkd.SaleTypeName == saleData.Type &&
		 arSkd.StateName == st &&
		 arSkd.CalcDate == "CREATED" &&
		 (truncateToDay(startDate).Before(truncateToDay(saleData.ContractDate)) || truncateToDay(startDate).Equal(truncateToDay(saleData.ContractDate))) &&
		 (truncateToDay(endDate).After(truncateToDay(saleData.ContractDate)) || truncateToDay(endDate).Equal(truncateToDay(saleData.ContractDate)))
 }
 
 func matchesTodayCriteria(arSkd GetArScheduleTemp, saleData *SaleDataStruct, st string, startDate, endDate, today time.Time) bool {
	 return arSkd.PartnerName == saleData.Partner &&
		 arSkd.InstallerName == saleData.Installer &&
		 arSkd.SaleTypeName == saleData.Type &&
		 arSkd.StateName == st &&
		 arSkd.CalcDate == "INSTALL" &&
		 (truncateToDay(startDate).Before(today) || truncateToDay(startDate).Equal(today)) &&
		 (truncateToDay(endDate).After(today) || truncateToDay(endDate).Equal(today))
 }