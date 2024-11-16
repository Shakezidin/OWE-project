/**************************************************************************
* File			: apiGetLeadsCountByStatus.go
* DESCRIPTION	: This file contains functions for getting leads count by status
* DATE			: 19-sept-2024
**************************************************************************/
package services

import (
	"OWEApp/shared/appserver"
	"OWEApp/shared/db"
	log "OWEApp/shared/logger"
	models "OWEApp/shared/models"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:		HandleGetPeriodicWonLostLeadsRequest
 * DESCRIPTION:     handler for getting periodic won lost
 * INPUT:			resp, req
 * RETURNS:    		void
 ******************************************************************************/
func HandleGetPeriodicWonLostLeadsRequest(resp http.ResponseWriter, req *http.Request) {

	var (
		err                    error
		reqBody                []byte
		dataReq                models.GetPeriodicWonLostLeadsRequest
		apiResponse            models.GetPeriodicWonLostLeadsList
		periodicLabelsAndDates [][]string
		query                  string
		data                   []map[string]interface{}
	)

	log.EnterFn(0, "HandleGetPeriodicWonLost")
	defer func() { log.ExitFn(0, "HandleGetPeriodicWonLost", err) }()

	reqBody, err = ioutil.ReadAll(req.Body)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to read HTTP Request body from get periodic won lost data req err:  %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to read HTTP Request body", http.StatusBadRequest, nil)
		return
	}

	err = json.Unmarshal(reqBody, &dataReq)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal get periodic won lost request body err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to unmarshal get periodic won lost request body", http.StatusBadRequest, nil)
		return
	}

	periodicLabelsAndDates, err = getPeriodicLabelsAndDates(dataReq.StartDate, dataReq.EndDate)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get periodic labels and dates err: %v", err)
		appserver.FormAndSendHttpResp(resp, err.Error(), http.StatusBadRequest, nil)
		return
	}

	periodicValues := ""
	for i, item := range periodicLabelsAndDates {
		if i != 0 {
			periodicValues += ", "
		}
		periodicValues += fmt.Sprintf("(%d, '%s'::timestamptz, '%s'::timestamptz)", i, item[1], item[2])
	}
	query = fmt.Sprintf(`
		WITH periodic_values(period_index, start_date, end_date) AS (
			VALUES %s
		)
		SELECT
			periodic_values.period_index,
			SUM((li.lead_won_date IS NOT NULL)::int) AS won_count,
			SUM((li.lead_lost_date IS NOT NULL)::int) AS lost_count
		FROM get_leads_info_hierarchy($1) li
		RIGHT JOIN periodic_values 
			ON li.updated_at BETWEEN periodic_values.start_date AND periodic_values.end_date
			AND li.is_archived = false
		GROUP BY periodic_values.period_index
		ORDER BY periodic_values.period_index
		`,
		periodicValues)
	authenticatedEmail := req.Context().Value("emailid").(string)
	data, err = db.ReteriveFromDB(db.OweHubDbIndex, query, []interface{}{authenticatedEmail})
	if err != nil {
		log.FuncErrorTrace(0, "Failed to get periodic won lost data from DB err: %v", err)
		appserver.FormAndSendHttpResp(resp, "Failed to get periodic won lost data", http.StatusInternalServerError, nil)
		return
	}

	for _, item := range data {
		wonCount, ok := item["won_count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert won count Item: %+v\n", item)
			wonCount = 0
		}
		lostCount, ok := item["lost_count"].(int64)
		if !ok {
			log.FuncErrorTrace(0, "Failed to assert lost count Item: %+v\n", item)
			lostCount = 0
		}
		label := periodicLabelsAndDates[item["period_index"].(int64)][0]
		apiResponse.PeriodicList = append(apiResponse.PeriodicList, models.GetPeriodicWonLostLeads{
			PeriodLabel: label,
			WonCount:    wonCount,
			LostCount:   lostCount,
		})
	}

	log.FuncDebugTrace(0, "Retrieved periodic won lost: %v", apiResponse.PeriodicList)
	appserver.FormAndSendHttpResp(resp, "Get periodic won lost", http.StatusOK, apiResponse, int64(len(apiResponse.PeriodicList)))
}

