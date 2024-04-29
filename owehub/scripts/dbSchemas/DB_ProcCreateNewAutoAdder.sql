CREATE OR REPLACE FUNCTION create_new_auto_adder(
    p_unique_id               character varying,
	p_type_aa_mktg            character varying,
	p_gc                      character varying,
	p_exact_amount            character varying,
	p_per_kw_amount           double precision,
	p_rep_doll_divby_per      double precision,
	p_description_rep_visible character varying,
	p_notes_not_rep_visible   character varying,
	p_type                    character varying,
	p_rep_1_name              character varying,
	p_rep_2_name              character varying,
	p_sys_size                double precision,
	p_state_name              character varying,
	p_rep_count               double precision,
	p_per_rep_addr_share      double precision,
	p_per_rep_ovrd_share      double precision,
	p_r1_pay_scale            double precision,
	p_rep_1_def_resp          character varying,
	p_r1_addr_resp            character varying,
	p_r2_pay_scale            double precision,
	p_rep_2_def_resp          character varying,
    p_r2_addr_resp            character varying,
	p_contract_amount         double precision,
	p_project_base_cost       double precision,
	p_crt_addr                double precision,
	p_r1_loan_fee             double precision,
	p_r1_rebate               double precision,
	p_r1_referral             double precision,
	p_r1_r_plus_r             double precision,
	p_total_comm              double precision,
	p_start_date              character varying,
	p_end_date                character varying,
    OUT v_auto_adder_id INT
)
RETURNS INT
AS $$
DECLARE
    v_rep_1_id INT;
    v_rep_2_id INT;
    v_state_id INT;
BEGIN
    -- Get the user_id based on the provided p_rep_1_name
    SELECT user_id INTO v_rep_1_id
    FROM user_details
    WHERE name = p_rep_1_name;

    -- Check if the user exists
    IF v_rep_1_id IS NULL THEN
        RAISE EXCEPTION 'user % not found', p_rep_1_name;
    END IF;

    -- Get the user_id based on the provided p_rep_2_name
    SELECT user_id INTO v_rep_2_id
    FROM user_details
    WHERE name = p_rep_2_name;

    -- Check if the user exists
    IF v_rep_2_id IS NULL THEN
        RAISE EXCEPTION 'user % not found', p_rep_2_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Insert a new auto_adder into auto_adder table
    INSERT INTO auto_adder (
        unique_id,
        type_aa_mktg,
        gc,
        exact_amount,
        per_kw_amount,
        rep_doll_divby_per,
        description_rep_visible,
        notes_not_rep_visible,
        type,
        rep_1,
        rep_2,
        sys_size,
        state_id,
        rep_count,
        per_rep_addr_share,
        per_rep_ovrd_share,
        r1_pay_scale,
        rep_1_def_resp,
        r1_addr_resp,
        r2_pay_scale,
        rep_2_def_resp,
        r2_addr_resp,
        contract_amount,
        project_base_cost,
        crt_addr,
        r1_loan_fee,
        r1_rebate,
        r1_referral,
        r1_r_plus_r,
        total_comm,
        start_date,
        end_date
    )
    VALUES (
    p_unique_id,
	p_type_aa_mktg,
	p_gc,
	p_exact_amount,
	p_per_kw_amount,
	p_rep_doll_divby_per,
	p_description_rep_visible,
	p_notes_not_rep_visible,
	p_type,
	v_rep_1_id,
	v_rep_2_id,
	p_sys_size,
	v_state_id,
	p_rep_count,
	p_per_rep_addr_share,
	p_per_rep_ovrd_share,
	p_r1_pay_scale,
	p_rep_1_def_resp,
	p_r1_addr_resp,
	p_r2_pay_scale,
	p_rep_2_def_resp,
    p_r2_addr_resp,
	p_contract_amount,
	p_project_base_cost,
	p_crt_addr,
	p_r1_loan_fee,
	p_r1_rebate,
	p_r1_referral,
	p_r1_r_plus_r,
	p_total_comm,
	p_start_date,
	p_end_date
    )
    RETURNING id INTO v_auto_adder_id;

END;
$$ LANGUAGE plpgsql;
