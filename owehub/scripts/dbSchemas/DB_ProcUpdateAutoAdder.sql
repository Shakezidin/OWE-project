CREATE OR REPLACE FUNCTION update_auto_adder(
    p_id INT,
    p_unique_id               VARCHAR,
	p_type_aa_mktg            VARCHAR,
	p_gc                      VARCHAR,
	p_exact_amount            VARCHAR,
	p_per_kw_amount           DOUBLE PRECISION,
	p_rep_doll_divby_per      DOUBLE PRECISION,
	p_description_rep_visible VARCHAR,
	p_notes_not_rep_visible   VARCHAR,
	p_type                    VARCHAR,
	p_rep_1_name              VARCHAR,
	p_rep_2_name              VARCHAR,
	p_sys_size                DOUBLE PRECISION,
	p_state_name              VARCHAR,
	p_rep_count               DOUBLE PRECISION,
	p_per_rep_addr_share      DOUBLE PRECISION,
	p_per_rep_ovrd_share      DOUBLE PRECISION,
	p_r1_pay_scale            DOUBLE PRECISION,
	p_rep_1_def_resp          VARCHAR,
	p_r1_addr_resp            VARCHAR,
	p_r2_pay_scale            DOUBLE PRECISION,
	p_rep_2_def_resp          VARCHAR,
    p_r2_addr_resp            VARCHAR,
	p_contract_amount         DOUBLE PRECISION,
	p_project_base_cost       DOUBLE PRECISION,
	p_crt_addr                DOUBLE PRECISION,
	p_r1_loan_fee             DOUBLE PRECISION,
	p_r1_rebate               DOUBLE PRECISION,
	p_r1_referral             DOUBLE PRECISION,
	p_r1_r_plus_r             DOUBLE PRECISION,
	p_total_comm              DOUBLE PRECISION,
	p_start_date              VARCHAR,
	p_end_date                VARCHAR,
    OUT v_auto_adder_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE auto_adder
    SET 
        unique_id = p_unique_id,
        type_aa_mktg = p_type_aa_mktg,
        gc = p_gc,
        exact_amount = p_exact_amount,
        per_kw_amount = p_per_kw_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        description_rep_visible = p_description_rep_visible,
        notes_not_rep_visible = p_notes_not_rep_visible,
        type = p_type,
        rep_1 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_1_name) LIMIT 1),
        rep_2 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_2_name) LIMIT 1),
        sys_size = p_sys_size,
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        rep_count = p_rep_count,
        per_rep_addr_share = p_per_rep_addr_share,
        per_rep_ovrd_share = p_per_rep_ovrd_share,
        r1_pay_scale = p_r1_pay_scale,
        rep_1_def_resp = p_rep_1_def_resp,
        r1_addr_resp = p_r1_addr_resp,
        r2_pay_scale = p_r2_pay_scale,
        rep_2_def_resp = p_rep_2_def_resp,
        r2_addr_resp = p_r2_addr_resp,
        contract_amount = p_contract_amount,
        project_base_cost = p_project_base_cost,
        crt_addr = p_crt_addr,
        r1_loan_fee = p_r1_loan_fee,
        r1_rebate = p_r1_rebate,
        r1_referral = p_r1_referral,
        r1_r_plus_r = p_r1_r_plus_r,
        total_comm = p_total_comm,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_auto_adder_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in auto_adder table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in auto_adder: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;