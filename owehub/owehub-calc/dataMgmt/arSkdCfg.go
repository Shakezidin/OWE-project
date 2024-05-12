/**************************************************************************
 * File            : arSkdCfg.go
 * DESCRIPTION     : This file contains the model and data form ArSkd
 * DATE            : 05-May-2024
 **************************************************************************/

package datamgmt

import (
	db "OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"OWEApp/shared/models"
	"fmt"
	"time"
)

type ArSkdCfgStruct struct {
	ArSkdConfigList models.GetArScheduleList
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
		log.FuncErrorTrace(0, "Failed to get AR Skd import config from DB err: %v", err)
		err = fmt.Errorf("failed to get ar skd import config err")
		return err
	}

	/* Clean AR Config previous data before updatin new data in list */
	ArSkdConfig.ArSkdConfigList.ArScheduleList = ArSkdConfig.ArSkdConfigList.ArScheduleList[:0]
	for _, item := range data {
		RecordId, ok := item["record_id"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to get record id for Record ID %v. Item: %+v\n", RecordId, item)
			continue
		}

		PartnerName, ok := item["partner_name"].(string)
		if !ok || PartnerName == "" {
			log.FuncErrorTrace(0, "Failed to get partner name for Record ID %v. Item: %+v\n", RecordId, item)
			PartnerName = ""
		}

		InstallerName, ok := item["installer_name"].(string)
		if !ok || InstallerName == "" {
			log.FuncErrorTrace(0, "Failed to get installer name for Record ID %v. Item: %+v\n", RecordId, item)
			InstallerName = ""
		}

		SaleTypeName, ok := item["sale_type_name"].(string)
		if !ok || SaleTypeName == "" {
			log.FuncErrorTrace(0, "Failed to get sale type name for Record ID %v. Item: %+v\n", RecordId, item)
			SaleTypeName = ""
		}

		StateName, ok := item["state_name"].(string)
		if !ok || StateName == "" {
			log.FuncErrorTrace(0, "Failed to get state name for Record ID %v. Item: %+v\n", RecordId, item)
			StateName = ""
		}

		RedLine, ok := item["red_line"].(float64)
		if !ok || RedLine <= 0.0 {
			log.FuncErrorTrace(0, "Failed to get red line for Record ID %v. Item: %+v\n", RecordId, item)
			RedLine = 0.0
		}

		CalcDate, ok := item["calc_date"].(string)
		if !ok || CalcDate == "" {
			log.FuncErrorTrace(0, "Failed to get calc date for Record ID %v. Item: %+v\n", RecordId, item)
			CalcDate = ""
		}

		PermitPay, ok := item["permit_pay"].(float64)
		if !ok || PermitPay <= 0.0 {
			log.FuncErrorTrace(0, "Failed to get permit pay for Record ID %v. Item: %+v\n", RecordId, item)
			PermitPay = 0.0
		}

		PermitMax, ok := item["permit_max"].(float64)
		if !ok || PermitMax <= 0.0 {
			log.FuncErrorTrace(0, "Failed to get permit max for Record ID %v. Item: %+v\n", RecordId, item)
			PermitMax = 0.0
		}

		InstallPay, ok := item["install_pay"].(float64)
		if !ok || InstallPay <= 0.0 {
			log.FuncErrorTrace(0, "Failed to get install pay for Record ID %v. Item: %+v\n", RecordId, item)
			InstallPay = 0.0
		}

		PtoPay, ok := item["pto_pay"].(float64)
		if !ok || PtoPay == 0.0 {
			log.FuncErrorTrace(0, "Failed to get PTO pay for Record ID %v. Item: %+v\n", RecordId, item)
			PtoPay = 0.0
		}

		StartDate, ok := item["start_date"].(string)
		if !ok || StartDate == "" {
			log.FuncErrorTrace(0, "Failed to get start date for Record ID %v. Item: %+v\n", RecordId, item)
			StartDate = ""
		}

		EndDate, ok := item["end_date"].(string)
		if !ok || EndDate == "" {
			log.FuncErrorTrace(0, "Failed to get end date for Record ID %v. Item: %+v\n", RecordId, item)
			EndDate = ""
		}

		arSchedule := models.GetArSchedule{
			RecordId:      RecordId,
			PartnerName:   PartnerName,
			InstallerName: InstallerName,
			SaleTypeName:  SaleTypeName,
			StateName:     StateName,
			RedLine:       RedLine,
			CalcDate:      CalcDate,
			PermitPay:     PermitPay,
			PermitMax:     PermitMax,
			InstallPay:    InstallPay,
			PtoPay:        PtoPay,
			StartDate:     StartDate,
			EndDate:       EndDate,
		}
		ArSkdConfig.ArSkdConfigList.ArScheduleList = append(ArSkdConfig.ArSkdConfigList.ArScheduleList, arSchedule)
	}

	return err
}

