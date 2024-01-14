package services

import (
	"math/rand"
	"time"
)

func Contains(slice []string, item string) bool {
	set := make(map[string]struct{}, len(slice))
	for _, s := range slice {
		set[s] = struct{}{}
	}
	_, ok := set[item]
	return ok
}

func GenerateRandomNumInRange(low, hi int) int {
	rand.Seed(time.Now().UnixNano())
	return low + rand.Intn(hi-low)
}
