package auroraclient

type AuroraConfig struct {
	AuroraTenantId    string `json:"auroraTenantId"`
	AuroraBearerToken string `json:"auroraBearerToken"`
	AuroraApiBaseUrl  string `json:"auroraApiBaseUrl"`
}

var AuroraCfg AuroraConfig
