/**************************************************************************
 *      File            : routeMatrix.go
 *      DESCRIPTION     : This file contains functions to handle api calls
 *						  to googlemaps routeMatrix api
 *      DATE            : 29-Aug-2024
**************************************************************************/

package googlemaps

import (
	log "OWEApp/shared/logger"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

/******************************************************************************
 * FUNCTION:        callRouteMatrixApi
 *
 * DESCRIPTION:     This function will Hit the google maps api with apt
 *					input & get desired output
 *
 * INPUT:           route matrix request
 *
 * RETURNS:         *RouteMatrixResp: api response
 *                  error        	: api error
 ******************************************************************************/
func CallRouteMatrixApi(reqBody *RouteMatrixReq) (*RouteMatrixResp, error) {
	var (
		err         error
		bodyBytes   []byte
		client      http.Client
		req         *http.Request
		resp        *http.Response
		apiResponse RouteMatrixResp
	)

	log.EnterFn(0, "callRouteMatrixApi")
	defer func() { log.ExitFn(0, "callRouteMatrixApi", err) }()

	bodyBytes, err = json.Marshal(reqBody)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to marshal routeMatrix request body err: %v", err)
		return nil, err
	}

	req, err = http.NewRequest(
		http.MethodPost,
		"https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix",
		bytes.NewReader(bodyBytes),
	)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to create routeMatrix request err: %v", err)
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-FieldMask", "originIndex,destinationIndex,duration,distanceMeters")
	req.Header.Set("X-Goog-Api-Key", apikey)

	client = http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err = client.Do(req)

	if err != nil {
		log.FuncErrorTrace(0, "Failed to get routeMatrix err: %v", err)
		return nil, err
	}

	if resp.StatusCode != 200 {
		err = fmt.Errorf("googleapis response status: %s", resp.Status)
		log.FuncErrorTrace(0, "Failed to get routeMatrix err: %v", err)
		return nil, err
	}

	err = json.NewDecoder(resp.Body).Decode(&apiResponse)
	if err != nil {
		log.FuncErrorTrace(0, "Failed to unmarshal routeMatrix response body err: %v", err)
		return nil, err
	}
	resp.Body.Close()
	return &apiResponse, nil
}

/******************************************************************************
 * FUNCTION:        GetRoutesByAddress
 *
 * DESCRIPTION:     This function will fetch route matrices specified by src and dest
 *					addresses
 *
 * INPUT:           route matrix request
 *
 * RETURNS:         *RouteMatrixResp: api response
 *                  error        	: api error
 ******************************************************************************/
func GetRoutesByAddress(src []string, dest []string) (*[]RouteByAddress, error) {
	var (
		origins      []RouteMatrixReqItem
		destinations []RouteMatrixReqItem
		output       []RouteByAddress
		err          error
		respRaw      *RouteMatrixResp
	)

	log.EnterFn(0, "GetRoutesByAddress")
	defer func() { log.ExitFn(0, "GetRoutesByAddress", err) }()

	if len(src) == 0 || len(dest) == 0 {
		return &output, nil
	}

	// prepare origins
	for _, address := range src {
		origins = append(origins, RouteMatrixReqItem{
			Waypoint: RouteMatrixReqWaypoint{
				Address: &address,
			},
		})
	}

	// prepare destinations
	for _, address := range dest {
		destinations = append(destinations, RouteMatrixReqItem{
			Waypoint: RouteMatrixReqWaypoint{
				Address: &address,
			},
		})
	}

	respRaw, err = CallRouteMatrixApi(&RouteMatrixReq{
		Origins:           origins,
		Destinations:      destinations,
		TravelMode:        "DRIVE",
		RoutingPreference: "TRAFFIC_AWARE",
	})

	if err != nil {
		log.FuncErrorTrace(0, "Failed call to route matrix api err: %v", err)
		return nil, err
	}

	for _, item := range *respRaw {
		output = append(output, RouteByAddress{
			SrcAddress:  src[item.OriginIndex],
			DestAddress: dest[item.DestinationIndex],
			RouteMatrix: item,
		})
	}

	return &output, nil
}

// func RouteMatrixByLatLng(src *RouteMatrixReqLatLng, dest *RouteMatrixReqLatLng) (*RouteMatrixResp, error) {
// 	resp, err := callRouteMatrixApi(&RouteMatrixReq{
// 		Origins: []RouteMatrixReqItem{
// 			{
// 				Waypoint: RouteMatrixReqWaypoint{
// 					Location: &RouteMatrixReqLocation{
// 						LatLng: *src,
// 					},
// 				},
// 			},
// 		},
// 		Destinations: []RouteMatrixReqItem{
// 			{
// 				Waypoint: RouteMatrixReqWaypoint{
// 					Location: &RouteMatrixReqLocation{
// 						LatLng: *dest,
// 					},
// 				},
// 			},
// 		},
// 		TravelMode:        "DRIVE",
// 		RoutingPreference: "TRAFFIC_AWARE",
// 	})

// 	if err != nil {
// 		return nil, err
// 	}
// 	return resp, nil
// }
