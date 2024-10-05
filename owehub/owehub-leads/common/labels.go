/**************************************************************************
 *	File            : labels.go
 * 	DESCRIPTION     : This file contains common labels used across lead apis
 *	DATE            : 28-Sep-2024
 **************************************************************************/
package common

type LeadTimelineLabel string

const (
	LeadTimelineLabelScheduled       LeadTimelineLabel = "Appoitment Scheduled"
	LeadTimelineLabelAccepted        LeadTimelineLabel = "Appointment Accepted"
	LeadTimelineLabelAppointment     LeadTimelineLabel = "Appointment Date"
	LeadTimelineLabelActionNeed      LeadTimelineLabel = "Action Needed"
	LeadTimelineLabelWon             LeadTimelineLabel = "Deal Won"
	LeadTimelineLabelLost            LeadTimelineLabel = "Deal Lost"
	LeadTimelineLabelProposalCreated LeadTimelineLabel = "Proposal Sent"
)
