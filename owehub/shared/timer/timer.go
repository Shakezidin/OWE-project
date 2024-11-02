/**************************************************************************
 *      File            : timer.go
 *      DESCRIPTION     : This file contains functions to handle
 *                        timer related service
 *      DATE            : 11-Jan-2024
 **************************************************************************/

package timerHandler

import (
	"fmt"
	"sync"
	"time"

	log "OWEApp/shared/logger"
)

/* Initialize Operator id in main()
// initialize operator identifier
common.InitOperatorIdentifier()
*/

type TimerState int

var TimerIdCount int

var FreeTimerIdQ = make([]int, 0)

//TimerIdCount = 0;

const (
	Uninitialized = iota
	Started
	Expired
	Stopped
)

type DbTimerData struct {
	DataContext    interface{}
	Recurring      bool
	TimerDuration  int32
	TimerType      int32
	timer          *time.Timer
	timerState     TimerState
	timerStateLock sync.Mutex
	funcHandler    TimerFuncHandler
	timerId        int
}

/* This map will be per tenant ID*/
type tenantDbMapData struct {
	TENANTID string
	//This map will hold all the running timer of a TENANT ID
	timerDbMap map[int]*DbTimerData
}

type data struct {
	timer          *time.Timer
	timerState     TimerState
	clientKey      uint64
	timerStateLock sync.Mutex
}

// Global variables declaration
var (
	maplock           sync.Mutex
	timerIDLock       sync.Mutex
	gInfoMap          = make(map[string]*data) // gInfoMap
	StopResetTarget   string
	PodName           string
	timerMapLock      sync.Mutex
	timerMapPerTenant = make(map[string]*tenantDbMapData)
)

/******************************************************************************
 * FUNCTION:        addFreeTimerId
 *
 * DESCRIPTION:     This function will be used to add free timerId in queue
 *
 * INPUT:           queue    : FreeTimerIdQ
 *                  timerId  : timerId to add
 *
 * RETURNS:         updated queue
 ******************************************************************************/
func addFreeTimerId(queue []int, timerId int) []int {
	queue = append(queue, timerId)
	//fmt.Println("Enqueued:", timerId)
	return queue
}

/******************************************************************************
 * FUNCTION:        dequeueTimerId
 *
 * DESCRIPTION:     This function will be used to dequeue free timer id from
 *                  FreeTimerIdQ
 *
 * INPUT:           queue   : FreeTimerIdQ
 *
 * RETURNS:         timerId, updated Q
 ******************************************************************************/
func dequeueTimerId(queue []int) (int, []int) {
	timerId := queue[0]
	if len(queue) == 1 {
		var tmp = []int{}
		return timerId, tmp

	}

	return timerId, queue[1:]
}

/******************************************************************************
 * FUNCTION:        checkAndInsertTenantMapEntry
 *
 * DESCRIPTION:     This function will be used to insert timer entry in map after
 *                  verifying tenant and timer entry in timerMapPerTenant and
 *                  timerDbMap respectively.
 *
 * INPUT:           tenantId    : TENANAT ID
 *                  dbTimerdata : timer data
 *
 * RETURNS:         VOID
 ******************************************************************************/
func checkAndInsertTenantMapEntry(tenantId string, dbTimerdata *DbTimerData) {
	log.EnterFn(0, "checkAndInsertTenantMapEntry")
	defer func() {
		log.ExitFn(0, "checkAndInsertTenantMapEntry", nil)
	}()
	timerMapLock.Lock()
	_, isTenantPres := timerMapPerTenant[tenantId]
	if isTenantPres {
		tenantDbData := timerMapPerTenant[tenantId]
		_, isTimerPres := tenantDbData.timerDbMap[dbTimerdata.timerId]
		if isTimerPres {
		} else {
			tenantDbData.timerDbMap[dbTimerdata.timerId] = dbTimerdata
		}
	} else {
		var tMapData = new(tenantDbMapData)
		tMapData.TENANTID = tenantId
		tMapData.timerDbMap = make(map[int]*DbTimerData)
		tMapData.timerDbMap[dbTimerdata.timerId] = dbTimerdata
		timerMapPerTenant[tenantId] = tMapData
		log.FuncInfoTrace("inserting timer datamap: %v", tenantId)
	}
	timerMapLock.Unlock()
}

