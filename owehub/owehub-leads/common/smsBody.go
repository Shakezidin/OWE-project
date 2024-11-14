/**************************************************************************
 *	File            : smsBody.go
 * 	DESCRIPTION     : This file contains common sms body
 *	DATE            : 28-Sep-2024
 **************************************************************************/
 package common

 import (
	 log "OWEApp/shared/logger"
	 "bytes"
	 "html/template"
 )
 
 type SmsBodyTemplate string
 
 func (t SmsBodyTemplate) WithData(data any) string {
	 var (
		 err  error
		 tmpl *template.Template
		 out  *bytes.Buffer
	 )
 
	 log.EnterFn(0, "SmsBodyTemplate.WithData")
	 defer func() { log.ExitFn(0, "SmsBodyTemplate.WithData", err) }()
 
	 out = bytes.NewBufferString("")
 
	 tmpl, err = template.New("SmsBodyTemplate").Parse(string(t))
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to parse sms body template err: %v", err)
		 return ""
	 }
 
	 err = tmpl.Execute(out, data)
	 if err != nil {
		 log.FuncErrorTrace(0, "Failed to execute sms body template err: %v", err)
		 return ""
	 }
 
	 template.New("SmsBody").Parse(string(t))
	 return out.String()
 }
 
 // -----------------------------------------------------------------------------

 const SmsAppointmentSent SmsBodyTemplate = `Dear {{.UserName}},
 Appointment has been sent to your lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) on owehub platform.
 Please search the leads app with id OWE{{.LeadId}} to view more details.
 Regards,
 Our World Energy
 `
 
 type SmsDataAppointmentSent struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsAppointmentRescheduled SmsBodyTemplate = `Dear {{.UserName}},
 Appointment with lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been rescheduled on owehub platform.
 Please search the leads app with id OWE{{.LeadId}} to view more details.
 Regards,
 Our World Energy
 `
 
 type SmsDataAppointmentRescheduled struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsLeadWon SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been marked as won.
  Please search the platform for the lead using the lead ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataLeadWon struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsLeadLost SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been marked as lost and moved to the Records.
  Please search the platform for the lead using the lead ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataLeadLost struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsLeadWonManual SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been marked as won manually and moved to the Records.
  Please search the platform for the lead using the lead ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataLeadWonManual struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsAppointmentNotRequired SmsBodyTemplate = `Dear {{.UserName}},
 Appointment with lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been marked as not required.
 Please search the platform for the lead using the lead ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataAppointmentNotRequired struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsLeadProposalCreated SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has been marked as won manually.
  Please search the platform for the lead using the lead ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataLeadProposalCreated struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsLeadProposalSigned SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has signed the proposal.
 It's now moved to the Records section. Please search the platform for the lead using ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataLeadProposalSigned struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
const SmsHomeOwner SmsBodyTemplate = `Dear {{.LeadFirstName}} {{.LeadLastName}},
{{.Message}}
Regards,
Our World Energy
`

type SmsDataHomeOwner struct {
	LeadFirstName string
	LeadLastName  string
	Message       string
}

// -----------------------------------------------------------------------------

 const SmsAppointmentAccepted SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has accepted the appointment.
 Please search the platform for the lead using ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataAppointmentAccepted struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 
 // -----------------------------------------------------------------------------

 const SmsAppointmentDeclined SmsBodyTemplate = `Dear {{.UserName}},
 Lead {{.LeadFirstName}} {{.LeadLastName}} (OWE{{.LeadId}}) has declined the appointment.
 Please search the platform for the lead using ID OWE{{.LeadId}} to view the details.
 Regards,
 Our World Energy
 `
 
 type SmsDataAppointmentDeclined struct {
	 LeadId        int64
	 LeadFirstName string
	 LeadLastName  string
	 UserName      string
 }
 