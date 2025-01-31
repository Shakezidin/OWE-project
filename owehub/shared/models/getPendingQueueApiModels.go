/**************************************************************************
 *	Function	: getPendingQueueModels.go
 *	DESCRIPTION : Files contains struct for get pending queue models
 *	DATE        : 03-Sep-2024
 **************************************************************************/

package models

type PendingQueueReq struct {
	PageNumber           int `json:"page_number"`
	PageSize             int `json:"page_size"`
	Email                string
	UniqueIds            []string `json:"unique_ids"`
	DealerNames          []string
	SelectedPendingStage string `json:"selected_pending_stage"`
	StartDate            string `json:"start_date"`
	EndDate              string `json:"end_date"`
}

type PendingQueueQC struct {
	PowerClerk                           string `json:"powerclerk"`
	ACHWaiveSendandSignedCashOnly        string `json:"ach_waiver"`
	GreenAreaNMOnly                      string `json:"green_area"`
	FinanceCreditApprovalLoanorLease     string `json:"finance_credit"`
	FinanceAgreementCompletedLoanorLease string `json:"finance_agreement"`
	OWEDocumentsCompleted                string `json:"owe_document"`
}

type PendingQueueNTP struct {
	ProductionDiscrepancy        string `json:"production"`
	FinanceNTPOfProject          string `json:"finance_NTP"`
	UtilityBillUploaded          string `json:"utility_bill"`
	PowerClerkSignaturesComplete string `json:"powerclerk"`
}

type PendingQueueCo struct {
	CO       string `json:"co"`
	CoStatus string `json:"co_status"`
}

type GetPendingQueue struct {
	UniqueId  string          `json:"uninque_id"`
	HomeOwner string          `json:"home_owner"`
	Co        PendingQueueCo  `json:"co"`
	Ntp       PendingQueueNTP `json:"ntp"`
	Qc        PendingQueueQC  `json:"qc"`
}

type GetPendingQueueList struct {
	PendingQueueList []GetPendingQueue `json:"pending_queue_list"`
}

type GetPendingQueueTileResp struct {
	QcPendingCount  int64 `json:"qc_pending_count"`
	NTPPendingCount int64 `json:"ntp_pending_count"`
	CoPendingCount  int64 `json:"co_pending_count"`
}