/**********************************************************************************
 * FUNCTION:        stopAndDeleteTenantMapEntry
 *
 * DESCRIPTION:     This function will be used to stop timer and delete timer entry
 *                  from timerDbMap.
 *
 * INPUT:           tenantId    : TENANAT ID
 *                  timerId     : timer id returned by start timer
 *
 * RETURNS:         VOID
 **********************************************************************************/
func stopAndDeleteTenantMapEntry(tenantId string, timerId int) {
	log.EnterFn(0, "stopAndDeleteTenantMapEntry")
	defer func() { log.ExitFn(0, "stopAndDeleteTenantMapEntry", nil) }()
	timerMapLock.Lock()
	//defer timerMapLock.Unlock()
	_, isTenantPres := timerMapPerTenant[tenantId]
	if isTenantPres {
		tenantDbData := timerMapPerTenant[tenantId]
		_, isTimerPres := tenantDbData.timerDbMap[timerId]
		if isTimerPres {
			entry := tenantDbData.timerDbMap[timerId]
			entry.timerStateLock.Lock()
			if entry.timerState == Started {
				entry.timer.Stop()
			} else if entry.timerState == Expired {
			}
			entry.timerState = Stopped
			entry.timerStateLock.Unlock()
			delete(tenantDbData.timerDbMap, timerId)
		} else {
			log.FuncErrorTrace("timer Id not present: %v, %p", fmt.Sprintf("%v", timerId), &timerId)
		}

	} else {
		log.FuncErrorTrace("Tenant Id not present: %v", tenantId)
	}
	timerMapLock.Unlock()
}

/**********************************************************************************
 * FUNCTION:        deleteTenantMapEntry
 *
 * DESCRIPTION:     This function will be used to delete timer entry from timerDbMap.
 *
 * INPUT:           tenantId    : TENANAT ID
 *                  timerId     : timer id returned by start timer
 *
 * RETURNS:         VOID
 **********************************************************************************/
func deleteTenantMapEntry(tenantId string, timerId int) {
	log.EnterFn(0, "deleteTenantMapEntry")
	defer func() { log.ExitFn(0, "deleteTenantMapEntry", nil) }()
	timerMapLock.Lock()
	//defer timerMapLock.Unlock()
	_, isTenantPres := timerMapPerTenant[tenantId]
	if isTenantPres {
		tenantDbData := timerMapPerTenant[tenantId]
		_, isTimerPres := tenantDbData.timerDbMap[timerId]
		if isTimerPres {
			delete(tenantDbData.timerDbMap, timerId)
		} else {
			log.FuncErrorTrace("Timer Id not present: %v, %p", fmt.Sprintf("%v", timerId), &timerId)
		}

	} else {
		log.FuncErrorTrace("Tenant Id not present: %v", tenantId)
	}
	timerMapLock.Unlock()
}

/**********************************************************************************
 * FUNCTION:        getTenantMapEntry
 *
 * DESCRIPTION:     This function will be used to get timer entry from timerDbMap.
 *
 * INPUT:           tenantId    : TENANAT ID
 *                  timerId     : timer id returned by start timer
 *
 * RETURNS:         DbTimerData : Timer Entry
 **********************************************************************************/
func getTenantMapEntry(tenantId string, timerId int) *DbTimerData {
	log.EnterFn(0, "getTenantMapEntry")
	defer func() { log.ExitFn(0, "getTenantMapEntry", nil) }()
	timerMapLock.Lock()
	//defer timerMapLock.Unlock()
	_, isTenantPres := timerMapPerTenant[tenantId]
	if isTenantPres {
		tenantDbData := timerMapPerTenant[tenantId]

		data, isTimerPres := tenantDbData.timerDbMap[timerId]
		if isTimerPres {
			timerMapLock.Unlock()
			return data
		} else {
			log.FuncErrorTrace("Timer Id not present: %v", fmt.Sprintf("%v", timerId))
		}

	} else {
		log.FuncErrorTrace("Tenant Id not present: %v", tenantId)
	}
	timerMapLock.Unlock()
	return nil
}