/******************************************************************************
* FUNCTION:		    getPeriodicLabelsAndDates
* DESCRIPTION:      get periodic labels and dates like this: [period_label, start_date, end_date][]
* INPUT:			startDateStr, endDateStr
* RETURNS:    		periodicLabelsAndDates
******************************************************************************/
func getPeriodicLabelsAndDates(startDateStr, endDateStr string) (periodicLabelsAndDates [][]string, err error) {
	start, err := time.Parse("02-01-2006", startDateStr)
	if err != nil {
		return nil, fmt.Errorf("Invalid date format for start date")
	}
	end, err := time.Parse("02-01-2006", endDateStr)
	if err != nil {
		return nil, fmt.Errorf("Invalid date format for end date")
	}

	daysInBetween := int(end.Sub(start).Hours() / 24)
	if daysInBetween < 0 {
		return nil, fmt.Errorf("Start date %s is after end date %s", startDateStr, endDateStr)
	}

	// CASE 1: daysInBetween < 1 (same day)
	if daysInBetween < 1 {
		periodicLabelsAndDates = [][]string{
			{
				start.Format("02-01-2006"),
				start.Format(time.DateOnly) + " 00:00:00",
				start.Format(time.DateOnly) + " 23:59:59",
			},
		}
		return
	}

	// CASE 2: daysInBetween < 10 (weekdays)
	if daysInBetween <= 10 {
		for t := start; t.Before(end); t = t.AddDate(0, 0, 1) {
			periodicLabelsAndDates = append(periodicLabelsAndDates, []string{
				t.Weekday().String(),
				t.Format(time.DateOnly) + " 00:00:00",
				t.Format(time.DateOnly) + " 23:59:59",
			})
		}
		return periodicLabelsAndDates, nil
	}

	// CASE 3: daysInBetween in between 10 and 120
	if daysInBetween <= 120 {
		var (
			groupSize   int
			groupCount  int
			labelFormat string
		)
		if daysInBetween <= 21 {
			groupSize = 3
			groupCount = daysInBetween / groupSize
			labelFormat = "Jan 2"
		} else {
			groupSize = 7
			groupCount = daysInBetween / groupSize
			labelFormat = "02-01-2006"
		}
		for i := 0; i < groupCount; i++ {
			groupStartDate := start.AddDate(0, 0, i*groupSize)
			groupEndDate := start.AddDate(0, 0, i*groupSize+groupSize)
			periodicLabelsAndDates = append(periodicLabelsAndDates, []string{
				fmt.Sprintf("%s - %s", groupStartDate.Format(labelFormat), groupEndDate.Format(labelFormat)),
				groupStartDate.Format(time.DateOnly) + " 00:00:00",
				groupEndDate.Add(-24*time.Hour).Format(time.DateOnly) + " 23:59:59",
			})
		}

		// handle residual
		residual := daysInBetween % groupSize
		if residual == 1 {
			periodicLabelsAndDates[groupCount-1][0] = fmt.Sprintf(
				"%s - %s",
				start.AddDate(0, 0, (groupCount-1)*groupSize).Format(labelFormat),
				end.Format(labelFormat),
			)
			periodicLabelsAndDates[groupCount-1][2] = end.Add(-24*time.Hour).Format(time.DateOnly) + " 23:59:59"
		} else {
			residualStartDate := start.AddDate(0, 0, groupCount*groupSize)
			periodicLabelsAndDates = append(periodicLabelsAndDates, []string{
				fmt.Sprintf("%s - %s", residualStartDate.Format(labelFormat), end.Format(labelFormat)),
				residualStartDate.Format(time.DateOnly) + " 00:00:00",
				end.Add(-24*time.Hour).Format(time.DateOnly) + " 23:59:59",
			})
		}
		return periodicLabelsAndDates, nil
	}

	// CASE 4: daysInBetween in between 120 and 390 (months)
	if daysInBetween <= 380 {
		t := start
		for {
			shouldBreak := false
			periodEndDate := time.Date(t.Year(), t.Month()+1, 1, 0, 0, 0, 0, time.UTC)
			if periodEndDate.After(end) {
				periodEndDate = end
				shouldBreak = true
			}
			periodicLabelsAndDates = append(periodicLabelsAndDates, []string{
				t.Format("Jan"),
				t.Format(time.DateOnly) + " 00:00:00",
				periodEndDate.Add(-24*time.Hour).Format(time.DateOnly) + " 23:59:59",
			})
			t = periodEndDate
			if shouldBreak {
				break
			}
		}
		return periodicLabelsAndDates, nil
	}

	// CASE 5: daysInBetween above 750 (allow maximum 7 groups and calculate month groups)
	var monthCount float64 = float64(daysInBetween) / 30.4375
	groupCount := 7
	groupSize := int(math.Ceil(monthCount / float64(groupCount)))

	t := start
	for {
		shouldBreak := false
		periodEndDate := time.Date(t.Year(), t.Month()+time.Month(groupSize), 1, 0, 0, 0, 0, time.UTC)
		if periodEndDate.After(end) {
			periodEndDate = end
			shouldBreak = true
		}
		periodicLabelsAndDates = append(periodicLabelsAndDates, []string{
			fmt.Sprintf("%s - %s", t.Format("Jan 2006"), periodEndDate.Format("Jan 2006")),
			t.Format(time.DateOnly) + " 00:00:00",
			periodEndDate.Add(-24*time.Hour).Format(time.DateOnly) + " 23:59:59",
		})
		t = periodEndDate
		if shouldBreak {
			break
		}
	}
	return periodicLabelsAndDates, nil
}
