/**************************************************************************
* File            : loadInstallEtaSchemas.go
* DESCRIPTION     : This file contains the code to call the function to
										calulcate the install eta value
* DATE            : 17-Oct-2024
**************************************************************************/

package services

import (
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	"strconv"
	"time"
)

func ExecInstalEtaInitialCalculation(uniqueIds string, hookType string) error {
	var (
		err                error
		installEtaDataList []map[string]interface{}
		InitailData        InitialDataLists
	)
	log.EnterFn(0, "ExecDlrPayInitialCalculation")
	defer func() { log.ExitFn(0, "ExecDlrPayInitialCalculation", err) }()

	count := 0
	var idList []string
	if uniqueIds != "" {
		idList = []string{uniqueIds}
	} else {
		idList = []string{}
	}

	InitailData, err = LoadInstallEtaInitialData(idList)
	if err != nil {
		log.FuncErrorTrace(0, "error while loading initial data %v in ExecDlrPayInitialCalculation", err)
		return err
	}

	for _, data := range InitailData.InitialDataList {
		var installEtaData map[string]interface{}

		//* uncomment when function is done
		installEtaData, err := CalculateInstallPto(data)
		if err != nil {
			log.FuncInfoTrace(0, "error calculating value for uid: %v", data.UniqueId)
			continue
		}

		if hookType == "update" {
			query, _ := buildUpdateQuery("install_pto_schema", installEtaData, "unique_id", data.UniqueId)

			err = db.ExecQueryDB(db.OweHubDbIndex, query)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to update DLR Pay Data for unique id: %+v err: %+v", data.UniqueId, err)
			}
		} else {
			installEtaDataList = append(installEtaDataList, installEtaData)
		}

		if (count+1)%1000 == 0 && len(installEtaDataList) > 0 {
			err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", installEtaDataList)
			if err != nil {
				log.FuncErrorTrace(0, "Failed to insert initial install eta Data in DB err: %v", err)
			}
			installEtaDataList = nil
		}
		count++
	}

	err = db.AddMultipleRecordInDB(db.OweHubDbIndex, "install_pto_schema", installEtaDataList)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to insert initial Install ETA Data in DB err: %v", err)
	}

	return err
}