/**********************************************************************************
 * FUNCTION:        notifier
 *
 * DESCRIPTION:     Callback function for timer expiry
 *
 * INPUT:           timerId     : timer id returned by start timer
 *
 * RETURNS:         VOID
 **********************************************************************************/
func notifier(timerId int) {
	log.EnterFn(0, "notifier")
	var err error
	defer func() { log.ExitFn(0, "notifier", err) }()
	timerData := getTenantMapEntry("XYZ", timerId)
	if nil != timerData {
		if timerData.timerState == Started {
			/*call handler func()*/
			timerData.funcHandler(timerData.TimerType, timerData.DataContext)

			if timerData.Recurring {
				afterFuncTimer := time.AfterFunc(time.Second*time.Duration(timerData.TimerDuration),
					func() {
						notifier(timerData.timerId)
					})
				timerData.timer = afterFuncTimer
				return
			}

			timerData.timerStateLock.Lock()
			timerData.timerState = Expired
			timerData.timerStateLock.Unlock()
			/*Delete function will lock the map Entry again, hence calling outside lock*/
			stopAndDeleteTenantMapEntry("XYZ", timerId)
		} else {
			log.FuncErrorTrace("timer not running %v", fmt.Sprintf("%+v", timerId))
			//deleteTenantMapEntry("XYZ", timerId)
		}
		log.FuncInfoTrace("Timer id expired %v", fmt.Sprintf("%+v", timerId))
	} else {
		log.FuncErrorTrace("Invalid Timer id expired %v", fmt.Sprintf("%+v", timerId))
	}
}

/**********************************************************************************
 * FUNCTION:        StartTimer
 *
 * DESCRIPTION:     This functions is used start the timer as per the request
 *
 * INPUT:           timerdata    : timer data provided by application
 *
 * RETURNS:         *time.Timer  : timer id
 *                  error        : error code
 **********************************************************************************/
func StartTimer(timerdata TimerData) (int, error) {
	log.EnterFn(0, "StartTimer")
	defer func() { log.ExitFn(0, "StartTimer", nil) }()
	var dbTimerdata = new(DbTimerData)
	var timerId = 0

	dbTimerdata.DataContext = timerdata.DataContext
	dbTimerdata.Recurring = timerdata.Recurring
	dbTimerdata.TimerDuration = timerdata.TimeToExpire
	dbTimerdata.funcHandler = timerdata.FuncHandler
	dbTimerdata.TimerType = timerdata.TimerType

	if TimerIdCount < 50000 {
		TimerIdCount++
		timerId = TimerIdCount
	} else {
		timerId, FreeTimerIdQ = dequeueTimerId(FreeTimerIdQ)
	}

	if 0 == timerId {
		log.FuncErrorTrace("Unable to generate timerId: TimerIdCount: %v", fmt.Sprintf("%+v", TimerIdCount))
		return 0, nil
	}

	afterFuncTimer := time.AfterFunc(time.Second*time.Duration(timerdata.TimeToExpire),
		func() {
			notifier(dbTimerdata.timerId)
		})

	dbTimerdata.timer = afterFuncTimer
	dbTimerdata.timerState = Started
	dbTimerdata.timerId = timerId
	//checkAndInsertTenantMapEntry(common.OperatorID.TenantID, dbTimerdata)
	checkAndInsertTenantMapEntry("XYZ", dbTimerdata)
	return timerId, nil
}

/**********************************************************************************
 * FUNCTION:        StopTimer
 *
 * DESCRIPTION:     This functions is used stop the timer as per the request
 *
 * INPUT:           timerId      : timer id returned by start timer
 *
 * RETURNS:         error        : error code
 **********************************************************************************/
func StopTimer(timerId int) error {

	//deleteTenantMapEntry (common.OperatorID.TenantID, timerId)
	stopAndDeleteTenantMapEntry("XYZ", timerId)

	return nil
}
