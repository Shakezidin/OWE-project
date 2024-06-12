CREATE OR REPLACE FUNCTION create_new_rebate_data(
    p_unique_id               character varying,
    p_customer_verf           character varying,
	p_type_rd_mktg            character varying,
    p_item                    character varying,
	p_amount                  character varying,
	p_rep_doll_divby_per      double precision,
    p_notes                   character varying,
    p_type                    character varying,
	p_rep_1_name              character varying,
	p_rep_2_name              character varying,
	p_sys_size                double precision,
	p_rep_count               double precision,
	p_state_name              character varying,
	p_per_rep_addr_share      double precision,
	p_per_rep_ovrd_share      double precision,
	p_r1_pay_scale            double precision,
	p_rep_1_def_resp          character varying,
	p_r1_addr_resp            character varying,
	p_r2_pay_scale            double precision,
	p_per_rep_def_ovrd        character varying,
    p_r1_rebate_credit_$        character varying,
    p_r1_rebate_credit_perc     character varying,
    p_r2_rebate_credit_$        character varying,
    p_r2_rebate_credit_perc     character varying, 
	p_start_date              character varying,
	p_end_date                character varying,
    OUT v_rebate_data_id INT
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

    -- Insert a new rebate_data into rebate data table
    INSERT INTO rebate_data (
        unique_id,
        customer_verf,
        type_rd_mktg,
        item,
        amount,
        rep_doll_divby_per,
        notes,
        type,
        rep_1,
        rep_2,
        sys_size,
        rep_count,
        state_id,
        per_rep_addr_share,
        per_rep_ovrd_share,
        r1_pay_scale,
        rep_1_def_resp,
        r1_addr_resp,
        r2_pay_scale,
        per_rep_def_ovrd,
        r1_rebate_credit_$,
        r1_rebate_credit_perc,
        r2_rebate_credit_$,
        r2_rebate_credit_perc,
        start_date,
        end_date   
    )
    VALUES (
    p_unique_id,
    p_customer_verf,
	p_type_rd_mktg,
    p_item,
	p_amount,
	p_rep_doll_divby_per,
    p_notes,
    p_type,
	v_rep_1_id,
	v_rep_2_id,
	p_sys_size,
	p_rep_count,
	v_state_id,
	p_per_rep_addr_share,
	p_per_rep_ovrd_share,
	p_r1_pay_scale,
	p_rep_1_def_resp,
	p_r1_addr_resp,
	p_r2_pay_scale,
	p_per_rep_def_ovrd,
    p_r1_rebate_credit_$,
    p_r1_rebate_credit_perc,
    p_r2_rebate_credit_$,
    p_r2_rebate_credit_perc, 
	p_start_date,
	p_end_date
    )
    RETURNING id INTO v_rebate_data_id;

END;
$$ LANGUAGE plpgsql;
