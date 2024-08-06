package inmemory

import (
	log "OWEApp/shared/logger"
	"database/sql"
	"fmt"
	"os"
	"strings"
	"text/tabwriter"
)

func CreateSQLiteTable(db *sql.DB) error {
	createTableSQL := `
	CREATE TABLE im_consolidated_data_view (
		unique_id TEXT,
		installer TEXT,
		customer_last_contacted TIMESTAMP,
		home_owner TEXT,
		office TEXT,
		system_size FLOAT,
		prospect_working_date TIMESTAMP,
		hours_to_welcome_call TEXT,
		first_5_days_date TIMESTAMP,
		site_survey_scheduled_date TIMESTAMP,
		site_survey_rescheduled_date TIMESTAMP,
		site_survey_completed_date TIMESTAMP,
		cad_rejection_date TIMESTAMP,
		peee_rejection_date TIMESTAMP,
		cad_requested_date TIMESTAMP,
		cad_designer TEXT,
		cad_ready TIMESTAMP,
		cad_complete_date TIMESTAMP,
		cad_redline TIMESTAMP,
		cad_revision_requested_date TIMESTAMP,
		cad_revisions_completed TIMESTAMP,
		abcad_ready TIMESTAMP,
		abcad_completed TIMESTAMP,
		abcad_revised TIMESTAMP,
		abcad_revisions_completed TIMESTAMP,
		cad_review_date TIMESTAMP,
		cad_reviewer TEXT,
		permit_redlined TIMESTAMP,
		peee_submitted_date TIMESTAMP,
		ab_permit_redlined TIMESTAMP,
		peee_complete_date TIMESTAMP,
		peee_redline_date TIMESTAMP,
		stamp_provider TEXT,
		ahj TEXT,
		permit_created TIMESTAMP,
		permit_submitted_date TIMESTAMP,
		permit_expected_approval_date TIMESTAMP,
		permitting_specialist TEXT,
		permit_re_submitted_date TIMESTAMP,
		permit_approved_date TIMESTAMP,
		fire_permit_created_date TIMESTAMP,
		fire_permit_submitted_date TIMESTAMP,
		fire_permit_approved_date TIMESTAMP,
		battery_permit_created_date TIMESTAMP,
		battery_permit_submitted_date TIMESTAMP,
		battery_permit_approved_date TIMESTAMP,
		electrical_permit_created_date TIMESTAMP,
		electrical_permit_submitted_date TIMESTAMP,
		electrical_permit_approved_date TIMESTAMP,
		pv_redlined_date TIMESTAMP,
		permit_turnaround_time TEXT,
		ic_created_date TIMESTAMP,
		ic_submitted_date TIMESTAMP,
		ic_expected_approval_date TIMESTAMP,
		utility_specialist TEXT,
		utility_company TEXT,
		ic_re_submitted_date TIMESTAMP,
		ic_approved_date TIMESTAMP,
		ic_rejection_date TIMESTAMP,
		canceled_date TIMESTAMP,
		pv_install_created_date TIMESTAMP,
		pv_install_completed_date TIMESTAMP,
		pv_install_completed_date_r TIMESTAMP,
		electrical_submitted_date TIMESTAMP,
		electrical_approved_date TIMESTAMP,
		pto_created_date TIMESTAMP,
		pto_submitted_date TIMESTAMP,
		pto_fail_date TIMESTAMP,
		pto_date TIMESTAMP,
		inverter_part_number TEXT,
		module TEXT,
		customer TEXT,
		prospect TEXT,
		project_status TEXT,
		puma_cat TEXT,
		puma_cat_supervisor TEXT,
		source TEXT,
		loan_type TEXT,
		contract_date TIMESTAMP,
		contract_date_r TIMESTAMP,
		ntp_working_date TIMESTAMP,
		ntp_date TIMESTAMP,
		ntp_date_r TIMESTAMP,
		credit_expiration_date TIMESTAMP,
		shaky_status_date TIMESTAMP,
		cancelled_date TIMESTAMP,
		pv_install_scheduled_date TIMESTAMP,
		install_eta TIMESTAMP,
		dealer TEXT,
		account_executive TEXT,
		partner TEXT,
		state TEXT,
		address TEXT,
		finance_company TEXT,
		finance_id TEXT,
		primary_sales_rep TEXT,
		secondary_sales_rep TEXT,
		contract_total FLOAT,
		net_epc FLOAT,
		prospect_created_on TIMESTAMP,
		wc_1 TIMESTAMP,
		wc_2 TIMESTAMP,
		active_date TIMESTAMP,
		permit_submittal_eta TIMESTAMP,
		estimated_project_lifespan TEXT,
		adjusted_project_lifespan TEXT,
		project_lifespan_delta TEXT,
		customer_email TEXT,
		customer_phone_number TEXT,
		team_region_untd TEXT,
		jeopardy_date TIMESTAMP,
		recruiter TEXT,
		setter TEXT,
		director TEXT,
		surveyor_name TEXT,
		permit_redline_count TEXT,
		permit_resubmitted_date TIMESTAMP,
		ab_resubmitted_date TIMESTAMP,
		install_ready_date TIMESTAMP,
		install_rescheduled_date TIMESTAMP,
		install_team TEXT,
		install_manager TEXT,
		rtr_request_date_and_time TIMESTAMP,
		rtr_approved_date TIMESTAMP,
		roofing_created_date TIMESTAMP,
		roofing_scheduled_date TIMESTAMP,
		roofing_completed_date TIMESTAMP,
		derate_ready_date TIMESTAMP,
		derate_scheduled_date TIMESTAMP,
		derate_completed_date TIMESTAMP,
		derate_tech TEXT,
		mpu_ready_date TIMESTAMP,
		mpu_scheduled_date TIMESTAMP,
		mpu_tech TEXT,
		battery_ready_date TIMESTAMP,
		battery_scheduled_date TIMESTAMP,
		battery_complete_date TIMESTAMP,
		initial_battery_tech TEXT,
		fin_scheduled_date TIMESTAMP,
		technician_assigned TEXT,
		fin_rescheduled_date TIMESTAMP,
		fin_created_date TIMESTAMP,
		fin_fail_date TIMESTAMP,
		fin_pass_date TIMESTAMP,
		service_created_date TIMESTAMP,
		service_pending_action_date TIMESTAMP,
		service_reschedule_count TEXT,
		service_reschedule_date TIMESTAMP,
		service_scheduled_date TIMESTAMP,
		service_completion_date TIMESTAMP,
		mpu_created_date TIMESTAMP,
		mpu_complete_date TIMESTAMP,
		fin_pv_redlined_date TIMESTAMP,
		derate_created_date TIMESTAMP,
		first_battery_type TEXT,
		first_battery_qty TEXT,
		second_battery_type TEXT,
		second_battery_qty TEXT,
		survey_2nd_completion_date TIMESTAMP,
		pv_install_complete_1_2_date TIMESTAMP,
		pv_install_complete_2_3_date TIMESTAMP,
		adder_breakdown_and_total TEXT,
		adders_total TEXT,
		adder_breakdown_and_total2 TEXT,
		owe_funded_adder_breakdown_and_total TEXT,
		trenching_ws_open TIMESTAMP,
		trenching_completed TIMESTAMP,
		trenching_scheduled TIMESTAMP,
		assigned_foreman TEXT,
		team TEXT,
		region TEXT,
		epc FLOAT
	);`
	_, err := db.Exec(createTableSQL)
	return err
}

