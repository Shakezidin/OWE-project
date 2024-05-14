export interface Any {
    unqiue_id:                  string;
    sales_completed:            string;
    ntp_pending:                string;
    ntp_completed:              string;
    site_survey_scheduled:      string;
    site_survey_rescheduled:    string;
    site_survey_completed:      string;
    roofing_pending:            string;
    roofing_scheduled:          string;
    roofing_completed:          string;
    electrical_pending:         string;
    electrical_scheduled:       string;
    electrical_completed:       string;
    pv_permit_pending:          string;
    pv_permit_scehduled:        string;
    pv_permit_completed:        string;
    ic_permit_pending:          string;
    ic_permit_scheduled:        string;
    ic_permit_completed:        string;
    install_pending:            string;
    install_ready:              string;
    install_scheduled:          string;
    install_completed:          string;
    final_inspection_submitted: string;
    final_inspection_approved:  string;
    pto_in_process:             string;
    pto_submitted:              string;
    pto_completed:              string;
    SystemSize:                 number;
    adder:                      string;
    ajh:                        string;
    epc:                        string;
    state:                      string;
    contract_amount:            number;
    finance_partner:            string;
    net_epc:                    number;
}
