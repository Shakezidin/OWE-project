/**************************************************************************
 *	Function		: podioModels.go
 *	DESCRIPTION : Files contains struct for podio
 *	DATE        : 20-Jan-2024
 **************************************************************************/

package models

type AccessTokenResponse struct {
	AccessToken string `json:"access_token"`
}

type CreateItemResponse struct {
	ItemId        float64 `json:"item_id"`
	ItemPodioLink string  `json:"link"`
}

type CreateItemRequest struct {
	Fields map[string]interface{} `json:"fields"`
}

type UpdateItemRequest struct {
	Fields map[string]interface{} `json:"fields"`
}

type PodioDatas struct {
	DealerItemId int64
	PartnerId    string
	PositionId   int
	ItemId       int64
}

type PodioDeleteRequest struct {
	ItemIDs []int64 `json:"item_ids"`
}