func CalculateInstallPto(data InitialStruct) (outData map[string]interface{}, err error) {
	outData = make(map[string]interface{})
	var installEto time.Time
	outData["unique_id"] = data.UniqueId

	if !data.PvInstallInstallSubcontractingSchemaInstallFixCompletedDate.IsZero() { //24
		log.FuncInfoTrace(0, "LEVEL === 24")
		installEto = data.PvInstallInstallSubcontractingSchemaInstallFixCompletedDate
	} else if !data.PvInstallInstallSubcontractingSchemaInstallFixScheduleDate.IsZero() { //23
		log.FuncInfoTrace(0, "LEVEL === 23")
		installEto = data.PvInstallInstallSubcontractingSchemaInstallFixScheduleDate
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending Roof" && !data.RoofingRequestInstallSubcontractingSchemaWorkScheduledDate.IsZero() { //22
		log.FuncInfoTrace(0, "LEVEL === 22")
		installEto = data.RoofingRequestInstallSubcontractingSchemaWorkScheduledDate.AddDate(0, 0, 20)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending Roof" && data.RoofingRequestInstallSubcontractingSchemaWorkScheduledDate.IsZero() { //21
		log.FuncInfoTrace(0, "LEVEL === 21")
		installEto = data.PvInstallInstallSubcontractingSchemaItemCreatedOn.AddDate(0, 0, 60)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending HOA" { //20
		log.FuncInfoTrace(0, "LEVEL === 20")
		installEto = data.PvInstallInstallSubcontractingSchemaItemCreatedOn.AddDate(0, 0, 30)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending AHJ" && !data.PermitFinPvPermitsSchemaAbExpectedApprovalDate.IsZero() { //19(a)
		log.FuncInfoTrace(0, "LEVEL === 19")
		installEto = data.PermitFinPvPermitsSchemaAbExpectedApprovalDate.AddDate(0, 0, 7)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending AHJ" && data.PermitFinPvPermitsSchemaAbExpectedApprovalDate.IsZero() { //19(b)
		log.FuncInfoTrace(0, "LEVEL === 18")
		PermitFinPvPermitsSchemaPermitTurnaroundTime, err := strconv.Atoi(data.PermitFinPvPermitsSchemaPermitTurnaroundTime)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PermitFinPvPermitsSchemaPermitTurnaroundTime to int")
			PermitFinPvPermitsSchemaPermitTurnaroundTime = 0
		}
		installEto = data.PvInstallInstallSubcontractingSchemaItemCreatedOn.AddDate(0, 0, 7+PermitFinPvPermitsSchemaPermitTurnaroundTime)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending Scheduling" { //18
		log.FuncInfoTrace(0, "LEVEL === 17")
		installEto = data.PvInstallInstallSubcontractingSchemaPvSchedulingReadyDate.AddDate(0, 0, 5)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending Scheduling - Design Updated" { //17
		log.FuncInfoTrace(0, "LEVEL === 16")
		installEto = data.PvInstallInstallSubcontractingSchemaItemCreatedOn.AddDate(0, 0, 1)
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() && (data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending Change Order" || data.PvInstallInstallSubcontractingSchemaAppStatus == "Pending NCA Review") { //16
		log.FuncInfoTrace(0, "LEVEL === 15")
		installEto = data.PvInstallInstallSubcontractingSchemaItemCreatedOn.AddDate(0, 0, 11)
		// }else if !data.pvInstallInstallSubcontractingSchemaInstallCreated.IsZero() && data.pvInstallInstallSubcontractingSchemaAppStatus == "App Status" { //15 not need to for now as per client reply
		//  outData["unique_id"] = data.uniqueId
		//  installEto = data.pvInstallInstallSubcontractingSchemaInstallCreated.AddDate(0, 0, 11)
		//  return outData, nil
		// }
	} else if !data.PvInstallInstallSubcontractingSchemaItemCreatedOn.IsZero() { //14
		log.FuncInfoTrace(0, "LEVEL === 14")
		var latestInstallEto time.Time
		if data.ICICPtoSchemaIcApprovedDate.After(data.PermitFinPvPermitsSchemaPvApproved) {
			latestInstallEto = data.ICICPtoSchemaIcApprovedDate
		} else {
			latestInstallEto = data.PermitFinPvPermitsSchemaPvApproved
		}
		installEto = latestInstallEto.AddDate(0, 0, 20)
	} else if !data.PermitFinPvPermitsSchemaPvApproved.IsZero() && !data.ICICPtoSchemaIcEstimatedApprovalDate.IsZero() { //13
		log.FuncInfoTrace(0, "LEVEL === 13")
		installEto = data.ICICPtoSchemaIcEstimatedApprovalDate.AddDate(0, 0, 20)
	} else if !data.PermitFinPvPermitsSchemaPvApproved.IsZero() && data.ICICPtoSchemaAppStatus == "Pending IC Docs" { //12
		ICICPtoSchemaUtilityTurnaroundTime, err := strconv.Atoi(data.ICICPtoSchemaUtilityTurnaroundTime)
		log.FuncInfoTrace(0, "LEVEL === 12")
		if err != nil {
			ICICPtoSchemaUtilityTurnaroundTime = 0
		}
		installEto = data.PermitFinPvPermitsSchemaPvApproved.AddDate(0, 0, 30+ICICPtoSchemaUtilityTurnaroundTime)
	} else if !data.PermitFinPvPermitsSchemaPvApproved.IsZero() && data.ICICPtoSchemaAppStatus == "Pending Powerclerk" { //11
		log.FuncInfoTrace(0, "LEVEL === 11")
		ICICPtoSchemaUtilityTurnaroundTime, err := strconv.Atoi(data.ICICPtoSchemaUtilityTurnaroundTime)
		if err != nil {
			ICICPtoSchemaUtilityTurnaroundTime = 0
		}
		AhjDbDbhubSchemaAhjTimeline, err := strconv.Atoi(data.AhjDbDbhubSchemaAhjTimeline)
		if err != nil {
			AhjDbDbhubSchemaAhjTimeline = 0
		}
		installEto = data.PermitFinPvPermitsSchemaItemCreatedOn.AddDate(0, 0, 20+AhjDbDbhubSchemaAhjTimeline+ICICPtoSchemaUtilityTurnaroundTime)
	} else if !data.PermitFinPvPermitsSchemaPvExpectedApprovalDate.IsZero() && data.PermitFinPvPermitsSchemaPvApproved.IsZero() { //10
		log.FuncInfoTrace(0, "LEVEL === 10")
		installEto = data.PermitFinPvPermitsSchemaPvExpectedApprovalDate.AddDate(0, 0, 20)
	} else if !data.PermitFinPvPermitsSchemaPvResubmitted.IsZero() { //9
		log.FuncInfoTrace(0, "LEVEL === 09")
		PermitFinPvPermitsSchemaPermitTurnaroundTime, err := strconv.Atoi(data.PermitFinPvPermitsSchemaPermitTurnaroundTime)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PermitFinPvPermitsSchemaPermitTurnaroundTime to int")
			PermitFinPvPermitsSchemaPermitTurnaroundTime = 0
		}
		installEto = data.PermitFinPvPermitsSchemaPvResubmitted.AddDate(0, 0, 20+PermitFinPvPermitsSchemaPermitTurnaroundTime)
	} else if !data.PermitFinPvPermitsSchemaPvRedlinedDate.IsZero() && data.PermitFinPvPermitsSchemaSolarAppSubmission == "YES" { //8
		log.FuncInfoTrace(0, "LEVEL === 08")
		installEto = data.PermitFinPvPermitsSchemaPvRedlinedDate.AddDate(0, 0, 23)
	} else if !data.PermitFinPvPermitsSchemaPvRedlinedDate.IsZero() { //7
		log.FuncInfoTrace(0, "LEVEL === 07")
		PermitFinPvPermitsSchemaPermitTurnaroundTime, err := strconv.Atoi(data.PermitFinPvPermitsSchemaPermitTurnaroundTime)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PermitFinPvPermitsSchemaPermitTurnaroundTime to int")
			PermitFinPvPermitsSchemaPermitTurnaroundTime = 0
		}
		installEto = data.PermitFinPvPermitsSchemaPvRedlinedDate.AddDate(0, 0, 23+PermitFinPvPermitsSchemaPermitTurnaroundTime)
	} else if !data.PermitFinPvPermitsSchemaPvSubmitted.IsZero() { //6
		log.FuncInfoTrace(0, "LEVEL === 06")
		PermitFinPvPermitsSchemaPermitTurnaroundTime, err := strconv.Atoi(data.PermitFinPvPermitsSchemaPermitTurnaroundTime)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PermitFinPvPermitsSchemaPermitTurnaroundTime to int")
			PermitFinPvPermitsSchemaPermitTurnaroundTime = 0
		}
		installEto = data.PermitFinPvPermitsSchemaPvSubmitted.AddDate(0, 0, 20+PermitFinPvPermitsSchemaPermitTurnaroundTime)
	} else if !data.PermitFinPvPermitsSchemaItemCreatedOn.IsZero() && data.PermitFinPvPermitsSchemaAppStatus == "Pending IC Status" && !data.PermitFinPvPermitsSchemaPvSubmitted.IsZero() { //5
		log.FuncInfoTrace(0, "LEVEL === 05")
		ICICPtoSchemaUtilityTurnaroundTime, err := strconv.Atoi(data.ICICPtoSchemaUtilityTurnaroundTime)
		if err != nil {
			ICICPtoSchemaUtilityTurnaroundTime = 0
		}
		AhjDbDbhubSchemaAhjTimeline, err := strconv.Atoi(data.AhjDbDbhubSchemaAhjTimeline)
		if err != nil {
			AhjDbDbhubSchemaAhjTimeline = 0
		}
		installEto = data.PermitFinPvPermitsSchemaPvSubmitted.AddDate(0, 0, 20+ICICPtoSchemaUtilityTurnaroundTime+AhjDbDbhubSchemaAhjTimeline)
	} else if !data.PermitFinPvPermitsSchemaItemCreatedOn.IsZero() && data.PermitFinPvPermitsSchemaSolarAppSubmission == "YES" { //4
		log.FuncInfoTrace(0, "LEVEL === 04")
		installEto = data.PermitFinPvPermitsSchemaItemCreatedOn.AddDate(0, 0, 20)
	} else if !data.PermitFinPvPermitsSchemaItemCreatedOn.IsZero() { //3
		log.FuncInfoTrace(0, "LEVEL === 03")
		PermitFinPvPermitsSchemaPermitTurnaroundTime, err := strconv.Atoi(data.PermitFinPvPermitsSchemaPermitTurnaroundTime)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing PermitFinPvPermitsSchemaPermitTurnaroundTime to int")
			PermitFinPvPermitsSchemaPermitTurnaroundTime = 0
		}
		installEto = data.PermitFinPvPermitsSchemaItemCreatedOn.AddDate(0, 0, 21+PermitFinPvPermitsSchemaPermitTurnaroundTime)
	} else if !data.SurveySurveySchemaSurveyCompletionDate.IsZero() { //2
		log.FuncInfoTrace(0, "LEVEL === 02")
		AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall, err := strconv.Atoi(data.AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall to int")
			AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall = 0
		}
		installEto = data.CustomersCustomersSchemaSaleDate.AddDate(0, 0, AhjDbDbhubSchemaAverageTimeToInstallSurveyToSolarInstall)
	} else if !data.CustomersCustomersSchemaItemCreatedOn.IsZero() { //1
		log.FuncInfoTrace(0, "LEVEL === 01")
		AhjDbDbhubSchemaAverageTimeToPvInstall, err := strconv.Atoi(data.AhjDbDbhubSchemaAverageTimeToPvInstall)
		if err != nil {
			log.FuncErrorTrace(0, "error while parsing AhjDbDbhubSchemaAverageTimeToPvInstall to int")
			AhjDbDbhubSchemaAverageTimeToPvInstall = 0
		}
		installEto = data.CustomersCustomersSchemaItemCreatedOn.AddDate(0, 0, AhjDbDbhubSchemaAverageTimeToPvInstall)
	}

	if !data.DerateCreatedOn.IsZero() && data.DerateCompletionDate.IsZero() {
		installEto = data.DerateCreatedOn
	}

	today := time.Now()
	twentyOneDaysFromToday := today.Add(21 * 24 * time.Hour)

	if !installEto.IsZero() {
		if (installEto.Before(today) && len(data.PvInstallInstallSubcontractingSchemaTimeStampScheduled) <= 0) || (installEto.After(today) && installEto.Before(twentyOneDaysFromToday)) {
			installEto = twentyOneDaysFromToday
		}
	}

	outData["install_eta"] = installEto
	return outData, nil
}