func (ArSkdConfig *ArSkdCfgStruct) GetArSkdForSaleData(saleData *SaleDataStruct) (redLine float64, permitPayM1 float64, permitMax float64, installPayM2 float64) {
	var (
		err   error
		today = time.Now().Truncate(24 * time.Hour)
	)
	log.EnterFn(0, "GetRedLineForSaleData")
	defer func() { log.ExitFn(0, "GetRedLineForSaleData", err) }()

	redLine = 0
	permitPayM1 = 0
	permitMax = 0
	installPayM2 = 0
	for _, arSkd := range ArSkdConfig.ArSkdConfigList.ArScheduleList {
		var startDate time.Time
		var endDate time.Time

		//01-02-06 : MM-DD-YY
		if len(arSkd.StartDate) > 0 {
			startDate, err = time.Parse("01-02-06", arSkd.StartDate)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to convert arSkd.StartDate:%+v to time.Time err: %+v", arSkd.StartDate, err)
			}
		} else {
			log.FuncWarnTrace(0, "Empty StartDate Received in arSkd config")
			continue
		}

		//01-02-06 : MM-DD-YY
		if len(arSkd.EndDate) > 0 {
			endDate, err = time.Parse("01-02-06", arSkd.EndDate)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to convert arSkd.EndDate:%+v to time.Time err: %+v", arSkd.EndDate, err)
				continue
			}
		} else {
			log.FuncWarnTrace(0, "Empty EndDate Received in arSkd config")
			continue
		}

		if arSkd.PartnerName == saleData.Partner &&
			arSkd.InstallerName == saleData.Installer &&
			//TODO: Need to check arSkd.SaleTypeName == ""
			arSkd.StateName == saleData.State &&
			arSkd.CalcDate == "INSTALL" &&
			(startDate.Before(saleData.PvInstallCompletedDate) || startDate.Equal(saleData.PvInstallCompletedDate)) &&
			(endDate.After(saleData.PvInstallCompletedDate) || endDate.Equal(saleData.PvInstallCompletedDate)) {

			redLine = arSkd.RedLine
			permitPayM1 = arSkd.PermitPay
			permitMax = arSkd.PermitMax
			installPayM2 = arSkd.InstallPay
			return redLine, permitPayM1, permitMax, installPayM2
		}
	}

	if redLine <= 0 {
		for _, arSkd := range ArSkdConfig.ArSkdConfigList.ArScheduleList {
			/*var startDate time.Time
			var endDate time.Time

			//01-02-06 : MM-DD-YY
			if len(arSkd.StartDate) > 0 {
				startDate, err = time.Parse("01-02-06", arSkd.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert arSkd.StartDate:%+v to time.Time err: %+v", arSkd.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in arSkd config")
				continue
			}

			//01-02-06 : MM-DD-YY
			if len(arSkd.EndDate) > 0 {
				endDate, err = time.Parse("01-02-06", arSkd.EndDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert arSkd.EndDate:%+v to time.Time err: %+v", arSkd.EndDate, err)
					continue
				}
			} else {
				log.FuncWarnTrace(0, "Empty EndDate Received in arSkd config")
				continue
			}*/

			if arSkd.PartnerName == saleData.Partner &&
				arSkd.InstallerName == saleData.Installer &&
				//TODO: Need to check arSkd.SaleTypeName == "" &&
				arSkd.StateName == saleData.State &&
				arSkd.CalcDate == "CREATED" {
				/*(startDate.Before(saleData.PvInstallCompletedDate) || startDate.Equal(saleData.PvInstallCompletedDate)) &&
				(endDate.After(saleData.PvInstallCompletedDate) || endDate.Equal(saleData.PvInstallCompletedDate)) { */

				redLine = arSkd.RedLine
				permitPayM1 = arSkd.PermitPay
				permitMax = arSkd.PermitMax
				installPayM2 = arSkd.InstallPay
				return redLine, permitPayM1, permitMax, installPayM2
			}
		}
	}

	if redLine <= 0 {
		for _, arSkd := range ArSkdConfig.ArSkdConfigList.ArScheduleList {
			var startDate time.Time
			var endDate time.Time

			//01-02-06 : MM-DD-YY
			if len(arSkd.StartDate) > 0 {
				startDate, err = time.Parse("01-02-06", arSkd.StartDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert arSkd.StartDate:%+v to time.Time err: %+v", arSkd.StartDate, err)
				}
			} else {
				log.FuncWarnTrace(0, "Empty StartDate Received in arSkd config")
				continue
			}

			//01-02-06 : MM-DD-YY
			if len(arSkd.EndDate) > 0 {
				endDate, err = time.Parse("01-02-06", arSkd.EndDate)
				if err != nil {
					log.FuncErrorTrace(0, "Failed to convert arSkd.EndDate:%+v to time.Time err: %+v", arSkd.EndDate, err)
					continue
				}
			} else {
				log.FuncWarnTrace(0, "Empty EndDate Received in arSkd config")
				continue
			}

			if arSkd.PartnerName == saleData.Partner &&
				arSkd.InstallerName == saleData.Installer &&
				//TODO: Need to check arSkd.SaleTypeName == ""
				arSkd.StateName == saleData.State &&
				arSkd.CalcDate == "INSTALL" &&
				(startDate.Before(today) || startDate.Equal(today)) &&
				(endDate.After(today) || endDate.Equal(today)) {

				redLine = arSkd.RedLine
				permitPayM1 = arSkd.PermitPay
				permitMax = arSkd.PermitMax
				installPayM2 = arSkd.InstallPay
				return redLine, permitPayM1, permitMax, installPayM2
			}
		}
	}

	return redLine, permitPayM1, permitMax, installPayM2
}