func TransferData(pgDB, sqliteDB *sql.DB) error {
	query := `SELECT * FROM consolidated_data_view` // Replace with your PostgreSQL view name
	rows, err := pgDB.Query(query)
	if err != nil {
		return err
	}

	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return err
	}

	insertStmt, err := PrepareInsertStatement(sqliteDB, columns)
	if err != nil {
		return err
	}
	defer insertStmt.Close()

	for rows.Next() {
		values, valuePtrs := ScanRow(rows, columns)
		if err := rows.Scan(valuePtrs...); err != nil {
			return err
		}
		if _, err := insertStmt.Exec(values...); err != nil {
			return err
		}
	}
	return rows.Err()
}

func PrepareInsertStatement(db *sql.DB, columns []string) (*sql.Stmt, error) {
	placeholders := make([]string, len(columns))
	for i := range placeholders {
		placeholders[i] = "?"
	}
	insertStmt := fmt.Sprintf(`
	INSERT INTO im_consolidated_data_view (%s)
	VALUES (%s)`,
		strings.Join(columns, ", "),
		strings.Join(placeholders, ", "))
	return db.Prepare(insertStmt)
}

func ScanRow(rows *sql.Rows, columns []string) ([]interface{}, []interface{}) {
	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	for i := range columns {
		valuePtrs[i] = &values[i]
	}
	return values, valuePtrs
}

func PrintSQLiteData(db *sql.DB) {
	rows, err := db.Query("SELECT * FROM im_consolidated_data_view")
	if err != nil {
		log.FuncErrorTrace(0, "Error: ", err)
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		log.FuncErrorTrace(0, "Error: ", err)
	}

	values := make([]interface{}, len(columns))
	valuePtrs := make([]interface{}, len(columns))
	for i := range columns {
		valuePtrs[i] = &values[i]
	}

	w := new(tabwriter.Writer)
	w.Init(os.Stdout, 0, 8, 1, '\t', 0)

	fmt.Fprintln(w, strings.Join(columns, "\t"))

	for rows.Next() {
		if err := rows.Scan(valuePtrs...); err != nil {
			log.FuncErrorTrace(0, "Error: ", err)
		}

		rowData := make([]string, len(columns))
		for i, val := range values {
			rowData[i] = fmt.Sprintf("%v", val)
		}
		fmt.Fprintln(w, strings.Join(rowData, "\t"))
	}

	if err := rows.Err(); err != nil {
		log.FuncErrorTrace(0, "Error: ", err)
	}

	w.Flush()
}

func ConnectSQLite() (*sql.DB, error) {
	connStr := "file::memory:?cache=shared"
	db, err := sql.Open("sqlite3", connStr)
	if err != nil {
		return nil, err
	}
	return db, nil
}
