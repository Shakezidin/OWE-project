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

type LeadEventLabel string

const (
	LeadEventLabelSubject        LeadEventLabel = "OWE on site visit"
	LeadEventLabelBody           LeadEventLabel = "Let's discuss about the proposal."
	LeadEventLabelBodyReschedule LeadEventLabel = "We have rescheduled your meeting."
)

type LeadDocusignLabel string

const (
	LeadDocusignLabelSubject      LeadDocusignLabel = "Please Sign the Proposal"
	LeadDocusignLabelDocumentName LeadDocusignLabel = "Proposal"
)
