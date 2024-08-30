/**************************************************************************
*	Function	: 	googlemapsModels.go
*	DESCRIPTION : 	Files contains struct for googlemaps api handlers
*	DATE        : 	29-Aug-2024
**************************************************************************/

package googlemaps

const apikey = "AIzaSyDestipqgaIX-VsZUuhDSGbNk_bKAV9dX0"

//
// REQUEST BODY TYPE DECLARATIONS
//

type RouteMatrixReqLatLng struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type RouteMatrixReqRouteModifiers struct {
	AvoidFerries bool `json:"avoid_ferries"`
}

type RouteMatrixReqLocation struct {
	LatLng RouteMatrixReqLatLng `json:"latLng"`
}

// a waypoint, either LatLng or Address must be provided
type RouteMatrixReqWaypoint struct {
	Location *RouteMatrixReqLocation `json:"location,omitempty"`
	Address  *string                 `json:"address,omitempty"`
}

type RouteMatrixReqItem struct {
	Waypoint       RouteMatrixReqWaypoint        `json:"waypoint"`
	RouteModifiers *RouteMatrixReqRouteModifiers `json:"routeModifiers,omitempty"`
}

type RouteMatrixReq struct {
	// Origins to calculate the matrices
	Origins []RouteMatrixReqItem `json:"origins"`

	// Destinations to calculate the matrices
	Destinations []RouteMatrixReqItem `json:"destinations"`

	// "TRAFFIC_UNAWARE" | "TRAFFIC_AWARE" | "TRAFFIC_AWARE_OPTIMAL"
	RoutingPreference string `json:"routingPreference,omitempty"`

	// "DRIVE" | "BICYCLE" | "WALK" | "TWO_WHEELER" | "TRANSIT"
	TravelMode string `json:"travelMode,omitempty"`
}

//
// RESPONSE BODY TYPE DECLARATIONS
//

type RouteMatrixRespItem struct {
	OriginIndex      int    `json:"originIndex"`
	DestinationIndex int    `json:"destinationIndex"`
	DistanceMeters   int    `json:"distanceMeters"`
	Duration         string `json:"duration"`
}

type RouteMatrixResp []RouteMatrixRespItem

// Function Specific declarations: RouteMatrixByAddresses
type RouteByAddress struct {
	SrcAddress  string
	DestAddress string
	RouteMatrix RouteMatrixRespItem
}
